// Routing a contract to a model (Build Brief, model routing), and rule 4 at the router.
//   hook, reveal, cliffhanger  -> Kling 3.0 (standard for drafts, pro for finals)
//   stakes, connective          -> Wan 3.0 (480p drafts, 1080p finals)
//   reference-locked characters -> Wan 3.0 reference-to-video once the asset bible has images;
//                                  MiniMax H3 only for india_only contracts (all H3 is india_only)
import { model, MODELS } from './models.mjs';

export class TerritoryError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TerritoryError';
  }
}

/** Rule 4: a worldwide contract may never be rendered by an india_only model. */
export function assertTerritory(contract, m) {
  if (contract.territory === 'worldwide' && m.territory === 'india_only') {
    throw new TerritoryError(`rule 4: ${contract.id} is worldwide but ${m.id} is india_only (${m.licence}); its output cannot be shown outside India`);
  }
}

const PREMIUM = new Set(['hook', 'reveal', 'cliffhanger']);

/**
 * Pick the model for a contract.
 * @param {object} contract
 * @param {{ quality?: 'draft'|'final', override?: string, referenceImageUrls?: string[] }} [opts]
 */
export function route(contract, { quality = contract.quality, override, referenceImageUrls = [] } = {}) {
  let id;
  if (override) {
    id = override;
  } else if (referenceImageUrls.length && contract.references.some((r) => r.startsWith('char.'))) {
    id = contract.territory === 'india_only' ? 'h3-lora-r2v' : 'wan-3.0-r2v';
  } else if (PREMIUM.has(contract.retention)) {
    id = quality === 'final' ? 'kling-v3-pro-t2v' : 'kling-v3-standard-t2v';
  } else {
    id = 'wan-3.0-t2v';
  }
  const m = model(id);
  assertTerritory(contract, m);
  return m;
}

/** Ledger rows whose model's territory is narrower than the contract's (should always be empty). */
export function territoryBreaches(rows) {
  return rows.filter((r) => r.kind === 'render' && r.contractTerritory === 'worldwide' && MODELS[r.model]?.territory === 'india_only');
}
