// Shot contract validation: the JSON schema, then the checks a schema cannot express.
// Errors are plain sentences naming the field and, where one applies, the rule it enforces.
import { readFileSync } from 'node:fs';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { SCHEMA, REVERED, CLOSE_FRAMINGS, FIELD_RULE } from './rules.mjs';

const ajv = new Ajv2020({ allErrors: true, strict: true, verbose: true });
const checkSchema = ajv.compile(SCHEMA);

function ruleFor(path) {
  return FIELD_RULE[path.split('/')[1]];
}

function describe(e) {
  const at = e.instancePath || '(contract)';
  switch (e.keyword) {
    case 'contains': return [e.instancePath, `${at} must include "${e.schema.const}"`];
    case 'required': return [`/${e.params.missingProperty}`, `${at} is missing "${e.params.missingProperty}"`];
    case 'additionalProperties': return [e.instancePath, `${at} has an unknown field "${e.params.additionalProperty}"`];
    case 'enum': return [e.instancePath, `${at} is ${JSON.stringify(e.data)}; it must be one of ${e.params.allowedValues.join(', ')}`];
    case 'pattern': return [e.instancePath, `${at} ${JSON.stringify(e.data)} does not match ${e.params.pattern}`];
    default: return [e.instancePath, `${at} ${e.message}`];
  }
}

function issue(path, message) {
  const rule = ruleFor(path);
  return { path, rule, message: rule ? `${message} (rule ${rule})` : message };
}

/**
 * Validate one contract object.
 * @param {object} contract
 * @param {{ resolveClaim?: (id: string) => unknown, revered?: string[] }} [opts] resolveClaim
 *   returns a falsy value for a claim id the canon cannot resolve; revered adds canon-flagged
 *   figures to REVERED (it can only extend the list).
 * @returns {{ ok: boolean, errors: { path: string, rule?: number, message: string }[] }}
 */
export function validateContract(contract, { resolveClaim, revered = [] } = {}) {
  if (!checkSchema(contract)) {
    const errors = checkSchema.errors
      .filter((e) => e.keyword !== 'allOf')
      .map((e) => issue(...describe(e)));
    return { ok: false, errors };
  }

  const errors = [];
  if (!contract.id.startsWith(contract.chapter + '-')) {
    errors.push(issue('/id', `/id "${contract.id}" does not belong to chapter "${contract.chapter}"`));
  }
  if (CLOSE_FRAMINGS.includes(contract.camera.framing)) {
    const never = new Set([...REVERED, ...revered]);
    for (const ref of contract.references) {
      const [kind, name] = ref.split('.');
      if (kind === 'char' && never.has(name)) {
        errors.push(issue('/forbidden', `/camera/framing "${contract.camera.framing}" with ${ref} is a facial close-up of a revered figure`));
      }
    }
  }
  if (resolveClaim) {
    for (const id of contract.claims) {
      if (!resolveClaim(id)) errors.push(issue('/claims', `/claims "${id}" does not resolve to a passage in the canon`));
    }
  }
  return { ok: errors.length === 0, errors };
}

/** Read and validate a contract file. A file that is not JSON is one error, not a throw. */
export function validateFile(path, opts) {
  let contract;
  try {
    contract = JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    return { ok: false, errors: [{ path: '', message: err.code === 'ENOENT' ? 'file not found' : `not valid JSON: ${err.message}` }] };
  }
  return validateContract(contract, opts);
}
