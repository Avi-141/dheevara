# Dheevara — standing instructions

Phone-first, sourced, multilingual chapters of Indian mythology and history: 90–120 s video chapters and interactive JS chapters over one canon. The why is `docs/product-plan.md`; the how is `docs/build-brief.md`.

## Rules that do not bend (each enforced in code with a test)

1. Witness, never the deity. No shot puts the viewer inside a revered figure; no facial close-up of a deity. The contract's `forbidden` list carries it.
2. No claim without a citation. Every caption, narration line and hidden detail carries a `claim:` id resolving to book, chapter and verse.
3. Ledger before spend. The shot row is written before any provider request.
4. Territory. Self-hosted MiniMax H3 is India-only; a `worldwide` contract routed to it throws.
5. No training on our texts. Unreleased passages never go to an API whose terms allow training on inputs.
6. Draft first. 480p drafts, edit lock, then finals only for surviving shots. Finals need a human.
7. Sanskrit is chanted, not read. Ślokas go through Vāgdhenu or a human reciter, never a general TTS voice.
8. Secrets only from the environment. `.env` is gitignored; nothing committed holds a key.
9. Scholar sign-off before anything is public, stored as a record.

## How this repo is worked

- No local stand-ins for providers. If a provider is unreachable or unkeyed, the step fails loudly; it does not fake output.
- Planning and QC verdicts are written by Claude in session and committed as files under `content/<chapter>/` (no Anthropic key in the pipeline).
- Decisions go in `docs/decisions.md` with a date and a reason.
- Deliverables (mockups, JS experiences, renders) are also uploaded to the Drive folder "Dheevara — Build Output".

## Layout

| Path | Owns |
|---|---|
| `design/mockups/` | Product-surface mockups (390×844) and their review notes |
| `web/` | Shipped JS experiences; `chakravyuha.html` is the reference |
| `schema/` | Shot contract and canon schemas |
| `src/contract`, `src/compile`, `src/render`, `src/qc`, `src/voice`, `src/assemble`, `src/plan`, `src/canon`, `src/ingest` | Pipeline stages |
| `services/vagdhenu/` | Chant service wrapper (needs a CUDA box) |
| `content/` | Chapter plans, shot lists, QC verdicts |
| `apps/` | The phone app |
| `docs/` | Plan, brief, decisions, artifact index |
