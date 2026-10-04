import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { requireEnv, optionalEnv, maxRunUsd, redact, MissingEnvError, ROOT } from '../src/env.mjs';

test('rule 8: a missing key throws, naming the variable and where to set it', () => {
  assert.throws(() => requireEnv('SARVAM_API_KEY', {}), (err) => {
    assert.ok(err instanceof MissingEnvError);
    assert.equal(err.variable, 'SARVAM_API_KEY');
    assert.match(err.message, /SARVAM_API_KEY is not set \(needed for Sarvam Bulbul/);
    assert.match(err.message, /cloud environment's settings/);
    return true;
  });
});

test('an empty value counts as missing', () => {
  assert.equal(optionalEnv('EXA_API_KEY', { EXA_API_KEY: '' }), undefined);
  assert.throws(() => requireEnv('EXA_API_KEY', { EXA_API_KEY: '' }), MissingEnvError);
});

test('a set key is returned as is', () => {
  assert.equal(requireEnv('FAL_KEY', { FAL_KEY: 'abc' }), 'abc');
});

test('MAX_RUN_USD has no default and must be a positive number', () => {
  assert.throws(() => maxRunUsd({}), /MAX_RUN_USD is not set/);
  assert.throws(() => maxRunUsd({ MAX_RUN_USD: 'fifteen' }), /must be a positive number/);
  assert.throws(() => maxRunUsd({ MAX_RUN_USD: '0' }), /must be a positive number/);
  assert.equal(maxRunUsd({ MAX_RUN_USD: '15' }), 15);
});

test('rule 8: errors and logs can be redacted of every secret value', () => {
  const env = { SARVAM_API_KEY: 'fake-key-1234', JEV_BASE_URL: 'https://jev.example' };
  const text = 'request failed with header api-subscription-key: fake-key-1234 to https://jev.example';
  assert.equal(redact(text, env), 'request failed with header api-subscription-key: [SARVAM_API_KEY] to https://jev.example');
});

test('a local .env is loaded but never overrides the environment', () => {
  const dir = mkdtempSync(join(tmpdir(), 'env-'));
  const file = join(dir, '.env');
  writeFileSync(file, 'EXA_API_KEY=from-file\nJEV_BASE_URL=https://from-file.example\n');
  const script = `
    import { loadDotEnv, optionalEnv } from ${JSON.stringify(join(ROOT, 'src/env.mjs'))};
    loadDotEnv(${JSON.stringify(file)});
    console.log(optionalEnv('EXA_API_KEY'), optionalEnv('JEV_BASE_URL'));`;
  const res = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
    encoding: 'utf8',
    env: { PATH: process.env.PATH, EXA_API_KEY: 'from-env' },
  });
  assert.equal(res.status, 0, res.stderr);
  assert.equal(res.stdout.trim(), 'from-env https://from-file.example');
});
