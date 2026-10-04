# Jev (TypeSafe): what it is, its terms, and where it could fit

Retrieved 2026-10-04 from https://docs.typesafe.ai (Markdown copies at `<page>.md`, index at https://docs.typesafe.ai/llms.txt) and https://typesafe.ai/legal/*.

**Status: proposal only.** Nothing in the pipeline routes through Jev until Avi says yes (decision of 3 Oct; brief of 4 Oct).

The key was checked on 2026-10-04 with `GET https://api.typesafe.ai/v1/models` (→ 200; lists `jev-latest` and `jev-preview`, both released 2026-09-10). No content was sent.

## What it is

Jev is TypeSafe's "System One" model. It doesn't generate text. You send a **state** (text or JSON) and a map of typed **questions**, and every question is evaluated against the state in parallel and independently (https://docs.typesafe.ai/introduction.md). There are three question types (https://docs.typesafe.ai/primitives.md):

| Type | Asks | Returns |
|---|---|---|
| `noul` | Is this statement true? | `noul`, 0–1 |
| `choice` | Pick one option from up to 255 | `choice`, `probabilities`, `confidence` |
| `score` | Rate against 2–10 ordered levels | `score` (expected level), `legend`, `probabilities`, `confidence` |

It's "not a chat or code-completion LLM" and can't write scripts or prompts (https://docs.typesafe.ai/introduction/coding-agents.md).

## API

| Fact | Value | Source |
|---|---|---|
| Endpoint | `POST https://api.typesafe.ai/v1/systemone` | https://docs.typesafe.ai/api.md |
| Auth | `Authorization: Bearer <key>` | same |
| Body | `{ state, model, questions: { <id>: { type, instructions, criteria } } }` | same |
| Response | `{ model: "jev-1.13.0", answers: { <id>: … }, usage: { input_tokens, output_tokens } }` | same |
| Errors | 401, 422 (validation), 429 (rate), 529 (overloaded; retry) | same |
| Models | `jev-1.13.0`; aliases `jev-latest` and `jev-preview` both point to it. The docs advise pinning the versioned id once thresholds are tuned | https://docs.typesafe.ai/models.md |
| Price | $0.042 per million **input** tokens; output tokens free | models.md |
| Rate limits | 100K tokens/s and 80 requests/s, "adjusting dynamically… can change without notice" | models.md |
| Context | 64k tokens per request; 32k for state plus the longest question | models.md |
| Input | Text only (string, JSON object or array) | models.md |
| Language | "English is the primary training language and where accuracy is currently best"; test other languages first | models.md |

**Our environment:** `JEV_BASE_URL` holds the full endpoint URL (`https://api.typesafe.ai/v1/systemone`), not a base. A client should treat it as the System One endpoint and build `/v1/models` from its origin.

**Known weak spots** (https://docs.typesafe.ai/model-jaggedness/jev-1.13.md, reviewed by TypeSafe 2026-10-02):
- it reads instructions literally
- it is unreliable at arithmetic, counting and date comparison
- it struggles with multi-hop indirection and with large states full of irrelevant detail
- Choice option order can sway it
- it cannot generate

## Terms and data use

- **No training on inputs.** The Privacy Policy, last updated 19 Nov 2025 (https://typesafe.ai/legal/privacy-policy), says: "We will not train or fine tune any artificial intelligence or machine learning models on your prompts or other Input", and Input is not disclosed to third parties other than service providers.
- **No customer data in training without consent.** Master Customer Agreement, last updated 23 Sep 2026 (https://typesafe.ai/legal/mca), §4.1: TypeSafe "will not, include Customer Data in a dataset used to train … any artificial intelligence or machine learning models without Customer's prior consent." §2 forbids using the output to distil or train a competing model.
- **Retention.** The DPA, last updated 24 Apr 2026 (https://typesafe.ai/legal/data-processing), retains data "as long as necessary". Zero data retention is offered to enterprise customers only (https://docs.typesafe.ai/legal.md). Data is processed in the US (Privacy Policy).
- **Per-account weights.** Jev "is not fine-tuned or LoRA-adapted with customer data… the same weights serve every account" (models.md).
- **Rule 5:** Jev's terms don't allow training on inputs, so the rule doesn't block it. Data still leaves India for the US, so send only what a question needs.

## Where it could fit (proposal for Avi)

Each use is a narrow decision our code consumes. Each runs behind one interface, `src/decide/` with `decide({ purpose, state, questions }) → answers`, which logs model, tokens and cost to the ledger like every other provider. Each is gated by confidence, so below a threshold the item goes to a human. None replaces the scholar or the in-session QC verdict.

| # | Use | Question | Why Jev fits | Cost for s1e3 |
|---|---|---|---|---|
| 1 | **Citation support check (rule 2).** Every caption and narration line is checked against the English translation of the passages its claim ids name | Choice: `supports` / `contradicts` / `says_nothing`, confidence-gated (TypeSafe's own citation-check cookbook, https://docs.typesafe.ai/cookbooks/citation_check.md) | Rule 2 checks that the claim id *resolves*; this checks that the passage *says what the line says*. English, short state, calibrated confidence | about 40 lines × 600 tokens ≈ 24k tokens ≈ $0.001 |
| 2 | **Popular-telling guard.** Flags a line that states a popular image (seven rings, sixteen, the womb story) as fact rather than labelling it popular | Noul per line | The decision of 3 Oct ("Wording follows the critical edition") has no automated check yet | negligible |
| 3 | **Rule 1 semantic check on blocking.** Does a contract's free-text `blocking` put the camera inside a revered figure or frame a deity's face close? | Noul per contract, with the witness rules in the criteria | The schema and `REVERED` list catch ids and framings; this reads the prose a model will actually render | negligible |
| 4 | **QC retry triage (M3, optional).** Given my written verdict for a failed clip, choose re-prompt, switch model, or human queue | Choice | Cheap and structured, but low value while verdicts are written in session | negligible |

**Not a fit:**
- anything that needs generation (beat maps, contracts, narration, prompts)
- anything numeric (cost estimates, timings)
- judging Indic-language text until tested
- anything visual (Jev takes text only; it can't look at frames)

**Recommendation:** say yes to #1 and #3 first. They harden rules 2 and 1, cost almost nothing, and fail safe to a human. #2 could follow once the scholar has reviewed its criteria wording.
