// What each external service may receive. Rule 5: unreleased source passages never go to a
// service whose terms allow training on inputs. Every entry cites docs/research/ and its terms URL;
// a service with no entry here cannot be called (handoff section 9: no service whose data-use
// terms are not recorded).

/**
 * trainsOnInputs:
 *   'no'        the terms say inputs are not used for training
 *   'opt-out'   the terms allow training unless the account opts out (or contradict each other)
 *   'yes'       the terms say inputs are used for training
 */
export const PROVIDERS = {
  sarvam: {
    name: 'Sarvam AI',
    trainsOnInputs: 'opt-out',
    research: 'docs/research/sarvam.md',
    terms: ['https://www.sarvam.ai/privacy-policy', 'https://www.sarvam.ai/eula', 'https://www.sarvam.ai/terms-of-service'],
    retrieved: '2026-10-04',
  },
  jev: {
    name: 'TypeSafe (Jev)',
    trainsOnInputs: 'no',
    research: 'docs/research/jev.md',
    terms: ['https://typesafe.ai/legal/privacy-policy', 'https://typesafe.ai/legal/mca'],
    retrieved: '2026-10-04',
  },
  exa: {
    name: 'Exa',
    trainsOnInputs: 'yes',
    research: 'docs/research/sources.md',
    terms: ['https://exa.ai/privacy-policy'],
    retrieved: '2026-10-04',
  },
  vagdhenu: {
    name: 'Vāgdhenu (our own GPU box)',
    trainsOnInputs: 'no',
    research: 'docs/research/vagdhenu.md',
    terms: ['https://github.com/prathoshap/vagdhenu/blob/main/LICENSE'],
    retrieved: '2026-10-04',
  },
};

/**
 * What a payload contains:
 *   'public'             published text (the critical edition, public-domain translations)
 *   'script'             our narration and captions, written from public text
 *   'unreleased_source'  passages from our books or lineage material not yet released
 */
export const DATA_CLASSES = ['public', 'script', 'unreleased_source'];

export class DataUseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DataUseError';
  }
}

/** Throws unless `provider` may receive data of class `dataClass`. */
export function assertDataUse(provider, dataClass) {
  const p = PROVIDERS[provider];
  if (!p) throw new DataUseError(`${provider}: no data-use terms recorded in src/providers.mjs; it cannot be called`);
  if (!DATA_CLASSES.includes(dataClass)) throw new DataUseError(`unknown data class "${dataClass}"`);
  if (dataClass === 'unreleased_source' && p.trainsOnInputs !== 'no') {
    throw new DataUseError(
      `rule 5: ${p.name} may train on inputs (${p.trainsOnInputs}; see ${p.research}); unreleased source passages cannot be sent to it`,
    );
  }
}
