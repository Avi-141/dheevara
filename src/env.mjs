// Environment loading. Rule 8: secrets come only from the environment.
// A local .env (gitignored) is read for development; it never overrides a variable that is
// already set. Nothing here prints a secret's value.
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));

/** Every variable the pipeline reads. `.env.example` must list exactly these. */
export const VARS = {
  SARVAM_API_KEY: { secret: true, purpose: 'Sarvam Bulbul TTS, speech-to-text and Vision OCR' },
  EXA_API_KEY: { secret: true, purpose: 'Exa reference corpus' },
  FAL_KEY: { secret: true, purpose: 'fal video, image and LoRA' },
  JEV_API_KEY: { secret: true, purpose: 'Jev decision and routing layer' },
  JEV_BASE_URL: { secret: false, purpose: 'Jev API base URL' },
  VAGDHENU_URL: { secret: false, purpose: 'Vāgdhenu chant service on a CUDA box' },
  MAX_RUN_USD: { secret: false, purpose: 'spend cap per run in US dollars' },
};

export class MissingEnvError extends Error {
  constructor(name, detail) {
    const purpose = VARS[name]?.purpose;
    super(
      `${name} ${detail}${purpose ? ` (needed for ${purpose})` : ''}. ` +
        `Set it in the cloud environment's settings or in a local .env; see .env.example.`,
    );
    this.name = 'MissingEnvError';
    this.variable = name;
  }
}

let loaded = false;

/** Read `<root>/.env` into process.env once, without overriding variables already set. */
export function loadDotEnv(path = ROOT + '.env') {
  if (loaded) return;
  loaded = true;
  if (existsSync(path)) process.loadEnvFile(path);
}

/** The value of `name`, or undefined when unset or empty. */
export function optionalEnv(name, env = process.env) {
  if (env === process.env) loadDotEnv();
  const value = env[name];
  return value === undefined || value === '' ? undefined : value;
}

/** The value of `name`; throws a MissingEnvError naming the variable when it is unset. */
export function requireEnv(name, env = process.env) {
  const value = optionalEnv(name, env);
  if (value === undefined) throw new MissingEnvError(name, 'is not set');
  return value;
}

/** MAX_RUN_USD as a positive number. There is no default: an unset cap blocks spending. */
export function maxRunUsd(env = process.env) {
  const raw = requireEnv('MAX_RUN_USD', env);
  const usd = Number(raw);
  if (!Number.isFinite(usd) || usd <= 0) throw new MissingEnvError('MAX_RUN_USD', 'must be a positive number of dollars');
  return usd;
}

/** Replace the value of every secret variable found in `text` with a placeholder. */
export function redact(text, env = process.env) {
  let out = String(text);
  for (const [name, { secret }] of Object.entries(VARS)) {
    const value = secret && env[name];
    if (value && value.length >= 4) out = out.replaceAll(value, `[${name}]`);
  }
  return out;
}
