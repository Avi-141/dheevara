// The model registry: the only place model ids, prices, licences and territories live. Every entry
// cites the row of docs/research/fal.md it came from (retrieved 2026-10-04); test/render.test.mjs
// fails if an endpoint id is missing from that file. Prices are fal's displayed per-second rates.
//
// territory:
//   'worldwide'   output may be shown anywhere
//   'india_only'  output may not be shown outside India (rule 4). Every MiniMax H3 endpoint is
//                 india_only until fal or MiniMax confirm otherwise in writing (decision of 4 Oct).

export const MODELS = {
  'kling-v3-standard-t2v': {
    family: 'kling-3.0',
    endpoint: 'fal-ai/kling-video/v3/standard/text-to-video',
    provider: 'fal', partner: 'Kuaishou',
    licence: 'commercial (fal catalog license_type: commercial)',
    territory: 'worldwide',
    durations: { min: 3, max: 15, integer: true, asString: true },
    resolutions: null, // no resolution field; output resolution unverified
    usdPerSecond: { default: 0.084 }, // audio off
    seed: false, negativePrompt: true, loras: false,
    research: 'docs/research/fal.md — Kling 3.0 table, standard text-to-video',
  },
  'kling-v3-pro-t2v': {
    family: 'kling-3.0',
    endpoint: 'fal-ai/kling-video/v3/pro/text-to-video',
    provider: 'fal', partner: 'Kuaishou',
    licence: 'commercial (fal catalog license_type: commercial)',
    territory: 'worldwide',
    durations: { min: 3, max: 15, integer: true, asString: true },
    resolutions: null,
    usdPerSecond: { default: 0.112 }, // audio off
    seed: false, negativePrompt: true, loras: false,
    research: 'docs/research/fal.md — Kling 3.0 table, pro text-to-video',
  },
  'wan-3.0-t2v': {
    family: 'wan-3.0',
    endpoint: 'alibaba/wan-3.0/text-to-video',
    provider: 'fal', partner: 'Alibaba',
    licence: 'commercial (fal catalog license_type: commercial)',
    territory: 'worldwide',
    durations: { min: 2, max: 30, integer: true },
    resolutions: ['480p', '720p', '1080p'],
    usdPerSecond: { '480p': 0.05, '720p': 0.1, '1080p': 0.2 },
    seed: true, negativePrompt: false, loras: false,
    research: 'docs/research/fal.md — Wan 3.0 table, text-to-video',
  },
  'wan-3.0-r2v': {
    family: 'wan-3.0',
    endpoint: 'alibaba/wan-3.0/reference-to-video',
    provider: 'fal', partner: 'Alibaba',
    licence: 'commercial (fal catalog license_type: commercial)',
    territory: 'worldwide',
    durations: { min: 2, max: 30, integer: true },
    resolutions: ['480p', '720p', '1080p'],
    usdPerSecond: { '480p': 0.05, '720p': 0.1, '1080p': 0.2 }, // plus input video seconds, none used
    seed: true, negativePrompt: false, loras: false, needsReferenceImages: true,
    research: 'docs/research/fal.md — Wan 3.0 table, reference-to-video',
  },
  'h3-lora-r2v': {
    family: 'minimax-h3',
    endpoint: 'minimax/h3/reference-to-video/lora',
    provider: 'fal', partner: null, // fal-run
    licence: 'MiniMax H3 Community License (2 Aug 2026): Outputs not usable outside the Applicable Territory',
    territory: 'india_only',
    durations: { min: 5, max: 15, integer: true },
    resolutions: ['480P', '768P', '2K', '4K'],
    usdPerSecond: { '480P': 0.0625, '768P': 0.075, '2K': 0.1625, '4K': 0.2 },
    seed: true, negativePrompt: false, loras: true, needsLora: true,
    research: 'docs/research/fal.md — MiniMax H3 table, reference-to-video/lora; H3 territory section',
  },
  'h3-selfhost': {
    family: 'minimax-h3',
    endpoint: null, // no GPU box
    provider: 'selfhost', partner: null,
    licence: 'MiniMax H3 Community License (2 Aug 2026), self-hosted open weights',
    territory: 'india_only',
    durations: { min: 5, max: 15, integer: true },
    resolutions: ['480P'],
    usdPerSecond: { '480P': 0 },
    seed: true, negativePrompt: false, loras: true, unavailable: 'no self-hosted GPU box',
    research: 'docs/research/fal.md — H3 territory section (self-hosted weights carry the same licence)',
  },
  'ltx-2.5-t2v-fast': {
    family: 'ltx-2.5',
    endpoint: 'lightricks/ltx-2.5/text-to-video/fast',
    provider: 'fal', partner: 'Lightricks',
    licence: 'commercial (fal catalog license_type: commercial)',
    territory: 'worldwide',
    durations: { allowed: [6, 8, 10, 12, 14, 16, 18, 20] },
    resolutions: ['720p', '1080p', '1440p', '2160p'],
    usdPerSecond: { '720p': 0.09, '1080p': 0.13, '1440p': 0.19, '2160p': 0.3 },
    seed: false, negativePrompt: false, loras: false,
    research: 'docs/research/fal.md — LTX-2.5 table, text-to-video/fast',
  },
};

/** Draft and final resolution per model (rule 6: drafts are 480p where the model offers it). */
export const TIERS = {
  'kling-v3-standard-t2v': { draft: null },
  'kling-v3-pro-t2v': { final: null },
  'wan-3.0-t2v': { draft: '480p', final: '1080p' },
  'wan-3.0-r2v': { draft: '480p', final: '1080p' },
  'h3-lora-r2v': { draft: '480P', final: '2K' },
  'h3-selfhost': { draft: '480P' },
  'ltx-2.5-t2v-fast': { draft: '720p', final: '1080p' },
};

export class RegistryError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RegistryError';
  }
}

export function model(id) {
  const m = MODELS[id];
  if (!m) throw new RegistryError(`unknown model "${id}"; models live only in src/render/models.mjs`);
  return { id, ...m };
}

/** The billed duration for a requested one: the shortest allowed duration that covers it. */
export function billedDuration(m, seconds) {
  const d = m.durations;
  if (d.allowed) {
    const fit = d.allowed.find((x) => x >= seconds);
    if (!fit) throw new RegistryError(`${m.id}: ${seconds} s is longer than its longest take (${d.allowed.at(-1)} s)`);
    return fit;
  }
  const s = d.integer ? Math.ceil(seconds) : seconds;
  if (s > d.max) throw new RegistryError(`${m.id}: ${seconds} s is longer than its longest take (${d.max} s)`);
  return Math.max(s, d.min);
}

/** Estimated dollars for one take. */
export function estimateUsd(m, seconds, resolution) {
  const rate = m.usdPerSecond[resolution ?? 'default'];
  if (rate === undefined) throw new RegistryError(`${m.id}: no price for resolution ${resolution}`);
  return Math.round(billedDuration(m, seconds) * rate * 1e6) / 1e6;
}
