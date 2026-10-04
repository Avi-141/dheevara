// The ledger: one append-only JSONL file per chapter. Rule 3: a row is written and flushed to
// disk before any provider request, and a second row records the outcome. Rows carry what the
// licence, territory and cost questions need, because they cannot be answered afterwards.
import { openSync, writeSync, fsyncSync, closeSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

/** One id per CLI invocation, so a run's spend can be summed. */
export const RUN_ID = `${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`;

export class Ledger {
  /** @param {string} path a .jsonl file; created on first write */
  constructor(path) {
    this.path = path;
  }

  /** Append one row and fsync before returning. */
  append(row) {
    const full = { at: new Date().toISOString(), run: RUN_ID, ...row };
    mkdirSync(dirname(this.path), { recursive: true });
    const fd = openSync(this.path, 'a');
    try {
      writeSync(fd, JSON.stringify(full) + '\n');
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
    return full;
  }

  /** Every row, oldest first. */
  rows() {
    if (!existsSync(this.path)) return [];
    return readFileSync(this.path, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  }

  /** The latest row for an idempotency key, or undefined. */
  latest(key) {
    let found;
    for (const r of this.rows()) if (r.key === key) found = r;
    return found;
  }

  /** Dollars recorded as spent (phase done) in one run. */
  spentUsd(run = RUN_ID) {
    return this.rows().filter((r) => r.run === run && r.phase === 'done').reduce((s, r) => s + (r.usd ?? 0), 0);
  }
}

export class BudgetError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BudgetError';
  }
}

/**
 * A per-run spend cap. reserve() is called with an estimate before each request and throws
 * when the run would pass the cap; settle() replaces the estimate with the billed amount.
 */
export class Budget {
  constructor(capUsd) {
    if (!(capUsd > 0)) throw new BudgetError('a budget needs a positive cap in dollars');
    this.capUsd = capUsd;
    this.committedUsd = 0;
  }

  reserve(estUsd, what) {
    if (!(estUsd >= 0)) throw new BudgetError(`${what}: no cost estimate; refusing to spend blind`);
    if (this.committedUsd + estUsd > this.capUsd) {
      throw new BudgetError(
        `${what}: estimated $${estUsd.toFixed(4)} would take this run to $${(this.committedUsd + estUsd).toFixed(4)}, over MAX_RUN_USD $${this.capUsd}`,
      );
    }
    this.committedUsd += estUsd;
    return estUsd;
  }

  settle(estUsd, actualUsd) {
    this.committedUsd += actualUsd - estUsd;
  }
}
