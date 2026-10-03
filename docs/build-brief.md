# Build Brief (summary)

Full text: https://claude.ai/code/artifact/653d1aff-1744-4c5f-84ae-97ba0c88fe6b

## Mission test (v0)

`pnpm chapter s1e3 --quality draft` produces `out/s1e3/draft.mp4`, 90–120 s, burned-in captions and an AI label; every shot has a ledger row (model, seed, licence, territory, cost) and the run costs under $15; narration is Sarvam Bulbul, the śloka is chanted by Vāgdhenu, every caption line resolves to a claim id; `web/chakravyuha.html` passes its checks and a second experience exists beside it.

v0 chapter: Chakravyūha (Droṇa Parva, day 13) until the pilot arc is digitised.

## Model routing (fal)

| Beat | Default model |
|---|---|
| Cold open, reveal, cliffhanger | Kling 3.0 |
| Connective and stakes | Wan 3.0 (480p drafts) |
| Reference-locked characters | MiniMax H3 hosted, `minimax/h3/reference-to-video/lora` |
| India-only drafts | LTX-2.5 or H3 self-hosted |

## Milestones

M0 repo boots · M1 voice · M2 draft render · M3 QC gate · M4 assemble · M5 canon v0 · M6 web track · M7 real canon.

## JS experience standards

One self-contained HTML file; correct at 390×844 and 1440×900 (Playwright); sound only after a tap, mute always visible; honours reduced motion; captions mirrored to aria-live; keyboard-operable; every on-screen claim carries its source line with the same claim ids as video; `#at=SECONDS` and `#auto` preview hooks.
