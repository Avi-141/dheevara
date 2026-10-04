// fal webhook receiver, for deployment only: this cloud container cannot receive inbound calls, so
// runs poll the queue (decision of 4 Oct). Verification per docs/research/fal.md (Queue API,
// Webhooks): ED25519 over `request_id \n user_id \n timestamp \n hex(sha256(raw body))`, checked
// against every key in fal's JWKS, with a 300-second clock window.
import { createHash, createPublicKey, verify } from 'node:crypto';

export const JWKS_URL = 'https://rest.fal.ai/.well-known/jwks.json';
export const MAX_SKEW_S = 300;

/** A Node public key from one JWKS entry (OKP, Ed25519, x in base64url). */
export function keyFromJwk(jwk) {
  return createPublicKey({ key: { kty: 'OKP', crv: 'Ed25519', x: jwk.x }, format: 'jwk' });
}

/**
 * Verify one delivery. headers are lower-cased; rawBody is the exact bytes received.
 * @returns {{ ok: boolean, reason?: string }}
 */
export function verifyWebhook({ headers, rawBody, jwks, nowS = Math.floor(Date.now() / 1000) }) {
  const requestId = headers['x-fal-webhook-request-id'];
  const userId = headers['x-fal-webhook-user-id'];
  const timestamp = headers['x-fal-webhook-timestamp'];
  const signature = headers['x-fal-webhook-signature'];
  if (!requestId || !userId || !timestamp || !signature) return { ok: false, reason: 'missing signature headers' };
  if (Math.abs(nowS - Number(timestamp)) > MAX_SKEW_S) return { ok: false, reason: 'timestamp outside the 300 s window' };
  const message = Buffer.from([requestId, userId, timestamp, createHash('sha256').update(rawBody).digest('hex')].join('\n'), 'utf8');
  const sig = Buffer.from(signature, 'hex');
  for (const jwk of jwks.keys ?? []) {
    try {
      if (verify(null, message, keyFromJwk(jwk), sig)) return { ok: true };
    } catch {
      // a malformed key is skipped; another may verify
    }
  }
  return { ok: false, reason: 'no JWKS key verifies the signature' };
}

/**
 * An HTTP handler for deployment: verifies, then hands the parsed payload to onResult.
 * @param {{ getJwks: () => Promise<object>, onResult: (payload: object) => Promise<void> }} deps
 */
export function handler({ getJwks, onResult }) {
  return async (req, res) => {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const rawBody = Buffer.concat(chunks);
    const headers = Object.fromEntries(Object.entries(req.headers).map(([k, v]) => [k.toLowerCase(), String(v)]));
    const v = verifyWebhook({ headers, rawBody, jwks: await getJwks() });
    if (!v.ok) {
      res.writeHead(401).end(v.reason);
      return;
    }
    await onResult(JSON.parse(rawBody.toString('utf8')));
    res.writeHead(200).end('ok');
  };
}
