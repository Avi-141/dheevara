// Rule data for shot contracts. What the schema can express is read from it, so the schema
// stays the one source; the rest lives here.
import { readFileSync } from 'node:fs';
import { ROOT } from '../env.mjs';

export const SCHEMA = JSON.parse(readFileSync(ROOT + 'schema/shot-contract.schema.json', 'utf8'));

/** Rule 1: every contract's `forbidden` list carries these. */
export const MANDATORY_FORBIDDEN = SCHEMA.properties.forbidden.allOf.map((s) => s.contains.const);

/** Rule 1: the witnesses a shot may stand with. */
export const WITNESSES = SCHEMA.$defs.witness.enum;

/**
 * Rule 1: characters who are never framed close on the face. Until the canon marks each person
 * (M5), this list is the gate; extend it, never shorten it, without a scholar's note.
 */
export const REVERED = [
  'agni', 'balarama', 'brahma', 'durga', 'ganesha', 'ganga', 'hanuman', 'indra', 'krishna',
  'lakshmi', 'parvati', 'rama', 'sarasvati', 'shiva', 'sita', 'surya', 'vishnu',
];

/** Framings that read as a facial close-up. */
export const CLOSE_FRAMINGS = ['close', 'medium_close'];

/** Style bible section 7: medium_wide is the closest framing for any person in frame. */
export const CLOSER_THAN_MEDIUM_WIDE = ['medium', 'medium_close', 'close'];

/** Which of the nine rules a contract field carries, for error messages. */
export const FIELD_RULE = { witness: 1, forbidden: 1, claims: 2, territory: 4, quality: 6, camera: 1 };
