// Rule 8: the gitleaks pre-commit hook blocks a commit that stages a key and lets a clean one
// through. Runs in a throwaway repo whose core.hooksPath is this repo's .githooks.
// The fake key is built at runtime, so this file holds nothing the scanner would flag.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomBytes, randomUUID } from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';
import { ROOT } from '../src/env.mjs';

// Git variables that would point the child at this repo instead of the temp one.
const env = { ...process.env };
for (const k of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_OBJECT_DIRECTORY']) delete env[k];

const git = (cwd, ...args) => spawnSync('git', args, { cwd, env, encoding: 'utf8' });

let repo;

before(() => {
  // Install the pinned gitleaks once, outside the hook, so a slow first install is not a commit.
  execFileSync(join(ROOT, 'scripts/gitleaks.sh'), ['--path'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
  repo = mkdtempSync(join(tmpdir(), 'precommit-'));
  for (const args of [
    ['init', '-q', '-b', 'main'],
    ['config', 'user.name', 'Pre-commit Test'],
    ['config', 'user.email', 'precommit@example.invalid'],
    ['config', 'commit.gpgsign', 'false'],
    ['config', 'core.hooksPath', join(ROOT, '.githooks')],
  ]) assert.equal(git(repo, ...args).status, 0);
});

test('rule 8: staging a fake FAL_KEY assignment blocks the commit', () => {
  const name = ['FAL', 'KEY'].join('_');
  const fakeKey = `${randomUUID()}:${randomBytes(16).toString('hex')}`;
  writeFileSync(join(repo, 'config.env'), `${name}=${fakeKey}\n`);
  assert.equal(git(repo, 'add', 'config.env').status, 0);

  const res = git(repo, 'commit', '-q', '-m', 'add config');
  assert.notEqual(res.status, 0, 'the commit should have been blocked');
  assert.match(res.stderr, /gitleaks found a secret in the staged changes; the commit is blocked/);
  assert.ok(!res.stderr.includes(fakeKey), 'the hook output must not print the key');
  assert.notEqual(git(repo, 'rev-parse', '--verify', '-q', 'HEAD').status, 0, 'no commit was created');

  assert.equal(git(repo, 'rm', '-q', '--cached', 'config.env').status, 0);
});

test('a clean file commits', () => {
  writeFileSync(join(repo, 'README.md'), 'Nothing secret here.\n');
  assert.equal(git(repo, 'add', 'README.md').status, 0);
  const res = git(repo, 'commit', '-q', '-m', 'add readme');
  assert.equal(res.status, 0, res.stderr);
  assert.equal(git(repo, 'log', '--format=%s').stdout.trim(), 'add readme');
});
