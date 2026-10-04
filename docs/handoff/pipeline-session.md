# Handoff: pipeline, research and video session

Written 4 Oct 2026 by the build session that produced the scaffold and the mockups. You are the session that turns sourced texts into a rendered, narrated, cited chapter. Read this whole file, then `CLAUDE.md`, `docs/build-brief.md`, `docs/decisions.md` and `docs/product-plan.md`, in that order. Where this file and the Build Brief disagree, `docs/decisions.md` (newest entry wins) settles it.

## 1. Your mission

Ship chapter **s1e3, "The way in"** (Mahābhārata, Droṇa Parva, the chakravyūha, day 13) end to end from files in the repo:

```bash
pnpm chapter s1e3 --quality draft
```

Done means, unchanged from the Build Brief:

- `out/s1e3/draft.mp4`, 90–120 s, burned-in captions, an AI label on screen throughout.
- Every shot has a ledger row (model, seed, licence, territory, attempt, cost), written **before** the provider request. The whole run costs under `MAX_RUN_USD` (15).
- Narration is Sarvam Bulbul v3; the śloka is chanted by Vāgdhenu or a human reciter, never a TTS voice; every caption and narration line resolves to a claim id.
- `web/chakravyuha.html` still passes its checks, and a second experience exists beside it.
- The pipeline also writes `content/s1e3/manifest.json` for the app (section 7).

Two decisions changed the chapter since the Brief was written; honour them:

- **Cold open first.** Beats are: cold open (5–8 s witness shot) → the verse, chanted → witness scene → hidden detail → the question. Lineage is not a timed beat.
- **Wording follows the critical edition.** Seven rings, "sixteen" and the womb story are the popular telling, never the text. See section 6.

## 2. Before you write code: check the environment

Run `bash scripts/session-check.sh` first. It prints which keys are present and which hosts are reachable. Paste its output into your first message to Avi. If anything in the table below is missing, say so in one line and carry on with the work that does not need it. Never fake a provider's output (decision of 3 Oct: no local fallbacks).

| Need | Variable or host | Status at handoff |
|---|---|---|
| Sarvam (Bulbul TTS, STT, Vision OCR) | `SARVAM_API_KEY`; `api.sarvam.ai`, `docs.sarvam.ai` | Key exists. It was pasted in chat, so treat it as exposed and remind Avi to rotate it. |
| Exa (reference corpus) | `EXA_API_KEY`; `api.exa.ai` | Key exists, also exposed. |
| fal (video, image, LoRA) | `FAL_KEY`; `queue.fal.run`, `fal.run`, `rest.alpha.fal.ai`, `fal.media`, `v3.fal.media`, `v3b.fal.media`, `fal.ai` (docs) | **No key yet.** M2–M4 wait on it. |
| Jev (decision and routing layer, typesafe.ai) | `JEV_API_KEY`, `JEV_BASE_URL`; `docs.typesafe.ai` plus its API host | Key exists, also exposed. API shape unknown: read https://docs.typesafe.ai/introduction first. |
| Spend guardrail | `MAX_RUN_USD` | Set to `15`. |
| Source texts | `gretil.sub.uni-goettingen.de`, `sanskritdocuments.org`, `archive.org`, `*.us.archive.org`, `sacred-texts.com` | Allowlisted by Avi on 3 Oct; untested. |
| Script CDNs for Playwright checks of `web/` | `cdnjs.cloudflare.com`, `cdn.jsdelivr.net`, `unpkg.com` | Allowlisted; untested. |
| Vāgdhenu chant | `VAGDHENU_URL` (a CUDA 12.1 box running `services/vagdhenu/`) | **No GPU yet.** The chant step must fail loudly until it exists. Ask Avi for E2E or IndiaAI access. |
| Anthropic API | none | **Not used.** Planning and QC are done by you, in session, and committed as files (decision of 3 Oct). |

Keys must be set in the cloud environment's settings (environment variables); the `.env` file from the earlier container does not carry over to a new one. Secrets come only from the environment. `.env` is gitignored; commit only `.env.example` with empty values. Never print a key.

## 3. What already exists

```
CLAUDE.md                     standing rules (read it)
docs/product-plan.md          the plan (text extract of Avi's docx)
docs/build-brief.md           summary of the Build Brief; full text at
                              https://claude.ai/code/artifact/653d1aff-1744-4c5f-84ae-97ba0c88fe6b
docs/decisions.md             dated decisions; newest wins
docs/artifacts.md             published artifacts and Drive links
design/mockups/               21 reviewed screens (index.html), reviews/, shoot.mjs,
                              build-artifact.mjs; fonts vendored in design/fonts/
web/chakravyuha.html          reference JS experience, text corrected per scholar review;
                              preview hooks #at=, #auto, #reveal, #clean
.env.example, .gitignore, package.json (pnpm; playwright only)
```

Empty, waiting for you: `schema/`, `src/{contract,compile,render,qc,ingest,voice,assemble,plan,canon}`, `services/vagdhenu/`, `content/s1e3/`.

The app (Kotlin Multiplatform) is a separate session; see `docs/handoff/app-session.md`. You share one contract with it: the chapter manifest (section 7).

## 4. Order of work

Work top to bottom. A milestone is done only when its acceptance test passes in CI or on a recorded run. Open one PR per milestone with the test output pasted in the description. Ticket ids match the plan's backlog.

| # | Milestone | Ships | Acceptance test | Needs |
|---|---|---|---|---|
| M0 | Repo boots | `pnpm check` (lint, unit tests, contract validation), GitHub Actions CI, gitleaks pre-commit hook, env loading, `scripts/session-check.sh` kept current | `pnpm check` green on a clean clone; a planted fake key fails pre-commit | nothing |
| M0.5 | Research notes | `docs/research/{fal,sarvam,jev,sources}.md`: verified model ids, input schemas, prices, licences and data-use terms, each with its URL and retrieval date | Every model in `src/render/models.mjs` cites a row in `docs/research/fal.md` | network |
| M5 | Canon v0 (moved up: data is online) | Passage store and claims for Droṇa Parva 7.32–7.51 plus the cross-references in section 6; `schema/claim.schema.json`; `src/canon/` loader; JSON export for the app | Every claim id used by s1e3 resolves to book, adhyāya and verse; an unresolvable id fails CI | GRETIL or another CE e-text; sacred-texts for the public-domain Ganguli translation |
| M1 | Voice | `src/voice/sarvam.mjs` `narrate({ text, lang, speaker, pace, dictId }) → wavPath`, cached on a hash of all inputs; pronunciation dictionary generated from canon names; two narrator casts for en-IN and hi-IN; `services/vagdhenu/` HTTP wrapper | `pnpm voice s1e3` writes one WAV per narration line; a second run makes zero API calls | `SARVAM_API_KEY` |
| P | Plan s1e3 | `content/s1e3/beats.json` (beat map) and `content/s1e3/shots/*.json` (shot contracts), written by you in session, validated by `schema/shot-contract.schema.json` | `pnpm contract:validate content/s1e3/shots/*.json` passes; every contract's claims resolve | M0, M5 |
| M2 | Draft render | `src/compile/` (contract to Kling, Wan, hosted H3 and LTX payloads, deterministic), `src/render/models.mjs` (the only place model ids, prices, licences and territories live), `submit.mjs`, ledger | 12 shots of s1e3 render at 480p under $15; every row has licence and territory; `territoryBreaches()` returns none | `FAL_KEY` |
| M3 | QC gate | Frame sampler (3 frames per clip, ffmpeg) and a verdict file per attempt in `content/s1e3/qc/`, written by you after looking at the frames; retry with `fix_hint`; third failure goes to the human queue | A seeded anachronism (a modern table) is rejected; a clean shot passes | M2 |
| M4 | Assemble | `src/assemble/`: ffmpeg conform, narration and chant mix, burned captions (use the vendored fonts), AI label, provenance metadata; writes `out/s1e3/draft.mp4` and `content/s1e3/manifest.json` | `pnpm chapter s1e3 --quality draft` meets the mission test in section 1 | M1–M3 |
| M6 | Web track | Mainaka experience (Sundara Kāṇḍa, witnessed by a vānara on Mahendra), lineage explorer over the canon export, reveal sheet as a shared module | Both meet the JS standards in `docs/build-brief.md` at 390×844 and 1440×900 and appear in `docs/artifacts.md` | M5 |
| M7 | Real canon | Swap in the first digitised pilot arc | Same pipeline, new arc, no code changes outside content | Avi's books |

If `FAL_KEY` is still missing when you reach M2, write the compiler, the model registry, the ledger and their tests (all testable without a key), then stop and say so. Do not render anything with another provider to fill the gap.

## 5. Engineering rules for this session

- **The shot contract is the unit of work.** JSON per shot: id, beat, witness, camera, blocking, duration, reference ids, claim ids, retention beat, `forbidden`, territory, quality. Everything downstream is deterministic from it.
- **Enforce the nine rules in code, each with a test.** In particular: a `worldwide` contract routed to self-hosted H3 throws; `forbidden` always contains `deity_face_closeup` and `pov_inside_deity`; `submit.mjs` refuses `quality: "final"` without a human approval record and refuses any run whose estimate exceeds `MAX_RUN_USD`.
- **Ledger before spend.** The row is written and flushed, then the request is sent. Idempotency key per (shot id, attempt) so a retry never double-bills.
- **Webhooks.** This container cannot receive inbound calls. Build `webhook.mjs` for deployment, but drive runs by polling fal's queue status. Record that as a decision.
- **Cost and latency are measured, not guessed.** Every provider call logs wall-clock and billed units to the ledger. `pnpm report s1e3` prints cost per shot, per beat and per chapter, and p50/p95 queue latency.
- **No training on our texts.** Before sending any unreleased passage to an API, check its data-use terms in `docs/research/`. Block at the router if training on inputs is allowed.
- **Draft first.** 480p drafts, edit lock, then finals only for surviving shots, and finals only after Avi approves.
- **Language and stack.** The Brief fixes Node ESM (`.mjs`) and pnpm for the pipeline; keep it. Python only inside `services/vagdhenu/`.

## 6. The canon for s1e3: what the scholar review confirmed

The scholar review is in `design/mockups/reviews/scholar.md`. Treat its corrections as binding, and verify every verse number against the e-text before it becomes a claim. Confirmed or flagged so far:

| Claim | Reference | Note |
|---|---|---|
| Abhimanyu: his father taught him to break the array; he cannot get out if calamity comes | 7.34.19 | High confidence. Text: उपदिष्टो हि मे पित्रा योगोऽनीकस्य भेदने । नोत्सहे तु विनिर्गन्तुमहं कस्यांचिदापदि ॥ |
| Surrounding verses on the page view | 7.34.17–21 | 17, 18, 20, 21 are genuine CE text; the e-text reads युधा in 20; check the printed volume |
| He learns arms from Arjuna as a boy | 1.213 | |
| Droṇa's vow (fell a great Pāṇḍava warrior) | 7.32 (c. v.13) | Not the day-12 vow to capture Yudhiṣṭhira |
| Only Abhimanyu, Arjuna, Kṛṣṇa or Pradyumna can break it | 7.34.15 | |
| Arrangement of the array | 7.33 | No count of rings in the CE |
| Broke it "in many places" (anekadhā) | 7.32 | |
| The Saṃśaptakas draw Arjuna south | 7.32 | |
| Jayadratha's boon from Śiva | 3.256; retold at 7.41 | No "for one day" |
| Jayadratha blocks the path Abhimanyu opened | 7.41–42 | |
| The six warriors | 7.32, 7.48 | |
| The chariot wheel | 7.47 | |
| Killed by Duḥśāsana's son | 7.48 | Depict by suggestion only |
| "One alone, he lies slain; this, we hold, was not dharma" | 7.48 (c. v.22) | Verse number to confirm |
| Arjuna finds his son slain; vows to kill Jayadratha before the next sunset | 7.50, 7.51 | |
| Uttarā, daughter of King Virāṭa of Matsya | 4.67 | |
| Parikṣit born and revived | 14.65–69 | CE spelling Parikṣit |
| Age | 7.32: *bāla*, *śiśu*, *aprāptayauvana* | Never "sixteen" as fact |
| Womb-learning | Absent from CE 7.32–51 | Popular telling: regional retellings, kathā, folk theatre, film and TV. Never call the belief absurd (garbha-saṃskāra; Aṣṭāvakra learns in the womb at 3.132). |

Say "the critical edition", never "Vyāsa's text". Page numbers of the printed BORI volume are unverified until DHE-1. Nothing ships publicly without a scholar sign-off record (rule 9).

## 7. The contract with the app: `content/<chapter>/manifest.json`

Create `schema/chapter-manifest.schema.json` in M5 and keep it stable; the app session builds against it. Shape:

```json
{
  "id": "s1e3",
  "season": "mbh-s1",
  "title": { "en": "The way in" },
  "edition": "Mahābhārata, critical edition (BORI)",
  "durationMs": 116000,
  "witness": "sanjaya",
  "beats": [
    { "kind": "cold_open", "startMs": 0, "endMs": 8000 },
    { "kind": "verse", "startMs": 8000, "endMs": 26000, "verse": "mbh.7.34.19" },
    { "kind": "scene", "startMs": 26000, "endMs": 80000 },
    { "kind": "reveal", "startMs": 80000, "endMs": 100000, "reveal": "who-taught-him" },
    { "kind": "question", "startMs": 100000, "endMs": 116000 }
  ],
  "media": {
    "video": { "status": "pending | draft | final", "hls": null, "mp4": null },
    "narration": { "en": { "status": "pending", "url": null } },
    "chant": { "status": "pending", "url": null },
    "experience": "web/chakravyuha.html"
  },
  "captions": [ { "startMs": 0, "endMs": 4000, "text": { "en": "…" }, "claims": ["mbh.7.33"] } ],
  "reveals": [ { "id": "who-taught-him", "title": { "en": "Who taught him?" },
                 "popular": { "text": {}, "source": {} },
                 "text": { "text": {}, "claims": ["mbh.7.34.19", "mbh.1.213"] },
                 "collection": { "status": "proofing | ready | none" } } ],
  "people": [ { "id": "abhimanyu", "names": { "sa": "अभिमन्यु", "en": "Abhimanyu" }, "edges": [] } ],
  "claims": { "mbh.7.34.19": { "book": 7, "adhyaya": 34, "verse": 19, "edition": "BORI CE", "devanagari": "…", "iast": "…", "translation": { "en": "…" } } },
  "next": { "id": "s1e4", "releaseLocal": "19:00" },
  "provenance": { "aiLabel": true, "signOff": null }
}
```

Every `claims` id referenced anywhere must appear in the top-level `claims` map, and CI fails otherwise.

## 8. Research you own

- **fal:** current endpoint ids, input schemas and per-second prices for Kling 3.0, Wan 3.0, MiniMax H3 reference-to-video with LoRA, LTX-2.5, Veo 3.1 and Gemini Omni Flash; queue submit, status, result and webhook APIs; LoRA training cost; licence and data-use terms. The plan's figures date from 20 Sep 2026; prices move monthly.
- **Sarvam:** read `https://docs.sarvam.ai/llms-full.txt`. Bulbul v3 (2,500 characters per request, `speaker` lowercase, `pace` 0.5–2.0, 48 kHz for finals, base64 in `audios[0]`), the pronunciation dictionary API, STT languages, Vision OCR, and data-use terms.
- **Jev:** what it is, its API, pricing and data-use terms. Avi wants it available for storyline and video-generation decisions and for routing inside the pipeline. Propose where it fits behind one interface, and get Avi's yes before routing anything through it.
- **Sources:** licence per corpus (GRETIL and several others are research-use), and a rights note per text you ingest.

Write findings to `docs/research/` with URLs and retrieval dates. Record choices in `docs/decisions.md`.

## 9. Where autonomy stops

Go ahead: code, tests, schemas, research notes, draft renders and TTS within `MAX_RUN_USD` per run, new or improved experiences under `web/`, decision entries.

Stop and ask Avi: spending above `MAX_RUN_USD`, any final-quality pass, training a LoRA, publishing anything publicly, adding a model or service whose licence or data-use terms are not recorded, writing a canon claim without a cited passage, using Vāgdhenu output beyond internal review, anything touching rights or sign-off records.

## 10. Deliverables and where they go

- **Git:** develop on the branch the session gives you; push after every milestone. One PR per milestone, acceptance output in the description.
- **Artifacts:** publish JS experiences and review pages as claude.ai artifacts; list them in `docs/artifacts.md`.
- **Drive:** folder "Dheevara — Build Output", id `1-B1xvZsR87AFbqvXCvPEQNQws-IREygt`. The connector only sees files it created, and it uploads only content you send inline, so large binaries (video) cannot go through it. Upload text deliverables there, publish video to an artifact's asset store, and add every link to the index doc `1wDhWaCbXK7gdhiXrmbZuQMm323LT1xBb6WiYCTi6TwQ`.
- **Published so far:** mockups at https://claude.ai/artifact/JpYzuuAD5oDfbmzzdcGPY4.

## 11. Open questions for Avi (carry these forward)

1. A fal key and the fal budget for M2.
2. Rotate the Sarvam, Exa and Jev keys (all pasted in chat).
3. A GPU box for Vāgdhenu (E2E or IndiaAI), and permission from Vāgdhenu's author, or a reciter.
4. Confirm the look: temple relief lit by one lamp.
5. Confirm the chapter order change: cold open before the verse.
6. The pilot arc that replaces the chakravyūha placeholder, and the first books to digitise.
7. Narrator casting per language once M1 produces samples.
