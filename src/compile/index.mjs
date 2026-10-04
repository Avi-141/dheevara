// The prompt compiler: one shot contract plus a routed model compiles to that model's fal input,
// deterministically (same contract, attempt and options give byte-identical output). No network.
// Rule 1 travels as negative prompt (or an "Avoid:" sentence for models without one); rule 4 is
// checked in src/render/route.mjs before anything compiles.
import { createHash } from 'node:crypto';
import { STONE, STYLE, WITNESS, FRAMING, HEIGHT, MOVE, NEGATIVE_BASE, FORBIDDEN_PHRASES } from './fragments.mjs';
import { billedDuration, estimateUsd, TIERS } from '../render/models.mjs';

export class CompileError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CompileError';
  }
}

/** A seed fixed by shot and attempt, so a retry is a new take and a re-run is the same take. */
export function seedFor(shotId, attempt) {
  return createHash('sha256').update(`${shotId}:${attempt}`).digest().readUInt32BE(0) & 0x7fffffff;
}

function epic(contract) {
  const text = contract.claims[0].split('.')[0];
  if (!STONE[text]) throw new CompileError(`${contract.id}: no stone defined for "${text}" (style bible section 2)`);
  return text;
}

/** The positive prompt: style, camera, witness, setting, action. */
export function prompt(contract, { lightSide = 'the left' } = {}) {
  const c = contract.camera;
  const camera = [FRAMING[c.framing], HEIGHT[c.height ?? 'eye'], c.lensMm ? `${c.lensMm}mm lens` : null, MOVE[c.move]].filter(Boolean).join(', ');
  return [
    `${STYLE.base(STONE[epic(contract)])}.`,
    `${STYLE.light(lightSide)}.`,
    `${STYLE.motion(MOVE[c.move])}.`,
    `${STYLE.palette}.`,
    `Camera: ${camera}.`,
    `Vantage: ${WITNESS[contract.witness]}.`,
    `Setting: ${contract.setting}.`,
    `Action: ${contract.blocking}`,
  ].join(' ');
}

/** The negative phrases: the style bible's base list plus the contract's forbidden tokens. */
export function negatives(contract) {
  const out = [...NEGATIVE_BASE];
  for (const token of contract.forbidden) {
    const phrase = FORBIDDEN_PHRASES[token];
    if (!phrase) throw new CompileError(`${contract.id}: forbidden token "${token}" has no phrase in src/compile/fragments.mjs`);
    out.push(phrase);
  }
  return [...new Set(out)];
}

const LTX_MOTION = { static: 'static', push_in: 'dolly_in', pull_out: 'dolly_out', crane: 'jib_up', tilt: 'jib_down', track: 'dolly_right', pan: 'dolly_left', orbit: 'dolly_right' };

/**
 * Compile one contract for one model.
 * @param {object} contract a validated shot contract
 * @param {object} m a registry entry (src/render/models.mjs model())
 * @param {{ attempt?: number, quality?: 'draft'|'final', aspect?: string, referenceImageUrls?: string[], loras?: object[] }} [opts]
 */
export function compile(contract, m, { attempt = 1, quality = contract.quality, aspect = '9:16', referenceImageUrls = [], loras = [] } = {}) {
  if (m.unavailable) throw new CompileError(`${m.id} is unavailable: ${m.unavailable}`);
  const resolution = TIERS[m.id]?.[quality];
  if (resolution === undefined) throw new CompileError(`${m.id} has no ${quality} tier`);
  const billedS = billedDuration(m, contract.durationS);
  const seed = m.seed ? seedFor(contract.id, attempt) : null;
  const text = prompt(contract);
  const neg = negatives(contract).join(', ');
  const withAvoid = `${text} Avoid: ${neg}.`;

  let input;
  switch (m.family) {
    case 'kling-3.0':
      input = { prompt: text, negative_prompt: neg, duration: String(billedS), aspect_ratio: aspect, generate_audio: false, cfg_scale: 0.5 };
      break;
    case 'wan-3.0':
      if (m.needsReferenceImages && referenceImageUrls.length === 0) throw new CompileError(`${m.id} needs reference images; the asset bible has none yet (DHE-12)`);
      input = {
        prompt: withAvoid, resolution, aspect_ratio: aspect, duration: billedS, audio: false,
        enable_prompt_expansion: false, seed, enable_safety_checker: true,
        ...(m.needsReferenceImages ? { reference_image_urls: referenceImageUrls } : {}),
      };
      break;
    case 'minimax-h3':
      if (m.needsLora && loras.length === 0) throw new CompileError(`${m.id} needs a trained style LoRA; none exists, and training needs Avi's yes`);
      input = {
        prompt: withAvoid, loras, duration: billedS, resolution, aspect_ratio: aspect, seed, prompt_expansion_mode: 'disabled',
        ...(referenceImageUrls.length ? { reference_image_urls: referenceImageUrls } : {}),
      };
      break;
    case 'ltx-2.5':
      input = { prompt: withAvoid, duration: billedS, resolution, aspect_ratio: aspect, generate_audio: false, camera_motion: LTX_MOTION[contract.camera.move] };
      break;
    default:
      throw new CompileError(`no compiler for model family ${m.family}`);
  }

  const body = JSON.stringify(input);
  return {
    shot: contract.id,
    attempt,
    quality,
    model: m.id,
    endpoint: m.endpoint,
    resolution,
    billedS,
    trimToS: contract.durationS,
    estUsd: estimateUsd(m, contract.durationS, resolution ?? undefined),
    seed,
    licence: m.licence,
    territory: m.territory,
    inputHash: createHash('sha256').update(body).digest('hex').slice(0, 16),
    input,
  };
}
