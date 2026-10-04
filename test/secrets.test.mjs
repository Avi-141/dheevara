// Rule 8: secrets only from the environment. .env files stay out of git; .env.example is
// committed, names every variable the pipeline reads, and holds no value.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, VARS } from '../src/env.mjs';

const ignored = (path) => spawnSync('git', ['check-ignore', '-q', '--no-index', path], { cwd: ROOT }).status === 0;

test('rule 8: .env and .env.* are ignored', () => {
  for (const path of ['.env', '.env.local', '.env.production', 'src/.env', 'services/vagdhenu/.env.local']) {
    assert.ok(ignored(path), `${path} should be ignored`);
  }
});

test('.env.example is not ignored', () => {
  assert.ok(!ignored('.env.example'));
});

test('.env.example lists exactly the variables in VARS, every value empty', () => {
  const lines = readFileSync(join(ROOT, '.env.example'), 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
  const entries = lines.map((l) => {
    const m = /^([A-Z][A-Z0-9_]*)=(.*)$/.exec(l);
    assert.ok(m, `not a NAME=value line: ${l.split('=')[0]}`);
    return [m[1], m[2]];
  });
  assert.deepEqual(entries.map(([name]) => name).sort(), Object.keys(VARS).sort());
  for (const [name, value] of entries) assert.equal(value, '', `${name} must be empty in .env.example`);
});

test('rule 8: no .env file other than .env.example is tracked', () => {
  const res = spawnSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(res.status, 0, res.stderr);
  const tracked = res.stdout.split('\0').filter((p) => basename(p).startsWith('.env'));
  assert.deepEqual(tracked, ['.env.example']);
});
