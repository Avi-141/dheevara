# Dheevara: product and data state, read from the repository

Notes compiled 2026-10-15 from `/home/user/dheevara` (git only, no web). They are the source for two documents: (1) a ground-up product overview and (2) a data architecture for a temporal knowledge graph. All paths are repo-relative. Where a fact lives only on one branch, the branch is named (`origin/claude/<name>`).

**Branch map, as read.** Every commit is dated 3–4 Oct 2026. Nothing has been committed since 4 Oct 09:06 UTC, eleven days before these notes.

| Branch | Tip | What it adds |
|---|---|---|
| `main` | `df5ea96` 2026-10-03 | Initial commit (LICENSE only) |
| `sweet-mendel-m0uwou` | `fda31ea` 2026-10-04 07:45 | Design and product session: CLAUDE.md, plan, brief, decisions, handoffs, 35 mockups, 5 reviews, style bible, product research, prototype, `web/chakravyuha.html` |
| `m0-repo-boots` | `66c0bb9` | M0 (partial): env loading, shot-contract schema and validator, gitleaks hook (20 tests) |
| `m0-check-green` | `14961b9` | M0: `pnpm check`, CI, pre-commit and secret-hygiene tests; merges sweet-mendel |
| `m0-5-research` | `d3fa48c` | M0.5: `docs/research/{fal,sarvam,jev,vagdhenu,sources}.md` |
| `m5-canon` | `0ece356` | M5: canon v0 (verse index, passages, claims, people, manifest schema) |
| `m1-voice` | `6b09817` | M1: Sarvam narration, cache, dictionary, ledger, chant wrapper |
| `p-plan-s1e3` | `82fce90` | P: beat map, 13 shot contracts, `manifest.json` |
| `m2-compiler` | `c19f231` | M2 with no renders: model registry, compiler, router, submit guards, report |
| `m6-web` (= HEAD) | `9a023df` 2026-10-04 09:06 | M6: reveal module, lineage explorer, Maināka, cited Chakravyūha, Rāmāyaṇa canon |
| `app-a0-gradle` → `app-a1-core` → `app-a2-ui` | `7ecc291` 2026-10-04 08:07 | KMP app under `apps/dheevara/`, branched from `13dc5df` (before any pipeline code) |

The pipeline stack is linear, with each PR stacked on the one before. The app stack branches from the scaffold and **has never been merged with the pipeline**, so the app has not yet loaded the real `content/s1e3/manifest.json` (see D.9).

---

## A. Product

### A.1 Goal and vision, in the founder's own words

**Source: `docs/product-plan.md`, "Dheevara — Final Plan", Oct 3, 2026, @Avi Solanki.** It is a text extract of Avi's docx.

- **One-line pitch:** "Phone-first, premium short-form audio and video for Indian mythology, history and culture. Serialised chapters, cinematic AI-generated scenes, every claim cited to its source, in eleven Indian languages. Video and interactive JS chapters ship in parallel over the same canon."
- **What we are building:** "Dheevara is a phone app where a book page flips into a scene you witness. One chapter is 90 to 120 seconds; a season is one story arc."
- **README tagline:** "A book page flips into a scene you witness. Serialised 90–120 second chapters of Indian mythology, history and culture, every claim cited to its source, in eleven Indian languages."
- **Splash tagline (mockup s01):** "Stand beside the story." The splash shows "A lamp on water: the ferryman who carries the story across". *Dheevara* means fisherman or ferryman. The working name was **Pushpak** ("Name. Pushpak became Dheevara.").
- **CLAUDE.md summary:** "Phone-first, sourced, multilingual chapters of Indian mythology and history: 90–120 s video chapters and interactive JS chapters over one canon."

**"Decided, in order", from the plan.** These are two weeks of decisions; later items override earlier ones.

1. The idea: "A Pocket FM-shaped platform for Indian mythology, history and culture, in audio and short video, built on sources most people cannot reach."
2. Phone-first, not a web app.
3. **Witness, not embodiment.** "The viewer stands beside the event as a vānara or as Sañjaya, rather than playing a deity." This replaced the original first-person idea.
4. **The canon graph as the engine.** "Characters, places, lineages and events drive script, references and continuity."
5. Quality over volume. "The backlash to the AI Mahābhārata set the bar; stylised beats photoreal."
6. Diaspora first: the highest willingness to pay, and the reason self-hosted H3 cannot be in the shipping path.
7. Name: Pushpak became Dheevara.
8. "Opus directs, fal renders." Hosted models for anything that ships; self-hosted only for drafts.
9. "The JS track is a track, not a demo." Chakravyūha proved the chapter grammar before any video existed.
10. Voice is two systems: Sarvam Bulbul for narration and Vāgdhenu for chanted ślokas, "because a flat read of a śloka is the tell".
11. "Data is online." Acquisition is online-first; "the shelf stops being the gate, and the moat moves to structure, retention and craft."
12. "Mythik exists." A funded competitor is a year ahead, so Dheevara competes "on form, sourcing and language", not on being first.
13. Every language Sarvam speaks: narration in 11 languages via Bulbul, ingestion from 23 via STT, ślokas chanted in Sanskrit.
14. Claude Code builds it.

**Moat statement.** "Assume a competitor can assemble the same texts in a week… What they cannot assemble in a week is the graph with a citation on every claim, the retention loop that tells us which beats hold people, and the craft. Those three are the moat; the books are the head start."

**Positioning against Mythik.** "Disney from the East: a studio" (Mythik) against "A canon with a player on top: the thing other studios eventually license from" (Dheevara).

**Not:** "We are not a microdrama volume play, not a ritual or puja app, not a lean-back streaming service, and not AR-first."

**The bet.** Four claims, each with a pass bar and a kill signal:

| Claim | Pass bar | Kill signal |
|---|---|---|
| Generation is a commodity; the canon is the moat | Reveal taps on 40% of chapter views; the detail is the most-quoted thing in comments | Viewers skip the reveal |
| Fidelity beats volume (A/B against a Mythik episode, 200 diaspora viewers) | Completion and next-episode carry beat Mythik's; no anachronism or depiction complaint in the first 10k views | Dheevara loses on completion |
| The diaspora pays ~10x India's ARPU | Two cohorts, $4.99/mo (US, UK, UAE, Canada) and ₹149/mo (India); diaspora trial-to-paid >8%, refunds <5% | No better conversion at 10x the price |
| Native-language chapters beat English-first | Regional cohorts complete at or above English and share more | Viewers default to English |

The retention gate date is **12 Jan 2027** (`synthesis.md`).

**Unit economics, from the plan.**
- Raw generation: $6–12/min. A usable minute: $30–60. A 2-minute chapter: $60–120. A 10-chapter pilot season: $600–1,200.
- Narration: ~₹160/hour (Bulbul at ₹30 per 10k characters). Each extra language costs under ₹10 of voice per chapter.
- A style LoRA is ~$10 per training run.
- Benchmark to beat: under $100 per finished minute (Kuku's target).
- Pilot season with people: **₹27–37 lakh** across 5 roles: art director/editor, part-time Sanskrit scholar, proofreader, one language reviewer per language, growth.
- "The first hire is not an engineer."

**Immersive track (last).**
- Month 6: in-app depth.
- Month 12: a walkable set piece (World Labs Marble → Unity/Unreal).
- Month 18: a venue build for temples and museums (the first B2B revenue).

**Planned storage in the plan.** None of this is built yet.

| Layer | Store |
|---|---|
| Page images | Object storage with IIIF |
| Passages | Postgres: one row per verse with text, transliteration, translation, proof status, page and bounding box |
| Canon | Neo4j: people, places, events, eras, objects, claims |
| Meaning search | Weaviate |
| Media | Shot ledger plus object storage |

**Planned build-on list:** Ambuda, Vidyut, Neo4j with llm-graph-builder, ViMax (MIT), fal, Sarvam, Vāgdhenu, Exa.

**Graph schema v0 (ticket DHE-5):** "Neo4j: person, place, event, object, era, claim, source, shot".

**Ingestion pipeline, as planned:**
1. Capture at 400–600 dpi.
2. Metadata before text.
3. OCR with Sarvam Vision, or HTR with Transkribus or Kraken.
4. A ground-truth loop: under 1% character error rate on verses.
5. Scholar proofing, with double-keying on quoted verses.
6. Align and diff against the public editions. "variant readings are exactly the hidden details the product sells."

**Rule:** "Web material is evidence and a pointer; it never becomes canon."

**Backlog.**
- Nine epics: DHE-CANON, PLAN, RENDER, QC, PLAYER, SIGNAL, TRUST, XR and VOICE (the table also has a GTM ticket).
- Tickets DHE-1…DHE-31 across three 2-week cycles plus additions.
- The plan says the tickets are also in "the starter repo's docs/tickets.csv". **That file does not exist on any branch.**

**Open decisions in the plan.** Of these, the pilot arc, languages, look and key rotation are still open:
- the pilot arc
- pilot languages and reviewers
- which books
- the look
- audio-first or video-first
- the lineage partner (maṭha, trust or sampradāya)
- Vāgdhenu permission
- key rotation for Sarvam, Exa and unidentified keys pasted in chat
- entity and funding

### A.2 Build Brief

The full text is the artifact https://claude.ai/code/artifact/653d1aff-1744-4c5f-84ae-97ba0c88fe6b. The repo holds a summary in `docs/build-brief.md`.

**Mission test (v0).** `pnpm chapter s1e3 --quality draft` must produce `out/s1e3/draft.mp4`:
- 90–120 s, with burned-in captions and an AI label
- every shot has a ledger row (model, seed, licence, territory, cost)
- the run costs **under $15**
- narration is Bulbul; the śloka is chanted by Vāgdhenu
- every caption line resolves to a claim id
- `web/chakravyuha.html` passes its checks, and a second experience exists.

The v0 chapter is Chakravyūha (Droṇa Parva, day 13) "until the pilot arc is digitised".

**Model routing:**

| Beats | Model |
|---|---|
| Cold open, reveal, cliffhanger | Kling 3.0 |
| Connective and stakes | Wan 3.0 (480p drafts) |
| Reference-locked characters | MiniMax H3 hosted, `minimax/h3/reference-to-video/lora` |
| India-only drafts | LTX-2.5 or self-hosted H3 |

**Milestones:** M0 repo boots · M1 voice · M2 draft render · M3 QC gate · M4 assemble · M5 canon v0 · M6 web track · M7 real canon.

**JS experience standards:**
- one self-contained HTML file
- correct at 390×844 and 1440×900 (Playwright)
- sound only after a tap; mute always visible
- honours reduced motion
- captions mirrored to aria-live
- keyboard-operable
- every on-screen claim carries its source line, using the same claim ids as the video
- `#at=SECONDS` and `#auto` preview hooks.

### A.3 The nine rules that do not bend

Source: CLAUDE.md, "each enforced in code with a test".

1. **Witness, never the deity.** No shot puts the viewer inside a revered figure, and there is no facial close-up of a deity. The contract's `forbidden` list carries it.
2. **No claim without a citation.** Every caption, narration line and hidden detail carries a `claim:` id resolving to book, chapter and verse.
3. **Ledger before spend.** The shot row is written before any provider request.
4. **Territory.** Self-hosted MiniMax H3 is India-only; a `worldwide` contract routed to it throws. This was later extended to *all* H3, hosted included.
5. **No training on our texts.** Unreleased passages never go to an API whose terms allow training on inputs.
6. **Draft first.** 480p drafts, edit lock, then finals only for the surviving shots. Finals need a human.
7. **Sanskrit is chanted, not read.** Ślokas go through Vāgdhenu or a human reciter, never a general TTS voice.
8. **Secrets only from the environment.** `.env` is gitignored; nothing committed holds a key.
9. **Scholar sign-off before anything is public**, stored as a record.

**Working rules from CLAUDE.md:**
- No local stand-ins for providers. If one is unreachable, the step fails loudly.
- Planning and QC verdicts are written by Claude in session and committed under `content/<chapter>/`. There is no Anthropic key in the pipeline.
- Decisions go in `docs/decisions.md`.
- Deliverables also go to the Drive folder "Dheevara — Build Output".

**The plan's four product rules** (a subset, phrased for product):
- witness, never the deity
- every claim cites its source, with three tiers on screen
- stylised, not photoreal
- audio-first economics: "Every chapter works with the screen off."

### A.4 Audience and markets

- **Beachhead:** "diaspora families in the US, UK, UAE and Canada". They pay in dollars, want their children to know the stories from a trusted source, and read a stylised look as respectful.
- **Then:** "Bharat follows on audio in all eleven languages."
- **Channel order (plan):**
  1. Shorts, Reels and WhatsApp (free; tests the format)
  2. temple networks, satsangs, diaspora children's programmes (the Mahavatar Narsimha playbook)
  3. licensing finished seasons to devotional and microdrama platforms
  4. the app last.
- **Festivals are the calendar:** Navratri, Diwali, Ram Navami, Hanuman Jayanti. Each drop is announced 3 weeks ahead.
- **Film calendar:** "Ramayana Part 1 opens at Diwali 2026, Part 2 at Diwali 2027, Mahavatar Parshuram 2027"; a sourced chapter should be live the week each opens.

### A.5 Business model

- **Pricing (plan):**
  - Diaspora: $4.99/month or $39/year.
  - India: ₹149/month or ₹999/year.
  - "the first chapter of every season free, and a festival bundle priced as a gift."
  - "No coin-per-episode cliffhangers: this audience is paying for trust, not for a slot machine."
- **Mockup s16:** Yearly at $39.00 with 7 days free (best value), or Monthly at $4.99. "Five family profiles, each in its own language." "Cancel any time." "Give a season instead." "Prices come from your app store, in your currency." The s31 gift price is $9.99, a placeholder.
- **Release and free rules (decision 2026-10-03):**
  - Chapter 1 of every season is free.
  - Members get every released chapter.
  - The pilot launches with chapters banked; new chapters land **at 7 pm in the viewer's timezone**.
  - Autoplay to the next chapter can always be stopped and turned off.
  - The product review asked for at least 5 chapters banked and binge for members, and defined "carry" as a start within 24 h of the next chapter being available.
- **In code (app A1, `Entitlements.kt`):** nothing plays before release; `chapter.chapter == 1` → Free; an active membership → Member; otherwise NeedsMembership. `Release(date, localTime = 19:00)` is read in the viewer's `TimeZone` ("7 pm in Chennai and 7 pm in Toronto are different instants on purpose"). The enum notes "No coins and no per-chapter purchases."
- **Subscriptions:** planned via RevenueCat KMP (Play Billing and StoreKit). Not built (A6).

### A.6 Languages

- **Plan:** English, Hindi, Tamil, Telugu and Kannada at pilot. All 11 Bulbul languages by the end of season one: bn, en, gu, hi, kn, ml, mr, od, pa, ta, te. Ślokas stay in Sanskrit, chanted.
- **STT ingestion:** 23 languages (Saaras) incl. Sanskrit.
- **Research proposal (not adopted):** pilot English, Hindi, Telugu, **Gujarati**, Tamil, with Kannada and Malayalam in the first wave.
- **Built so far:** narration in **en-IN and hi-IN only**. The s1e3 title is in en and hi.
- **App:** bundles fonts for Latin, Sanskrit and 9 Indic scripts (Devanagari, Bengali, Gujarati, Gurmukhi, Kannada, Malayalam, Oriya, Tamil, Telugu).
- **Mockup s02:** five pilot languages are choices; the other six are "shown as arriving".
- **Mockup s18:** narration and captions are separate settings ("a Tamil-speaking grandmother and an English-reading child share one profile").

### A.7 Content unit: season → chapter → beats → shots

- **Season:** "one story arc". The id is a slug, e.g. `mbh-s1`. Mockup s06 shows the season "Mahābhārata · Droṇa Parva — The thirteenth day", "Critical edition · 10 chapters · 19 min".
- **Chapter:** 90–120 s; the id is `s<season>e<chapter>` (`s1e3`). Mockup s06 chapter list:
  1. "The vow of Droṇa" (1:48)
  2. "Arjuna is drawn away" (1:52)
  3. "The way in" (1:56)
  4. "The gatekeeper", available now (1:50)
  5. "Arjuna's vow", tonight 7:00 pm
- **Chapter order decision (2026-10-04):** ch 4 answers ch 3's question, so ch 4 = "The gatekeeper" (Jayadratha, 3.256 and 7.41–42) and ch 5 = "Arjuna's vow" (7.50–51).
- **Beats:** five per chapter, contiguous from 0 to `durationMs`.
- **Shots:** each beat holds 0..n shot contracts. s1e3 has 13 shots of 5–10 s. Shot ids are `s1e3-sh01`.
- **Narration lines:** `n00-disclosure`, `n01`…`n13`, placed on shots in `beats.json`.

### A.8 The five beats

Final chapter grammar, decision 2026-10-03 "Cold open before the book page". It replaced the plan's order of book page → witness scene → hidden detail → lineage explorer → cliffhanger. The product review found the first scene landing at 30–40 s and the steepest drop (100→82%) in the book-page band.

| # | Beat `kind` | Length (style bible) | s1e3 actual | Content |
|---|---|---|---|---|
| 1 | `cold_open` | 5–8 s | 0–8,000 ms, 1 shot | A witness shot with one narrated line; high, wide, slow push. The spoken AI disclosure plays over the first 2 s |
| 2 | `verse` | 12–18 s | 8,000–26,000 ms, **no video** | The śloka chanted, lit line by line on the leaf; Devanagari, IAST and translation. In the MP4: "the leaf on night with the chant". `verse: "mbh.7.34.19"` |
| 3 | `scene` | 40–60 s, 6–10 shots | 26,000–84,000 ms, 9 shots | The witness scene; cuts motivated by narration |
| 4 | `reveal` (hidden detail) | 15–20 s | 84,000–102,000 ms, 2 macro shots | Macro on carved detail; opens the three-tier reveal sheet. `reveal: "who-taught-him"` |
| 5 | `question` (cliffhanger) | 10–16 s | 102,000–114,000 ms, 1 shot + 2 s hold | The question the next chapter answers; the gap-closer is "kept in shadow and unnamed" |

- **Lineage / people:** "available at any moment from the scene, not a timed beat".
- **Total:** s1e3 is 114 s. The handoff example said 116 s, and the app fixture still uses 116,000.

### A.9 The witness point of view

The viewer never stands inside a revered figure. Each chapter names its witness; the camera keeps that witness's vantage.

| Witness | Where | Camera consequence |
|---|---|---|
| Sañjaya, with divya dṛṣṭi | Far away at Hastināpura, given sight of the field | Elevated and distant; "never closer than medium-wide on any person" |
| A charioteer | On the chariot platform | Eye level, beside the warrior, never at his face |
| A vānara on Mahendra | On the mountain, looking up and out | Low angle, wide sky, the leap seen from below |
| Suratha and Samādhi, hearing Medhas | The sage's hermitage | Frame narrative (Devī season); episodes shown as relief panels at listener distance |

Source: style bible §6.

- **Schema allowlist** (shot contract and manifest): `sanjaya | vanara | charioteer`. Adding one is a decision.
- **`REVERED` list** (`src/contract/rules.mjs`): agni, balarama, brahma, durga, ganesha, ganga, hanuman, indra, krishna, lakshmi, parvati, rama, samudra, sarasvati, shiva, sita, surya, vayu, vishnu. It "may be extended, never shortened, without a scholar's note". Vāyu and Samudra were added 2026-10-04.
- **Canon flags:** `revered` and `witness` mirror the code lists; a test fails if they disagree.
- The Maināka witness is "a vānara on Mahendra, never Hanumān". Maināka (a mountain) is not revered.
- **Edges review (Devī season):** add `deity-face-closeup`, `deity-form-assembly` and `deva-pov` to the season's `forbidden` list.

### A.10 The reveal (hidden detail): three tiers in a fixed order

- **Plan:** "one tap opens a palm-leaf page that sets the popular telling beside the source, and beside the detail only our books hold, each with its citation."
- **Tier labels in the UI:** "what many heard" / "what the text says" / "from our collection".
- **Schema:** `popular {text, source}`, `text {text, claims}`, `collection {status: proofing|ready|none, text?, claims?}`.

**Tier 1: popular.** "Its source is a telling, never a canon claim." It is never presented as the text (decision 2026-10-03, "Wording follows the critical edition"). The popular images named are seven rings, "sixteen" and the womb story. The chapter title changed from "The seventh ring" to "The way in".

**Tier 2: text.** "The text tier says what the critical edition gives, with no judgement on the belief." Say "the critical edition", never "Vyāsa's text". Never call womb-learning absurd: Aṣṭāvakra learns in the womb at 3.132, and garbha-saṃskāra is a living practice.

**Tier 3: collection.** "Shows its real state." It is hidden when `none`. The product review asked to block publishing without a named scholar.

**Behaviour:**
- The scene **pauses** while the reveal is open.
- The narrator says "the text says otherwise" and the leaf pulses.
- Tap rate is defined as taps over viewers who reached the beat.
- Reveals can be "kept like quotes" (library).
- Sharing sends the reveal, not a trailer (s19).
- The share link is `dheevara.app/s1e3/who-taught-him?ref=…`.
- A QC rule is proposed: reveal-shot claims must equal reveal-sheet claims.

**s1e3 reveal "who-taught-him" ("Who taught him?", hi "उसे किसने सिखाया?"):**
- **Popular:** "Abhimanyu learned the way in while still in his mother's womb, as Arjuna described it to Subhadrā. In some tellings she falls asleep; in others Kṛṣṇa interrupts before the way out." Source label: "Popular telling: regional retellings, kathā, folk theatre, film and television".
- **Text:** "Abhimanyu tells Yudhiṣṭhira his father taught him to break in, but that he cannot get out (7.34.19). Elsewhere he learns arms from Arjuna as a boy (1.213.65). The critical edition's text does not tell the womb story." Claims `mbh.7.34.19` and `mbh.1.213.65`.
- **Collection:** `none`.
- **Scholar note (in `beats.json` only, not in the manifest):** the womb story is star passage *259 after 7.34.18 in manuscripts K1–2; tier-2 wording awaits the scholar.

**Maināka reveal "why-it-rose":**
- **Popular:** the first of three trials (Maināka, Surasā, Siṃhikā).
- **Text:** the Ocean asks Maināka to rise because Sagara raised it; the Wind saved the mountain's wings from Indra. Claims `ram.5.1.75-79`, `ram.5.1.108-113`, `ram.5.1.116-118`.

### A.11 Star passages

- These are apparatus passages printed in the critical edition's notes, not in the constituted text.
- GRETIL prints them **inline** (`07,034.018*0259_01`), so "a careless parser would put it into the canon".
- `src/ingest/gretil.mjs` keeps them apart.
- They are stored in `content/canon/mbh/variants.json` and are **never claims**: the claim-id grammar has no star syntax (decision 2026-10-04).
- **The one star passage held:** `mbh.7.34.18*259`, the womb story from Kashmiri MSS K1–2. Draft sense: "long ago, while still in the womb, I heard from Kṛṣṇa's own mouth how to enter the cakravyūha".
- **Product meaning (canon-check):** "the popular telling has a textual foothold in part of the manuscript tradition… A variant like this is exactly the 'hidden detail' the product sells." Suggested tier-2 wording: "The critical edition's text does not tell it; some manuscripts do (*259)."

### A.12 AI disclosure

Decision 2026-10-04, style bible §13. India's IT (Intermediary) Amendment Rules 2026, G.S.R. 120(E), were notified 10 Feb 2026 and have been in force since **20 Feb 2026**.

- A visible AI label on every scene. The app keeps it on screen, with a setting for "every frame". It is burned into every exported cut (Shorts, Reels, WhatsApp).
- A **spoken disclosure of ~2 s** before AI narration and before the chant, in the narration language, also in audio-only mode. Built for s1e3: `n00-disclosure`, en "This narration is AI-generated." and hi "यह वर्णन एआई द्वारा बनाया गया है।"
- C2PA provenance with a unique id on every asset; the assembler writes it and nothing strips it. This is not built (M4).
- A 30 Mar 2026 draft would make the label continuous; the player supports that behind a flag.
- Takedown within 3 hours of a lawful order.
- If Dheevara counts as an OTT publisher: an age rating (U) and content descriptor at the start of each chapter, and a grievance officer.
- Apple guideline 1.1.5 (no inaccurate religious quotation) is answered by showing the source verse.
- Lawyer review is required before anything is public.
- The manifest has `provenance.aiLabel: const true`.

---

## B. Product language and design

### B.1 Vocabulary used in the product

| Term | Meaning |
|---|---|
| **Chapter** | One 90–120 s episode (never "episode" in the UI) |
| **Season** | One story arc; chapter 1 is free |
| **Beat / part** | One of the 5 chapter parts. Lock screen and accessibility say "Part 2 of 5"; skip buttons jump between parts |
| **Cold open** | Beat 1 |
| **The verse / the leaf / book page** | Beat 2, the śloka on a palm-leaf surface |
| **Witness scene** | Beat 3 |
| **Hidden detail / reveal** | Beat 4 and its sheet |
| **The question** | Beat 5, the cliffhanger |
| **The page** | Any citation opens "the page it comes from, highlighted (IIIF once scans exist)". Zoom has buttons. No scans exist yet, "so it says so" |
| **People** | A person's node: "who, before, now, after, each edge with its passage". It has a list alternative for screen readers. Called the lineage explorer in the plan |
| **Witness** | The named vantage |
| **Collection** | Tier 3, "from our collection" (Avi's books and lineage material) |
| **Leaf card / leaf icon** | Palm-leaf with two binding holes: the single citation glyph, the reveal surface, the share card |
| **Cite** | The amber verse id under a caption (e.g. `7.34.19`) |
| **Kept reveals** | Reveals saved like quotes in Library |
| **Tell our scholar** | Report flow (s27), with an "Another telling" chip first: "a family's version is a contribution, not an error" |
| **The reply** | The scholar's answer in leaf register, signed by name (s28) |
| **Membership / member** | Never "subscription" in the UI; "No coins, no paying per chapter" |
| **Not out yet** | A countdown in local time with "Remind me" |
| **Up next / Stop autoplay** | End-of-chapter states |
| **Festival drop** | A themed season (e.g. "Nine nights of the Devī") |
| **Gift a season** | Gifting; "No payment details needed" |
| **Studio** | Internal web tools: s20 shots board and s21 retention, at 1440×900 |
| **Edition** | Named before play: "the edition is the product" |
| **Popular telling** | Tier 1; never "myth" or "wrong" |

**Mockup "Rules the surface keeps":**
- "Witness, never the deity. The witness is named on every scene."
- "Every claim cites. Captions carry a verse id; reveals carry three tiers."
- "The AI label never leaves a scene."
- "Screen off still works. The reveal is also a spoken chapter part."
- "No slot machine. No coins; autoplay can always be stopped."

### B.2 Design system: product language v2

Decision 2026-10-03; tokens from `design/mockups/index.html` `:root`, mirrored in `apps/dheevara/shared/ui/.../theme/Colors.kt`.

**Colours.**
- Surfaces: bg `#0B0B0A`, raise `#151513`, raise2 `#1D1C19`, raise3 `#272521`.
- Hairlines: `rgba(244,242,238,.09/.16)`.
- Text: fg `#F4F2EE` (also the primary button fill), fg2 `#B5B0A7`, fg3 `#918C82`.
- **amber `#F2B04A` = source only** (citations, verse ids, the leaf icon); amber-dim at 14%.
- **live / sindoor `#F0694A` = "now" only** (what is live, or an opponent).
- Verse and reveal surfaces: leaf `#EFE6D2`, leaf2 `#E5D7B9`, ink `#1E160C`, ink2 `#4A3A25`, leafred `#7A2410`.
- glass `rgba(16,16,14,.72)`; scrim `#0B0B0A`@80%; ok `#8CCB8C`.
- "Everything else is greyscale." Primary buttons are off-white.

**Type.**
- **Geist** for all interface text: 32/22/17/15/12.5 at 600/600/600/400/500, tight tracking on large sizes. The app adds 16 button, 13.5 chip, 15.5 row, 12 tab and 13 tnum cite.
- **Tiro Devanagari Sanskrit** for verse only (20 sp, line height 1.6 in the app).
- **Noto Sans** for Devanagari (hi, mr), Tamil, Telugu, Kannada, Bengali, Gujarati, Gurmukhi, Malayalam and Odia.
- Indic rules: no letter-spacing or uppercase on Indic text; line height at least 1.45; size at least 13; daṇḍa kept with its word.
- Radii: 12 (controls), 18–22 (cards), 28–30 (sheets).

**Motion.**

| Transition | Duration |
|---|---|
| Cold open → verse ("the shot holds, the leaf rises") | 700 ms |
| Verse → scene ("leaf grain dissolves into the plate") | 900 ms |
| Scene → reveal ("pauses and dims, sheet rises") | 450 ms |
| Reveal → people (named person becomes the centre node) | 500 ms |
| Question ("type lands, next card follows") | +600 ms |
| Reduced motion ("opacity only, stills over audio") | 200 ms |

Easing is `cubic-bezier(.2,.7,.2,1)`. "No page curls."

**Accessibility floor:**
- 44 pt minimum targets
- 4.5:1 text contrast
- a language tag on every Indic name
- reduce motion follows the OS
- autoplay is off under a screen reader and counts down 10 s in words with Stop
- an exit is always top-left
- every gesture has a button
- captions are a real caption track.

**v1 (`design/mockups/v1.html`, 18 screens)** was replaced on 2026-10-03. It used Figtree plus Tiro, a night/parchment/gold/sindoor palette (ash, ash2, leaf1–3, flame, parch), serif titles and a countdown ring. Reviewers found collisions, contrast failures and wrong fonts. Avi asked for "much sleeker, cleaner".

**Vendored fonts.** Fonts are vendored as woff2 in `design/fonts/` for headless renders; the app bundles static TTFs. Font failure history:
- Google Fonts did not load in headless Playwright.
- Figtree fell back to DejaVu, Tiro to Liberation Serif.
- **Telugu rendered unshaped** ("తెలుగు" as a bitmap fallback with broken vowel signs).
- Geist spacing broke ("No t now").
- The fix was vendoring the fonts and awaiting `document.fonts.load()`.
- In the app: about 4.6 MB of static TTFs, not subset yet; subsetting waits for A5's install-size check on a ₹15,000 phone.

### B.3 Style bible for video

Source: `design/style-bible.md`. Drafted 4 Oct; binding once Avi confirms the look.

- **Look:** "A temple relief that has come alive under one oil lamp." Carved stone figures in deep shadow; the only warm light is the lamp; "gold appears only where a claim lives, sindoor only where there is danger". It reads as darśan, not cartoon. One material hides AI face and costume drift. Raking light gives video models depth.
- **Rejected looks:**
  - Amar Chitra Katha: a living trade dress, AI line-boil, reads "for kids".
  - Painted miniature: flat perspective, blurs into generic painterly. It is kept only as a still register for leaf and share cards.
- **Stone per epic:**
  - Mahābhārata: dark basalt (Kailāsa, Ellora Cave 16; Hoysaleśvara, Halebidu, whose friezes include the chakravyūha).
  - Rāmāyaṇa: warm grey granite (Hazāra Rāma temple, Hampi).
  - Devī Māhātmya: red sandstone.
- **Light:**
  - one key light, oil lamp or low sun, about 2,200–2,700 K
  - raking at 20–40°
  - no rim glow, god rays, flares, or bloom on faces
  - **time of day follows the text** ("day 13 runs from dawn array to sunset; the last shot of s1e3 is sunset")
  - flicker ±3%, never pulse.
- **Palette:**
  - basalt `#2B2A25`–`#55524A`; granite `#5D5A52`–`#8A857A`
  - lamp `#F2B04A`–`#FBE3A4`
  - source gold `#E3B04B` (only the object a claim concerns)
  - sindoor `#C8391F` (danger and blood, by suggestion)
  - night `#0B0B0A`
  - no saturated blues, purples or greens; sky "the colour of smoke".
- **Camera grammar:** per beat (table in A.8).
  - Lenses: 24–35 mm wide, 50 mm medium, macro for details.
  - Never fisheye, drone swoop, or handheld shake (except ≤0.5 s at a breach).
  - A push is 5–10% of the frame over a whole shot.
- **Figures:**
  - "weight and gesture, not facial acting"; no lip-sync
  - **medium-wide is the closest framing for any human principal**
  - no deity face close-up, ever; deities appear full figure, at a distance, or through an attribute
  - death and violence by suggestion only ("a fallen bow, a wheel lying still, a lamp going out")
  - classical sculptural proportions.
- **Never-list** (the QC gate rejects): visored or plate helmets, plate armour, European chain mail, stirrups and modern saddles, firearms and gunpowder, metal horseshoes in close-up, glass windows, modern furniture, printed text, zips, buttons, wristwatches, any modern object. Banners only when sourced.
- **Prompt fragments (§9):** `style.base`, `style.light`, `style.motion`, `style.palette`, `witness.sanjaya`, and the `negative` list. Variables: `{stone}`, `{accent}`, `{object}`, `{side}`, `{move}`. These are implemented in `src/compile/fragments.mjs`.
- **QC checklist (§10):** three frames per clip (start, middle, end). Checks, in order:
  1. face distance
  2. the never-list
  3. one key light
  4. stone holds
  5. blocking and references match
  6. violence by suggestion.
  A failure writes a `fix_hint` in §9 vocabulary. **Not built (M3).**
- **Sound:**
  - tanpura drone in the narration key
  - pakhawaj or mṛdaṅga; silence before a reveal
  - conch only where the text has one
  - the chant sits alone under the verse
  - no trailer music, risers or "braams"
  - −16 LUFS, narration 6 dB above the bed.
- **Captions in the video:**
  - Geist 600 at about 4.5% of frame height, `#F4F2EE` on an 80% night band
  - at most 2 lines, 34 chars per line in English
  - verse id in amber at 70% of caption size
  - AI label top-left.
- **Aspect:** 9:16 (decision 2026-10-04, Avi to confirm); 16:9 would be a separate compile.

### B.4 The 35 screens

Source: `design/mockups/index.html`, artifact "Product language v2". Shots are in `design/mockups/shots/` at 390×844 @2x, plus `shots/360/` at 360×740 for all phone screens; s20 and s21 are 1440×900 only. Screens were 21 on 3 Oct; 14 were added 4 Oct (s22–s35).

| # | Screen | Note |
|---|---|---|
| 01 | Splash | "Stand beside the story"; lamp on water; under 2 s |
| 02 | Language | Five pilot languages; the other six "arriving"; language-tagged names |
| 03 | Start | Three promises, then play; "first scene is two taps from install"; no account |
| 04 | Link landing (web) | `dheevara.app`, "Kavya sent you this", reveal plus "Watch here, free"; deferred deep link with `ref` |
| 05 | Home | Resume is the whole first screen; Up next; Seasons (Mahābhārata, Rāmāyaṇa "soon"); 3 tabs: Home, Explore, Library |
| 06 | Season | Edition named; ✓ on watched chapters; next release in local time, never a price |
| 07 | Cold open | AI label and witness share one pill under the progress bar; exit top-left |
| 08 | The verse | Chant lit line by line; IAST hidden from screen readers; `lang=sa`; visible Next |
| 09 | Witness scene | Caption track; tappable named people; overlays on 80% night |
| 10 | Hidden detail | Scene pauses; three tiers |
| 11 | The page | Verses 17–20 genuine CE text; zoom buttons; "no scan yet" |
| 12 | People | Graph plus list; opponents named in words |
| 13 | Controls | Mid-chapter narration language switch; captions separate; Report a mistake (second plus claim id) |
| 14 | The question | Autoplay countdown in words with Stop |
| 15 | Screen off | System Now Playing; title names the part; skip between parts |
| 16 | Membership | $4.99 / $39, ₹149 / ₹999; Restore; Gift a season |
| 17 | Library | Downloads audio-only by default (3 chapters 4 MB, or 61 MB with video); kept reveals; People |
| 18 | You | Narration and captions settings; reduce motion follows the OS |
| 19 | Share | The reveal card plus a tappable link to s04 at ch 3 |
| 20 | Studio: shots | Contract plus latest render plus QC state; final pass disabled until a person presses it; inspector shows contract, verdict and ledger row |
| 21 | Studio: retention | Curve over 5 beats tied to shot ids; drop → "Open shot / Re-render / A/B" |
| 22 | Sign in | After the store confirms the trial, never before ch 1; Apple, Google, phone OTP, email; "Not now" |
| 23 | Not out yet | Countdown in viewer time; pre-prompt before notification permission |
| 24 | Offline | Whole chapter incl. sources ships in the download |
| 25 | Playback error | Falls back to audio; error code |
| 26 | Empty library | |
| 27 | Tell our scholar | Moment, shot and verse attached; "Another telling" chip; no free text on kids' profiles |
| 28 | The reply | Signed scholar reply; places the family telling, never corrects it |
| 29 | Profiles | Per-profile narration language, captions, progress, kept reveals |
| 30 | Children's home | Curated cut, no purchase prompts, parental daily limit, PIN or Face ID gate |
| 31 | Festival drop | Navarātri 11–19 Oct 2026, "Nine nights of the Devī"; witnesses Suratha and Samādhi; night 1 free; DM 1, DM 2…DM 13; gift $9.99 placeholder |
| 32 | Receiving a gift | Giver's note, language pick, "No payment details needed" |
| 33 | Search | People, chapters, verses; diacritic-insensitive and cross-script (abhimanyu / अभिमन्यु / அபிமன்யு) |
| 34 | Explore | By epic, person, place, source: Mahābhārata (BORI), Rāmāyaṇa (Baroda) "soon", Devī Māhātmya "edition to confirm" |
| 35 | Manage membership | Renewal date, family 3 of 5 profiles, gifts, restore, cancel; "you keep every chapter until 3 Oct 2027" |

**Prototype.** `design/prototype/chapter.html` is a clickable s1e3. It runs cold open → verse → scene → reveal → question with the motion spec, pausing sheets, stoppable autoplay and aria-live captions. Hooks: `#verse #scene #reveal #question`. `check.mjs` renders it at 390, 360 and 1440. Chapter 4 is "The gatekeeper".

### B.5 Reviews and their blockers and fixes

There are four reviewer agents on s01–s18 (3 Oct) and one design review on s22–s35 (4 Oct). Files are in `design/mockups/reviews/`.

**Art director (`art-director.md`).** Verdict: "the direction is right… Not signed off."
- Blockers:
  1. wrong fonts in headless renders (vendor woff2)
  2. AI pill covers the beat bar
  3. lineage edges cross labels and the centre node
  4. studio header breaks.
- Majors:
  - no motion spec (proposed one, adopted)
  - chant highlight read as strikethrough → karaoke ink
  - reveal sheet hid the scene → max-height 72%
  - off-language icons → one palm-leaf SVG
  - header patterns inconsistent
  - widows
  - s11 four competing actions and a countdown ring, "autoplay pressure"
- Decided the look: temple relief.
- Minor: re-capture scene plates with `#clean` (done, commit `afc1ee4`).

**Scholar (`scholar.md`).** Verdict: "not cleared."
- **Blocker 1:** s09 showed a verse **not in the critical edition** (`एहि वत्स भिन्धि व्यूहं … संशितव्रताः`, composed Sanskrit) and omitted v.18 → replace with genuine 7.34.17–21.
- **Blocker 2:** "did not learn… in the womb" denies a belief; "No one taught him the way out" is not in the verse (*notsahe vinirgantum*, "I cannot get out").
- **Blocker 3:** the CE never counts the rings ("seven rings" is a later image; 7.32 says *anekadhā*, "in many places").
- Majors:
  - reveal wording; "Vyāsa's text" is indefensible
  - "sixteen" is not in the CE (the CE calls him *bāla*, *śiśu*, *aprāptayauvana*)
  - "a wheel no Pāṇḍava can break" is wrong (7.34.15 names four who can)
  - Droṇa's vow conflated with the day-12 vow
  - "Proofed · double-keyed" and "Public domain" chips are not true
  - Telugu garbled
- Minors:
  - translation wording
  - end card `यतो धर्मस्ततो जयः` → 7.48 "One against six… not dharma"
  - boon "for one day" removed
  - "find his son slain"
  - "daughter of King Virāṭa of Matsya"
  - spelling Parikṣit
  - a fake sign-off dated 28 Sep
  - `दी` is not a word
- Confirmed: the six warriors, the Saṃśaptakas, the wheel 7.47, 4.67, 3.256, 7.41, diacritics, witness POV.

**Product (`product.md`).** Verdict: "the trust layer is ahead of the market… but the journey that has to clear the gate is not designed yet."
- Blockers:
  1. chapter opened on the chanted page (first scene at 30–40 s) → cold open first
  2. no link-landing screen → s04
  3. free/paid and release rules conflict → one rule table.
- Majors:
  - cadence vs carry (bank 5+ chapters, 7 pm local)
  - nothing marks the reveal moment
  - placeholders on the most-shared surface
  - no paywall placement or local prices
  - share card doesn't link back
  - language switching
  - studio can't act on the losing shot; 64% completion contradicts the curve
- Listed 12 missing screens; most were drawn as s22–s35.

**Accessibility (`accessibility.md`).** Verdict: "not shippable as drawn."
- Blockers:
  1. 5 s auto-advance with no pause (WCAG 2.2.1) → Stop button, setting, off under a screen reader, 10 s
  2. no visible exit on s07/s11
  3. gesture-only page turn → Next button
  4. 360×740 collisions → flex layouts.
- Majors:
  - palm-leaf contrast failures (ink2 4.05–4.49, leafred 3.98, AI label 4.38, flame witness tag 1.82, hotspot 1.18)
  - Indic letter-spacing and uppercase
  - **Telugu unshaped; bundle fonts in the APK**
  - Dynamic Type clipping
  - pinch-only zoom
  - reduce motion off by default
  - pull-quote is not a caption track
  - lock screen can't show custom markers
  - screen-reader semantics (radiogroup, `lang` attributes)
- The app's `ContrastTest` and `TypographyTest` encode these.

**Edges and family review (`edges-family.md`, s22–s35).** Verdict: "close, not cleared."
- Blockers:
  1. s31 list clips at 360
  2. no witness rule for the Devī season beyond its frame.
- Majors:
  - "DM 1" with no verse and no edition (MārkP ch. 81–93 or 78–90 by edition)
  - the Saptaśatī is mantra: use a human reciter, "a telling, not a pāṭha"
  - price and access missing on s31
  - "Every language" overclaims
  - the reply contradicts itself; scholar unnamed
  - the report sheet framed a family telling as an error
  - sign-in before the store sheet costs trials (Apple 5.1.1(v))
  - no parental gate
  - no Restore
  - 36 pt chips
- It notes "Chapter 3 airs on 13 Oct". That date is now past, and nothing has aired.
- All majors were applied in commit `ae86ff3`.

---

## C. Market

Sources: `docs/research/product/{competitors,audience-gtm,synthesis}.md`, desk research dated 4 Oct 2026. Most pages were egress-blocked, so the files mark facts as **unverified** where needed.

### C.1 Competitors

- **Mythik / Mythik+:**
  - Founded Apr 2025 in Mumbai by Jason Kothari.
  - $15M seed (Sakal Media, SRK family office), then $5M "at over $50M" on 20 May 2026 (Harsh Jain, Blume Founders Fund, Bharti Mittal FO).
  - 10–12 min episodes; English and Hindi only; iOS app released 6 Aug 2026.
  - **₹3,499/yr** (₹5,999 for 2 years, ₹7,999 for 3); USD price unverified.
  - Hires a "Research Fellow in Sanskrit" under Prof. Diwakar Acharya (Oxford) and Prof. Parimal Patil (Harvard).
  - **No on-screen citation found.**
  - The plan's figures (3.7M members, 1B+ views, 750+ creatives) are unverified.
  - Titles: Ram vs Ravan: The Final Duel, Shakuni's Story, The Women of Ramayana, Ram: The First Trial, Shiva & Sati, Rukmini, Matsya.
- **Pocket FM:**
  - $500M run rate, ~70% US, 155 min/day; AI makes 93% of the catalogue.
  - Coins draw "$1,000+ to finish a story" complaints; Trustpilot 2.5 against 4.7 in the stores.
  - Shut Pocket TV on 25 Jun 2026.
  - Sherpa launched 19 Sep 2026 ("places moments where listeners are most likely to keep going").
- **Kuku:** an AI unit of 1,000 planned (~200 hired), under $100 per finished minute. Kuku TV claims 200M downloads. Bhakti was promoted next to the erotic app LoveNasha (backlash). ₹1–2 trials set up autopay of ₹399–699.
- **JioHotstar AI Mahabharat (Galleri5 / Collective Artists):** "Ek Dharmayudh", 100 episodes, launched 25 Oct 2025. 6.5M views on **day one** (the plan wrongly says the first week), 26.5M since. IMDb 1.4. Criticised for lip-sync, stiff faces and a modern bedside table.
- **Sri Mandir:** 40M downloads; diaspora ~20% of **revenue** (the plan said demand); ARPU abroad ~₹7,000 against ₹600–800 in India. A partner, not a rival.
- **ACK:** ₹999 for 3 months to ₹3,999 for 5 years; US $30 or $129.99 (conflicting). An immersive push under a new CEO.
- **Kids' apps** (Gurukula, Ananda Parenting, Lipi Epics): already use the śloka card; none cite.
- **Mahavatar Narsimha:** ₹300–325 cr on ₹20 cr; ISKCON group bookings; week 2 up 64%.

### C.2 Audience findings

- **US home speakers:** Hindi 1,059,933; Telugu ~606k; Gujarati 491,551; Tamil 341–360k; Kannada ~48,600 (unverified).
- **UK:** Gujarati 189k; British Hindus ~70% Gujarati.
- **UAE:** 4.36M Indians, Kerala ~35%.
- **Indian-American median household income:** $151,200.
- **Networks:** Chinmaya Bala Vihar (18,000+ children at 49+ centres, 30-week syllabus), BAPS (116 North American mandirs), HSS (267 shakhas), ISKCON.

### C.3 The five open proposals

From the synthesis; recorded as "Proposed, for Avi" on 2026-10-04 and **not adopted until Avi says so**.

1. **Pilot arc from the Rāmāyaṇa (Sundara Kāṇḍa), timed to the film.** *Ramayana: Rise of a Legend* Part 1 opens worldwide on **6 Nov 2026**; Part 2 at Diwali 2027 (29 Oct 2027). Ship free pieces 4–8 Nov 2026: the Maināka experience, 2–3 Shorts, one audio chapter, WhatsApp cards. s1e3 stays the pipeline v0 test.
2. **Reorder pilot languages:** English, Hindi, Telugu, **Gujarati**, Tamil. Kannada and Malayalam move to the first wave (Malayalam with UAE marketing); Bengali with a Durga Puja 2027 Devī arc; Punjabi last, with no depiction of the Sikh Gurus.
3. **Price tests:**
   - India yearly ₹1,499 and ₹1,999 (against ₹999).
   - India monthly ₹99 against ₹149 (Spotify India is now ₹139).
   - Diaspora: keep $39 (≈ Hoichoi $39.99); add a **$49 family** plan and quarterly plans (JioHotstar UK £69.99/yr, Canada CAD 49.99).
4. **Rewrite "authority":** Mythik is scholar-advised, so the claim becomes "visible per-line citation, scanned page one tap away, reply from a named scholar".
5. **Launch windows:**
   - Ramayana Part 1: 4–8 Nov 2026 (free).
   - Retention gate: 12 Jan 2027.
   - **Paid launch** at the spring festivals: Ugadi 7 Apr, Rāma Navamī 15 Apr, Hanumān Jayantī 20 Apr 2027, with a temple and Bala Vihar kit.
   - Devī season at Navarātri to Diwali 2027.
   - Navarātri 2026 (11–19 Oct) is "too close for a drop".

**India AI-label rules:** see A.12. Backlash outside the rules: an SGPC protest over an AI video of the Sikh Gurus; an FIR over an AI deity video (Jun 2026).

**Other implications:**
- Market "no coins, no trick trials".
- Placement terms in every licensing deal.
- An age-gated Bala Vihar pack.
- Run the Mahavatar playbook, with a Paraśurāma arc for *Mahavatar Parshuram* (Dec 2027).
- Keep the look away from ACK.

**Calendar (audience-gtm §3):**
- Diwali 2026: Lakshmi Puja 8 Nov.
- Gītā Jayantī: 20 Dec 2026.
- Mahāśivarātri: 6 Mar 2027.
- Janmāṣṭamī: 24–25 Aug 2027.
- Navaratri 2027: 30 Sep–8 Oct.
- Diwali 2027: 29 Oct.

---

## D. What was tried, tested and built

### D.0 Status at a glance

- **Built:**
  - M0, M0.5, M5 and M1 (narration only)
  - P (plan)
  - M2 without renders
  - M6
  - app A0–A2
- **Not built:**
  - M3 QC gate (`src/qc/` does not exist)
  - M4 assemble (`src/assemble/` does not exist; no `out/s1e3/draft.mp4`)
  - M7 real canon
  - app A3–A6 (screens, chapter flow, screen-off audio, billing)
  - `iosApp/` Xcode project.
- **The mission test (`pnpm chapter s1e3 --quality draft`) has not passed:** there is no `chapter` script, no video, no chant, no captions burned.
- **Total provider spend recorded:** **$0.1658** on Sarvam, all on 2026-10-04 between 08:23:48 and 08:28:23 UTC, across 6 runs.

### D.1 M0: repo boots

- Built:
  - `src/env.mjs`: secrets from the environment only; `.env` never overrides; `MAX_RUN_USD` has no default; `redact()`.
  - The shot-contract schema plus `src/contract/{validate,rules,cli}.mjs` (Ajv strict, draft 2020-12, errors as sentences).
  - `.gitleaks.toml`, `.githooks/pre-commit`, `scripts/gitleaks.sh` (pinned 8.30.1, sha256-verified, or `go install` through the Go proxy; no unchecked fallback).
  - `.github/workflows/ci.yml` (node 22, pnpm, `pnpm check` = lint, test, contract:validate, secrets; actions pinned by SHA).
  - `scripts/session-check.sh`.
- Tests:
  - `test/precommit.test.mjs`: a planted fake FAL_KEY blocks the commit.
  - `test/secrets.test.mjs`.
- Correction: `.env.example` had been ignored by `.gitignore`; fixed.
- Toolchain: `package.json` uses pnpm 10.28.0, Ajv 8.20.0, ESLint 10.12.0 and Playwright 1.56.1.

### D.2 M0.5: research

- `docs/research/fal.md` (532 lines), `sarvam.md`, `jev.md`, `vagdhenu.md`, `sources.md` (385 lines). Every fact has a URL and a retrieval date of 2026-10-04.
- **Key findings:**
  - **The MiniMax H3 Community License (2 Aug 2026) binds hosted use**, so every H3 endpoint is `india_only`. This reverses the plan's "Hosted H3 through fal is unaffected", and leaves no reference-locked character model for diaspora cuts.
  - Kling v3 has no seed field and no 480p tier ($0.084/s standard, audio off).
  - The draft lane is Wan 3.0 at 480p ($0.05/s).
  - The plan's LoRA trainer (LTX-2 at $0.0048/step) is deprecated.
  - Sarvam's terms contradict each other on training, so it is treated as `opt-out` (may train). Exa trains on queries (`yes`). Jev does not train (`no`).
  - Exa costs $4 per 1k searches, not the plan's $2.50.
  - The Sarvam key was checked with a free call; the Jev key with `GET /v1/models` (`jev-1.13.0`, priced at $0.042 per 1M input tokens).
- **Jev (TypeSafe System One) is proposed, not routed.** Four candidate uses: (1) citation support check, (2) popular-telling guard, (3) a rule-1 semantic check on blocking prose, (4) QC retry triage. The recommendation is to start with #1 and #3.

### D.3 M5: canon v0

- **Code:**
  - `src/ingest/gretil.mjs` parses GRETIL `BB,CCC.VVVp` lines and keeps speaker lines and star passages apart.
  - `src/canon/translit.mjs` converts IAST to printed-form Devanagari.
  - `src/canon/fetch.mjs`, `build.mjs` and `export.mjs`.
  - `src/canon/index.mjs` loads the canon; `resolve(id)`; `parseClaimId`; `checkRef`.
  - `src/canon/manifest.mjs` validates manifests.
  - `src/canon/claims-used.mjs`.
- **What was committed (M5):** 25 s1e3 claims and 18 people; 35 cited MBh verses, all equal to Smith's BORI-checked Devanagari.
- **After M6:** 28 MBh claims, 15 Rāmāyaṇa claims, 52 MBh passages and 47 Rāmāyaṇa passages ("All 99 pass"), and 23 people.
- **Corrections found against the e-text** (decision "Verse numbers corrected", flags on the claims):
  - Droṇa's vow is **7.32.12**, not c. v.13.
  - "One against six… not dharma" is **7.48.21**, not c. v.22.
  - *śiśu* is at **7.48.32** (and 7.34.26), not in 7.32.
  - Also: 7.34.20 reads *yudhā* (check against print).
  - Earlier, the scholar found the mockup's **composed Sanskrit verse** on s09 (not CE text). It was replaced with genuine 7.34.17–21.
- **Found:** the womb story as star passage *259 (K1–2), in the apparatus. The handoff and the scholar had said it was absent; the scholar had not checked the apparatus.
- **GRETIL against Smith:** 83 differing lines in Book 7, 5 of them in 7.32–7.51 (7.32.11, 7.49.6, 7.50.65, 7.50.78, 7.51.2). None of these is cited.
- **Rights:**
  - Only the cited verses plus a verse-count index are committed; the full e-texts sit in the gitignored `.cache/`.
  - BORI e-text: "Please do not provide copies of the text to others."
  - The 1958 Droṇaparvan (ed. S. K. De, d. 1968 or 1978 by conflicting sources) may be in copyright in India until **31 Dec 2028** (or 2038).
  - Shipping verse text in the app needs BORI's written permission.
  - Rāmāyaṇa (Smith's Baroda e-text): no licence; GRETIL's copy is CC BY-NC-SA 4.0.
  - English: Ganguli via Project Gutenberg #15475 (public domain), cited by Ganguli's own section numbers, never as a CE verse.

### D.4 M1: voice

- **`src/voice/sarvam.mjs` `narrate()`:**
  - Bulbul v3; checks every limit before spending (2,500 characters, lowercase speaker, pace 0.5–2.0, temperature, sample rate).
  - **Refuses a double daṇḍa** (rule 7); the CLI also refuses any line quoting a canon pāda.
  - Caches on a sha256 of all inputs, including the **dictionary content hash**.
  - Ledger row before the request; budget cap; keys redacted.
  - FX rate `INR_PER_USD = 96.32` (ECB via Frankfurter, 2026-10-02).
- **`dictionary.mjs`:** one Sarvam pronunciation dictionary (limits: 10 per user, 100 words), id `p_dec79afd`, created with 25 words and updated in place.
- **Gotcha found:** an update must be `PUT ?dict_id=`. `PUT /<id>` returns **405**; this is the one `failed` ledger row.
- **`check.mjs` (`pnpm voice:check`):** a Saaras v4 round trip scores each line. It caught three faults:
  1. a Hindi negation not heard (line rewritten)
  2. "cakravyūha" mispronounced (added to `content/voice/terms.json`)
  3. "breach" heard as "bridge" (reworded to "gap").
- **Casts:** en-IN **ratan** and hi-IN **shubh**, at pace 0.9 and temperature 0.7. Alternates: ishita and mani; priya and ashutosh.
- **Output:** 13 narration lines plus the disclosure × 2 languages = 28 WAVs. The ledger has 60 voice `done` rows over two runs (including samples), 4,567 characters billed, and 56 STT checks.
- **Spend:** voice **$0.14224**, STT **$0.02357**, total **$0.165812** (≈ ₹16).
- **Chant:**
  - `src/voice/chant.mjs` **throws until `VAGDHENU_URL` exists**.
  - `services/vagdhenu/server.py` wraps the `Renderer` behind `GET /health` and `POST /chant {devanagari, meter?, seed?}` → WAV, for a CUDA 12.1 box.
  - Vāgdhenu: IndicF5 / F5-TTS DiT (~337M) plus BigVGAN-v2; Apache-2.0; author Prof. Prathosh A. P. (IISc); non-Vedic chants only.
  - The public HF Space is deliberately not used.
- **Artifact:** the s1e3 narration review page (private).

### D.5 P: plan s1e3

- `content/s1e3/beats.json` and 13 contracts in `content/s1e3/shots/`.
  - All use `witness: sanjaya`, `territory: worldwide`, `quality: draft`.
  - The forbidden list is the never-list, plus `counted_rings` where the wheel is seen, plus no-wound, no-blow and no-body on the death shot.
  - The handoff estimated 12 shots; the beat lengths need **13**.
- `pnpm manifest s1e3` writes `content/s1e3/manifest.json`: 19 claims, captions timed from `voice-timing.json`, media `pending`. A test requires the committed manifest to equal a fresh build.
- **Schema change:** framing gained `medium_wide`. `medium`, `medium_close` and `close` fail when a `char.*` reference is present; `insert` (macro) is allowed.
- **`test/plan.test.mjs`:**
  - beats tile 114 s
  - shots fill beats
  - every line is placed once and finishes inside its beat
  - a line's claims are depicted by its beat's shots
  - the manifest is current and valid.

### D.6 M2: compiler and render, with no renders

FAL_KEY is not set.

- **`src/render/models.mjs`:** the only home of model ids, prices, licences and territories (table in E.6).
- **`src/render/route.mjs`:**
  - hook, reveal and cliffhanger → Kling v3 standard (draft) or pro (final)
  - stakes and connective → Wan 3.0 t2v
  - char references with images → Wan r2v (worldwide) or H3 LoRA (india_only)
  - `assertTerritory` throws on rule 4; `territoryBreaches(rows)`.
- **`src/compile/`:**
  - deterministic, byte-for-byte; style-bible fragments
  - seed = `sha256(shot:attempt)` (Kling `null`)
  - video audio is always off
  - 9:16
  - a golden payload: `test/fixtures/compile/s1e3-sh01.draft.json` (Kling standard, 8 s, $0.672).
- **`src/render/submit.mjs`:**
  - rule 6: approval file
  - rule 4
  - spend cap
  - a ledger `intent` row before the POST
  - idempotency key `render:<shot>:<attempt>`
  - polls `status_url`, then downloads immediately (fal results expire in about 1 h; asks for 1 day of retention).
- **`webhook.mjs`:** ED25519 against fal's JWKS with a 300 s window, for deployment.
- **`report.mjs`:** cost per shot, beat and chapter, and p50/p95 latency.
- **s1e3 draft estimate: $5.92** of the $15 cap. 4 Kling shots (sh01 $0.672, sh11 $0.756, sh12 $0.756, sh13 $0.84) and 9 Wan 480p shots ($0.25–0.50).
- **Blocked:** FAL_KEY. Also no asset bible (DHE-12) and no trained style LoRA.

### D.7 M6: web track

- **`web/shared/reveal-sheet.js`:** `DheevaraReveal.open({reveal, claims, lang, title, onClose})` and `claimLine(id, claims)`. An accessible dialog that traps focus, closes on Esc and respects reduced motion. It is inlined at build time.
- **`scripts/build-web.mjs` (`pnpm web:build`):**
  - builds `web/<name>.html` from `web/src/<name>.html` and `content/web/<name>.json`, or from the canon export for the lineage explorer
  - an unresolved id fails the build
  - built files are committed; `test/web.test.mjs` checks for drift.
- **`web/check.mjs` (`pnpm web:check`):** Playwright at 390×844 and 1440×900; fails on console errors, sideways scroll, a missing aria-live region, or a reveal that won't open. It needs Chromium, so it is not in CI.
- **Experiences:**
  - `web/chakravyuha.html`: the reference (1,121 lines; captions corrected and cited; 3 claims added: 7.47.18–30, 7.47.31–33, 7.48.41).
  - `web/mainaka.html`: Sundarakāṇḍa 1, witness a vānara on Mahendra.
  - `web/lineage.html`: people and claims from the export.
- **Correction:** vibration now waits for a user gesture, which cleared Chromium console errors.

### D.8 App A0–A2

On `origin/claude/app-a2-ui`, under `apps/dheevara/`.

- **Toolchain:**
  - Kotlin 2.4.20, Compose Multiplatform 1.12.1, AGP 9.4.1, Gradle 9.8.0, JDK 21
  - kotlinx-serialization 1.11.0, coroutines 1.11.0, datetime 0.8.0
  - Kover 0.9.11, Roborazzi 1.76.0
  - compileSdk and targetSdk 37, minSdk 26
  - package and applicationId `app.dheevara` (Avi to confirm)
  - iOS framework `DheevaraKit`.
- **CI:** `.github/workflows/app.yml`. Linux runs `check`, `assembleDebug` and koverLog; macOS runs iOS simulator tests and links the framework.
- **`shared/core`:**
  - `ChapterId` (`s[1-9][0-9]{0,2}e[1-9][0-9]{0,2}`)
  - manifest models plus `ManifestLoader` (ignoreUnknownKeys) and `ManifestCheck`
  - `ChapterTimeline` (a pure state machine; overlays pause; Next and Previous beat with a 3 s restart window; endings Countdown / UpNext / Upcoming / Locked / SeasonEnd; 10 s autoplay; off with a screen reader)
  - `Entitlements` and `Release`
  - `ChapterLink` (`https://dheevara.app/<chapter>/<reveal>?ref=<token ≤64>`).
  - **Coverage: 97%** (gate 90%).
- **`shared/ui`:**
  - theme from the tokens
  - `DText` (language-tagged text)
  - components: Button, Chip, Pill (AI label), Cite, LeafCard, Toggle, ListRow, TabBar, SegmentedProgress, Icon (generated from the mockup sprite by `scripts/icons.py`)
  - Roborazzi screenshots of the gallery at 390×844 and 360×740 (`controls_*.png`, `scene_*.png`)
  - 13 Noto and Geist TTF families bundled with OFL notices.
- **Test counts (`@Test` annotations):**
  - core: ChapterId 4, Entitlements 8, ChapterLink 8, LocalizedText 3, ManifestCheck 8, ManifestLoader 9, ChapterTimeline 24 → **64**
  - ui: Accessibility 9, Contrast 4, GalleryScreenshot 4, Typography 7 → **24**
  - total **88**.

**Pipeline test counts (`test(` calls):** canon 10, contract 14, env 6, manifest 8, plan 6, precommit 2, render 12, secrets 4, translit 5, voice 11, web 6 → **≈84**. M0-partial reported "20 passing". These were not re-run for these notes, since `node_modules` is absent.

### D.9 The app's manifest mismatch

The app was built against the handoff's §7 sketch and its own fixture, before the schema existed. Read against `schema/chapter-manifest.schema.json` and the real `content/s1e3/manifest.json`:

1. **People edge: `rel` against `kind`.**
   - Pipeline and schema: `{rel, to, claims}`, where `rel` is snake_case (`child_of`, `student_of`, `spouse_of`, `parent_of`, `killed_by`, `boon_from`, `saved_by`, `asked_by`).
   - App: `PersonEdge(to, kind, claims = [])`, where `kind` is **required, with no default**. Its fixture uses `kind: "taught-by"` (kebab-case).
   - With `ignoreUnknownKeys`, `rel` is dropped and `kind` is missing, so `MissingFieldException` makes the **real manifest load as `Malformed` and refuse to play**.
   - The app's CI generator (`GenerateManifestFixtures`) would surface this as soon as the branches merge: `ManifestLoaderTest` iterates `ManifestFixtures.content`.
2. **Verse ranges.**
   - Pipeline claims carry `verseEnd` (e.g. `mbh.7.34.17-21` → verse 17, verseEnd 21) and `summary`.
   - The app's `Claim` has no `verseEnd`, `summary` or `status`, so they are silently dropped. `citation` would print **`7.34.17` for a 17–21 range**.
   - **Adhyāya ranges are lost in the pipeline too:** `mbh.14.65-69` becomes `{book:14, adhyaya:65}`. `src/plan/manifest.mjs` never writes `adhyayaEnd`, and the schema has no field for it.
3. **Popular-telling source shape.**
   - Schema: `{label, url, retrieved}` (strings; `retrieved` is YYYY-MM-DD).
   - App: `source: LocalizedText` (a language→string map, per the provisional decision).
   - The real `{label: "Popular telling…"}` deserialises as a "language" named `label`, so a wrong value is shown with no error.
   - Popular `text` is `textOrEmpty` in the schema and `LocalizedText` in the app (compatible).
4. **Claim status.**
   - Schema: `status` (etext | proofed | signed) is **required** on a manifest claim.
   - App: no `status` field, so the app cannot show proof status or gate on it. The app fixture's claims lack `status` and would fail the pipeline schema.
5. **Collection tier.** The schema allows `claims` on collection; the app's `CollectionTier` has no `claims`.
6. **`signOff`.** The schema shape is `{by, date, record}` or null; the app's `JsonObject?` checks presence only (as decided).
7. **Duration and claims in the fixture.**
   - The app fixture has `durationMs` 116,000 against the real 114,000.
   - It cites `mbh.1.213`, a whole adhyāya **not registered** as a claim; the canon registers `mbh.1.213.65` and `mbh.1.213.58-61`.
   - Fixture collection status is `proofing`; real is `none`.
   - Fixture people lack `rel`.
8. **Text edition.**
   - Manifest claims hard-code `edition: "BORI CE"`, while `manifest.edition` and the export use "Mahābhārata, critical edition (BORI)".
   - Claims have no `text` field (mbh/ram), so a Rāmāyaṇa manifest claim would also say "BORI CE" and be ambiguous: `book` means kāṇḍa and `adhyaya` means sarga.
9. **Language tags.** Narration and casts use BCP-47 regional codes (`en-IN`, `hi-IN`); the manifest and app use base codes (`en`, `hi`). The mapping is implicit.
10. **Witness.** The manifest enum is `sanjaya|vanara|charioteer`; the app takes `witness: String` with no check.
11. **Revered and witness flags.** These exist on canon people but are **not carried into the manifest or export people** (the export drops `review`, and the manifest people have only id, names and edges). The app cannot enforce rule 1 at render time.
12. **Release date.** The manifest has only `next.releaseLocal` ("19:00"); no release **date** exists anywhere in content. `Release(date, …)` in the app has no data source.

### D.10 Blocked or waiting on Avi

- **FAL_KEY** (M2–M4) and a fal budget.
- **Vāgdhenu:** a CUDA 12.1 GPU box (E2E or IndiaAI), and the author's permission or a human reciter.
- **A scholar:** none appointed. Every claim is `status: etext`; `signOff: null`; people `review: pending`. Rule 9 blocks anything public.
- **Rights:** BORI written permission; Rāmāyaṇa e-text rights; a lawyer on AI rules and OTT.
- **Key rotation:** Sarvam, Exa and Jev keys were pasted in chat ("Leaked API keys — Already happened").
- **Sarvam training opt-out** in the dashboard.
- **Jev:** yes or no. Note `docs.typesafe.ai` was on the 3 Oct blocked list; the key worked on 4 Oct.
- **H3:** a written answer from fal or MiniMax on territory.
- **Confirmations:**
  - the look (temple relief)
  - cold-open order
  - 9:16
  - `app.dheevara` id
  - pilot arc and languages (the five proposals)
  - narrator casting
  - native Hindi reviewer
- **Allowlist:** `dl.google.com` and `maven.google.com` for the app session (granted, since A0–A2 built).

### D.11 Published artifacts and links

From `docs/artifacts.md` on HEAD; the app branch's copy is older.

| Artifact | Link |
|---|---|
| Chapter prototype (s1e3, clickable) | https://claude.ai/artifact/BJ3sGDARRf8QSSZrkcHN8q |
| Product language v2 (35 screens) | https://claude.ai/artifact/JpYzuuAD5oDfbmzzdcGPY4 |
| Chakravyūha (reference JS; pre-review text, corrected version on `claude/m6-web`) | https://claude.ai/artifact/16qHAubWf2dXmMStqkM6vJ |
| s1e3 Narration (Bulbul v3, en and hi, casting samples, STT match; private draft) | https://claude.ai/artifact/52v4B7Rt73oVftrKcwdZJF |
| Lineage explorer (private draft) | https://claude.ai/artifact/VwPmAnnmWzyyaw9gPiRd9M |
| Maināka (Sundarakāṇḍa 1; private draft) | https://claude.ai/artifact/V6G58jzZXNqGgrx7J73dZ3 |
| Build Brief full text | https://claude.ai/code/artifact/653d1aff-1744-4c5f-84ae-97ba0c88fe6b |
| Drive index doc | https://docs.google.com/document/d/1wDhWaCbXK7gdhiXrmbZuQMm323LT1xBb6WiYCTi6TwQ |

The Drive folder "Dheevara — Build Output" has id `1-B1xvZsR87AFbqvXCvPEQNQws-IREygt`.

---

## E. Data: exact inventory

All canon and content data is **JSON files in git**. There is no database, graph store, object store or IIIF anywhere yet. The plan's Postgres, Neo4j and Weaviate design is unbuilt.

### E.1 `content/canon/sources.json`: editions and provenance

`{ editions: [ … ] }`, 2 editions.

**`bori-ce`** (text `mbh`):
- title "The Mahābhārata, critical edition"; publisher BORI Pune; `years: "1933–1966"`; `volumes: {"7": "Droṇaparvan, ed. S. K. De (1958); page numbers unverified until DHE-1"}`; `shownAs: "Mahābhārata, critical edition (BORI)"`.
- `etext {id: "gretil-mbh", description, notice, files: {"1"|"3"|"4"|"7"|"14": {url, sha256}}, retrieved: "2026-10-04"}`.
- `rights` (prose).
- `devanagariCheck {id: "smith-ud", files {…UD/MBh0N.txt: {url, sha256}}, retrieved}`.

**`baroda-ce`** (text `ram`):
- `years "1960–1975"`; `etext {id: "smith-ram", format: "smith", bookDigits: 1, files {"5": Ram05.txt UR}}`; `devanagari {id: "smith-ram-ud", files {"5": …}}`; `rights`.

**Time in this file:** edition years (1933–1966, 1958, 1960–1975); retrieval date (2026-10-04); file pinning by sha256 (a content version). Upstream "last updated" dates live only in prose (Smith Book 7 "22 Sep 2026"; GRETIL Last-Modified 4 Apr 2016; Smith Ram00 25 Sep 2020).

### E.2 Verse index: `content/canon/{mbh,ram}/verse-index.json`

`{ "<book>": { "<adhyāya>": <verse count> } }`.
- MBh books 1, 3, 4, 7, 14. Book 7 has 173 adhyāyas and 8,152 verses; Book 1 225 and 7,197; Book 3 299 and 10,316; Book 4 67 and 1,824; Book 14 96 and 2,743.
- Rāmāyaṇa: book 5 (Sundarakāṇḍa), e.g. `"5": {"1": 190, "2": 55, …}`.
- This is what `resolve()` checks existence against.

### E.3 Passages: `content/canon/{mbh,ram}/passages.json`

A map from verse id to record. Only verses cited by claims: **52 MBh and 47 Rāmāyaṇa**.

```json
"mbh.1.213.58": { "id": "mbh.1.213.58", "edition": "bori-ce",
  "iast": "tataḥ subhadrā saubhadraṃ keśavasya priyā svasā / jayantam iva paulomī dyutimantam ajījanat",
  "devanagari": "ततः सुभद्रा सौभद्रं … ॥ ५८ ॥", "devanagariCheckedAgainst": "smith-ud" }
"ram.5.1.6": { "id": "ram.5.1.6", "edition": "baroda-ce", "iast": "…", "devanagari": "… ॥ ६ ॥" }
```

Rāmāyaṇa records lack `devanagariCheckedAgainst`, because Smith's Devanagari is itself the text of record. There is no translation, page, bounding box, metre or proof status at passage level.

### E.4 Star passages: `content/canon/mbh/variants.json`

```json
"mbh.7.34.18*259": { "id": "mbh.7.34.18*259", "edition": "bori-ce", "after": "mbh.7.34.18",
  "iast": ["śṛṇu rājan …", "purā garbhagate vāpi cakravyūhapraveśanam", "…", "…"],
  "note": "Star passage printed in the critical apparatus, not in the constituted text." }
```

There is 1 record. The IAST is an array of lines. There is no Devanagari and no manuscript list in a field; K1–2 appears only in the docs.

### E.5 Claims: `content/canon/claims/{s1e3,mainaka}.json`

Schema: `schema/claim.schema.json`. The file is `{claims: [claim]}`; each claim is `additionalProperties: false`:
- `id`: pattern `^[a-z]{2,8}(\.[0-9]+){1,3}(-[0-9]+)?$`. Forms: `mbh.B.A.V`, `mbh.B.A.V-W`, `mbh.B.A`, `mbh.B.A-C`. For the Rāmāyaṇa, `ram.<kāṇḍa>.<sarga>.<verse>`.
- `edition`: a `sources.json` id.
- `statement`: one sentence of what we rely on it for, at least 10 characters; "not a translation".
- `translation?`: `{en, by: "scholar-review"|"draft"|"ganguli"}`.
- `status`: `etext` → `proofed` → `signed`.
- `flags?`: strings (open questions or corrections).

**Counts:** s1e3.json has 28, all `etext`, 2 with a `scholar-review` translation. mainaka.json has 15, all `etext`, none translated. 43 total.

```json
{ "id": "mbh.7.32.12", "edition": "bori-ce",
  "statement": "Droṇa tells Duryodhana that today he will fell a foremost great warrior of the Pāṇḍavas.",
  "status": "etext",
  "flags": ["The handoff and scholar review had this vow at c. v.13; the e-text places it at 7.32.12, with the array at 7.32.13."] }
```

**Resolution:** a claim is citable only if it is registered and its verses exist in the verse index. CI fails on any unresolved id in content, the manifest or a contract.

**Time:** status is a lifecycle with **no timestamps or actor**. A flag is free text. There is no validFrom, revision or history beyond git.

### E.6 People and relations: `content/canon/people.json`

`{note, people: [person]}` with **23 people**: abhimanyu, arjuna, subhadra, krishna★, pradyumna, yudhishthira, drona, karna, duryodhana, jayadratha, duhshasana, daushasani, uttara, virata, parikshit, sanjaya◆, dhritarashtra, shiva★, hanuman★, vayu★, samudra★, mainaka, vanara◆. ★ = revered, ◆ = witness.

```json
{ "id": "abhimanyu", "names": { "sa": "अभिमन्यु", "en": "Abhimanyu" },
  "revered": false, "witness": false, "review": "pending",
  "edges": [ { "rel": "child_of", "to": "arjuna", "claims": ["mbh.1.213.58-61"] },
             { "rel": "student_of", "to": "arjuna", "claims": ["mbh.1.213.65"] },
             { "rel": "spouse_of", "to": "uttara", "claims": ["mbh.4.67.7"] },
             { "rel": "parent_of", "to": "parikshit", "claims": ["mbh.14.65-69"] },
             { "rel": "killed_by", "to": "daushasani", "claims": ["mbh.7.48.12-13"] } ] }
```

- **12 edges in total**, every one citing a claim.
  - rel counts: `child_of` 5, `student_of` 1, `spouse_of` 1, `parent_of` 1, `killed_by` 1, `boon_from` 1 (jayadratha→shiva), `saved_by` 1 (mainaka→vayu), `asked_by` 1 (mainaka→samudra).
  - Hanumān `child_of` vayu (`ram.5.1.106-107`).
  - Edges are directed and stored on the source person only. Inverses are not materialised: `parent_of` appears once, while `child_of` appears five times.
- `vanara` is a *class* ("a vānara on Mahendra"), not an individual, yet it is stored as a person.
- No places, events, objects, eras or epithets exist as entities.
- Names have only `sa` and `en`; there are no regional-language names yet, though the pronunciation dictionary needs them.

### E.7 Cross-references

There is no explicit cross-reference structure. Cross-references exist implicitly:
- claims cited by several artefacts (captions, reveals, edges, shots, narration lines)
- the claims' `statement` text (e.g. 7.41 "retelling 3.256")
- `beats.json` `scholarNote`.

The handoff's "cross-references in section 6" became individual claims: 1.213, 3.132, 3.256, 4.67 and 14.65–69 alongside book 7.

### E.8 Canon export: `content/canon/export.json`

Generated by `pnpm canon:export` for the app and web. `{note, editions[2] {id, text, shownAs, etext, notice}, people[23] (without "review"), claims{43}}`.

Each claim is resolved:

```json
"mbh.7.34.19": { "text": "mbh", "book": 7, "adhyaya": 34, "verse": 19,
  "edition": "Mahābhārata, critical edition (BORI)", "statement": "…", "status": "etext",
  "translation": { "en": "My father taught me …", "by": "scholar-review" },
  "verses": [ { "id": "mbh.7.34.19", "devanagari": "उपदिष्टो हि मे पित्रा … ॥ १९ ॥", "iast": "…" } ] }
```

Ranges carry `verseEnd` plus the `verses[]` array. Whole-adhyāya claims have no `verses`. The export keeps `text` and `adhyayaEnd`, whereas the manifest drops them.

### E.9 Chapter manifest: `schema/chapter-manifest.schema.json`

JSON Schema 2020-12, `$id https://dheevara.app/schema/chapter-manifest.schema.json`. "Stable contract with the app session; change it only additively."

**Top level** (all required, `additionalProperties: false`):

| Field | Shape |
|---|---|
| `$schema?` | |
| `id` | chapterId `^s[0-9]+e[0-9]+$` |
| `season` | slug |
| `title` | text: `{lang: string}`, `en` required, lang `^[a-z]{2,3}$` |
| `edition` | string |
| `durationMs` | integer ≥1 |
| `witness` | `sanjaya \| vanara \| charioteer` |
| `beats[]` | `{kind: cold_open\|verse\|scene\|reveal\|question, startMs, endMs, verse?: claimId, reveal?: slug}`; contiguous 0→durationMs, checked in code |
| `media` | see below |
| `captions[]` | `{startMs, endMs, text, claims: claimList}` (claimList: minItems 1, unique) |
| `reveals[]` | see below |
| `people[]` | `{id: slug, names: {lang: string, en required}, edges: [{rel: ^[a-z]+(_[a-z]+)*$, to: slug, claims: claimList}]}` |
| `claims` | `{claimId: claim}`, every id referenced anywhere, checked in code |
| `next` | `{id: chapterId, releaseLocal: "HH:MM"}` or null |
| `provenance` | see below |

**`media`:**
- `video {status: pending|draft|final, hls: url|null, mp4: url|null}`
- `narration {lang: track}` (min 1); `track = {status, url|null}`
- `chant: track`
- `experience: "web/<name>.html" | null`.

**`reveals[]`:**
- `id`: slug; `title`: text
- `popular {text: textOrEmpty, source {label?, url? ^https?://, retrieved? YYYY-MM-DD}}`
- `text {text, claims}`
- `collection {status: proofing|ready|none, text?, claims?}`.

**`provenance`:** `{aiLabel: const true, signOff: {by, date YYYY-MM-DD, record} | null}`.

**`$defs.claim`:**
- `{book ≥1, adhyaya ≥1, verse?, verseEnd?, edition, devanagari?, iast?, translation?: text, summary?: text, status: etext|proofed|signed}`
- **Missing:** `text` (mbh/ram), `adhyayaEnd`, page reference and scan URL.

**Real s1e3 manifest values:**
- `title {en: "The way in", hi: "भीतर का रास्ता"}`; `season mbh-s1`; `durationMs 114000`; `witness sanjaya`
- 5 beats; 13 captions (en and hi, each with ≥1 claim, timed from audio, e.g. 2955–7766 ms → `mbh.7.32.12`)
- 1 reveal; 14 people (12 edges reduced to those among the chapter's people); 19 claims
- `media` all `pending`, `experience: "web/chakravyuha.html"`
- `next {id: "s1e4", releaseLocal: "19:00"}`; `provenance {aiLabel: true, signOff: null}`.

**Validation:** `src/canon/manifest.mjs` validates against the canon. The manifest test requires the committed file to equal a rebuild.

**Time in the manifest:** chapter-relative milliseconds (beats, captions); a wall-clock local release time with no date; the `signOff.date` and `popular.source.retrieved` date strings. There is no manifest version, generation time or content hash.

### E.10 Shot contract: `schema/shot-contract.schema.json`

All required, `additionalProperties: false`:

| Field | Shape |
|---|---|
| `id` | `^s[0-9]+e[0-9]+-sh[0-9]{2,3}$` |
| `chapter` | chapterId |
| `beat` | 5 kinds |
| `retention` | `hook \| stakes \| connective \| reveal \| cliffhanger` |
| `witness` | `sanjaya \| vanara \| charioteer` |
| `camera` | `{framing: extreme_wide\|wide\|medium_wide\|medium\|medium_close\|close\|insert, move: static\|push_in\|pull_out\|pan\|tilt\|track\|crane\|orbit, height?: ground\|low\|eye\|high\|overhead, lensMm?: 10–200}` |
| `setting` | string ≥10 |
| `blocking` | string ≥20 |
| `durationS` | 2–15 |
| `references` | unique `^(char\|loc\|obj\|style)\.[a-z0-9_]+(\.[a-z0-9_]+)*$` |
| `claims` | ≥1 claimId |
| `forbidden` | unique snake tokens; must contain `deity_face_closeup` and `pov_inside_deity` |
| `territory` | `worldwide \| india_only` |
| `quality` | `draft \| final` |
| `notes?` | string |

The example `s1e3-sh05` is in the dump above; references used are `char.abhimanyu, obj.chariot, obj.bow, style.relief_basalt_lamp`.

**Reference ids are dangling:** there is no asset bible or registry for `char.*`, `loc.*`, `obj.*` or `style.*` (DHE-12). `char.<id>` happens to match `people.json` ids. `loc.kurukshetra`, `obj.chariot`, `obj.chariot_wheel`, `obj.bow` and `style.relief_basalt_lamp` resolve nowhere.

**Story time in contracts:** only free text in `setting`. Across sh01→sh13 it runs: dawn → morning → midday → late morning → sun higher → midday → afternoon light turns low → late afternoon → end of the day / sunset → (lamp-lit panels for the reveal) → sunset. There is no structured story-day or time-of-day field. "Day 13" appears only in docs and season copy.

### E.11 Beat map: `content/s1e3/beats.json`

```
{ chapter, season, title, witness, status (prose), durationMs,
  beats[ { kind, startMs, endMs, purpose, verse?, reveal?, holdMs?, chant?{status,note},
           shots[ { id, lines[narration ids] } ] } ],
  reveals[ … manifest shape + scholarNote ],
  people[ ids ], next, experience }
```

### E.12 Narration and voice data

- **`content/s1e3/narration.json`:** `{chapter, status, languages: ["en-IN","hi-IN"], disclosure {note, text {en-IN, hi-IN}}, lines[13] {id, beat, claims[], text {en-IN, hi-IN}}}`.
- **`content/s1e3/voice-timing.json`:** `{note, "en-IN": {lineId: ms}, "hi-IN": {...}}`. Example: n12 is 10,500 ms in en and 11,448 ms in hi; the disclosure is 2,072 and 2,255.
- **`content/voice/casts.json`:** `{note, narrators {"en-IN": {speaker, pace, temperature, alternates[]}, …}}`.
- **`content/voice/terms.json`:** `{note, terms[{id, forms[]}]}`: cakravyuha, samshaptaka, pandava. People names come from `people.json`.
- **Audio metadata (cache, gitignored):**
  - `out/cache/voice/<sha256>.wav` plus `<sha256>.json`: `{requestId, provider/model/codec…, lang, speaker, pace, dictId, dictHash, sampleRate, temperature, chars, at}`, text omitted.
  - `out/cache/stt/<sha256>.json`: `{transcript, requestId}`.
  - Rendered lines go to `out/<chapter>/voice/<lang>/<lineId>.wav`; samples to `out/<chapter>/voice-samples/<lang>/<speaker>.wav`.
  - None of `out/` is committed, and none exists in this checkout.
- **Cache key:** `sha256(JSON of {provider:'sarvam', model:'bulbul:v3', codec:'wav', text, lang, speaker, pace, dictId, dictHash, sampleRate, temperature}, sorted keys)`.

### E.13 Ledger: `content/s1e3/ledger.jsonl`

Append-only and fsynced; one JSON object per line; **238 rows**. Common fields: `at` (ISO-8601 UTC ms), `run` (`<ISO with dashes>-<uuid8>`, one per CLI invocation), `kind`, `phase` (`intent` → `done` | `failed`; render adds `queued`), `key` (idempotency), `provider`.

**`voice` intent:**
```json
{"at":"2026-10-04T08:23:49.916Z","run":"2026-10-04T08-23-48-294Z-0ced47ac","kind":"voice","phase":"intent",
 "key":"voice:s1e3:n00-disclosure:en-IN:ratan","provider":"sarvam","model":"bulbul:v3","lang":"en-IN",
 "speaker":"ratan","pace":0.9,"sampleRate":24000,"dictId":"p_dec79afd","chars":31,"estUsd":0.00096553,
 "cacheHash":"c8b36f41…","licence":"Sarvam Production License (EULA), output assigned to us","territory":"worldwide"}
```

**`voice` done:** `{…, requestId:"20261004_0179963b-…", ms:1560, chars:31, usd:0.00096553, bytes:98964}`.

**`stt-check`:** intent `{model:"saaras:v4", lang, seconds:2.061, estUsd}`; done adds `{requestId, ms, seconds, usd}`.

**`voice-dictionary`:** intent `{action:"create"|update, words:25, usd:0}`; done `{id:"p_dec79afd", usd:0}`; failed `{status:405, error:"{\"detail\":\"Method Not Allowed\"}"}`.

**`render`** (defined in code, no rows yet):
- intent `{shot, beat, attempt, quality, provider:'fal', model, endpoint, seed, resolution, billedS, estUsd, licence, territory, contractTerritory, inputHash}`
- queued `{model, requestId, statusUrl, responseUrl, submitMs}`
- done `{model, requestId, queueMs, usd, seed, bytes, path}`
- failed `{ms?, status?, error, errorType?}`.

**Counts:** voice 60/60, stt 56/56, dictionary 3 intent / 2 done / 1 failed. There are 6 runs between 08:23:48 and 08:28:23 UTC on 2026-10-04.

The field `cacheKey` was renamed `cacheHash`, because gitleaks flagged sha256 values under a `*Key` name.

### E.14 Approvals

`content/<chapter>/approvals/<shot>.json` with shape `{ shot, quality: "final", by, date }`. Only a human writes these. **None exist.** There is no QC verdict file either (`content/<chapter>/qc/` was planned for M3).

### E.15 Model registry: `src/render/models.mjs`

`MODELS[id] = {family, endpoint, provider, partner, licence, territory, durations{min,max,integer,asString | allowed[]}, resolutions, usdPerSecond{res|default}, seed, negativePrompt, loras, needsReferenceImages?, needsLora?, unavailable?, research}`.

| id | endpoint | territory | $/s |
|---|---|---|---|
| kling-v3-standard-t2v | fal-ai/kling-video/v3/standard/text-to-video | worldwide | 0.084 |
| kling-v3-pro-t2v | …/v3/pro/text-to-video | worldwide | 0.112 |
| wan-3.0-t2v | alibaba/wan-3.0/text-to-video | worldwide | 480p 0.05 / 720p 0.10 / 1080p 0.20 |
| wan-3.0-r2v | alibaba/wan-3.0/reference-to-video | worldwide | same as t2v |
| h3-lora-r2v | minimax/h3/reference-to-video/lora | **india_only** | 480P 0.0625 / 768P 0.075 / 2K 0.1625 / 4K 0.2 |
| h3-selfhost | none (no GPU) | **india_only** | 0 |
| ltx-2.5-t2v-fast | lightricks/ltx-2.5/text-to-video/fast | worldwide | 720p 0.09 … 2160p 0.30 |

`TIERS` gives the draft and final resolution per model.

**`src/providers.mjs`:** `PROVIDERS{sarvam: opt-out, jev: no, exa: yes, fal: opt-out, vagdhenu: no}`, each with `research`, `terms[]` and `retrieved`. `DATA_CLASSES = public | script | unreleased_source`. `assertDataUse(provider, class)` enforces rule 5.

### E.16 Web content

- **`content/web/mainaka.json`:**
  - `{id, title{en,sa}, subtitle, witness:"vanara", status}`
  - `phases {mahendra|leap|sea|rise|touch: [ {at: s, dur: s, text{en}, claims[]} ]}`. Timing is **seconds relative to each phase**, unlike the manifest's chapter-relative ms.
  - `reveals[]` (manifest shape)
  - `question {text, claims}`.
- **`web/chakravyuha.html`:** captions are hand-authored inside the HTML as `[text, '7.47.18–30']` strings (en-dash, no `mbh.` prefix). The test maps them to registered claims.
- **`web/lineage.html`:** built from `export.json`.

### E.17 App-side models

Kotlin, `apps/dheevara/shared/core`, kotlinx.serialization:
- `ChapterManifest(id: ChapterId, season, title: LocalizedText, edition, durationMs: Long, witness: String, beats, media, captions=[], reveals=[], people=[], claims: Map<String,Claim>={}, next: NextChapter?=null, provenance)`
- `Beat(kind: BeatKind, startMs, endMs, verse?, reveal?)`; `BeatKind {cold_open, verse, scene, reveal, question}`
- `Media(video: Video, narration: Map<String,Track>={}, chant: Track?, experience: String?)`; `Video(status, hls?, mp4?)`; `Track(status, url?)`; `MediaStatus {pending, draft, final}`
- `Caption(startMs, endMs, text: LocalizedText, claims: List<String>)`
- `Reveal(id, title, popular: PopularTelling(text, source: LocalizedText=Empty), text: TextTier(text, claims), collection: CollectionTier(status, text=Empty))`; `CollectionStatus {proofing, ready, none}`
- `Person(id, names: LocalizedText, edges: List<PersonEdge>=[])`; **`PersonEdge(to, kind, claims=[])`**
- `Claim(book, adhyaya, verse?, edition, devanagari?, iast?, translation=Empty)` with `citation = "b.a[.v]"`
- `NextChapter(id, releaseLocal: LocalTime)`; `Provenance(aiLabel: Boolean, signOff: JsonObject?)`
- `LocalizedText(byLanguage: Map<String,String>)` with `pick(preferred) → TaggedText(lang, text)`
- `ManifestProblem`: UnresolvedClaim | Uncited | BrokenTimeline | CaptionOutOfRange | DanglingBeat | UnknownPerson. `ManifestLoad`: Ok | Invalid | Malformed.
- Access: `Membership {None, Active(until: Instant?)}`; `Access {Free, Member, NotYetReleased(at: Instant), NeedsMembership}`; `Release(date: LocalDate, localTime = 19:00)`
- `ChapterLink(chapter, reveal?, ref?)`
- Timeline: `TimelineState(positionMs, wantsToPlay, overlay?, ending?)`; `Overlay {Reveal(id), Controls, Page, People, Share}`; `Ending {Countdown(next, remainingMs), UpNext, Upcoming(next, at), Locked, SeasonEnd}`; `Autoplay(enabled, screenReaderOn, countdownMs = 10000)`; events and `PlayerCommand {Play, Pause, SeekTo, StartChapter}`.
- **Planned, not built:** SQLDelight for progress, kept reveals and downloads; a telemetry per-second heartbeat tied to beat and shot ids (DHE-16), with no schema yet; a `ChapterPlayer` interface.

### E.18 Where time appears today

| Kind of time | Where | Form |
|---|---|---|
| Story time (narrative) | Docs and copy ("day 13", "the thirteenth day"; dawn array to sunset); shot `setting` prose; claim `mbh.7.48.41` "dusk comes"; `mbh.7.51.20` "tomorrow"; Jayadratha's boon "no time limit" | **Unstructured text only** |
| Text order / position | Claim ids (book.adhyāya.verse) are the only ordering of events; star passage `after` | Structured |
| Edition time | `sources.json` years (1933–1966, 1958, 1960–1975); upstream e-text last-updated dates in prose | Strings |
| Retrieval / provenance | `retrieved: "2026-10-04"` on sources and providers; research rows dated; `popular.source.retrieved` (schema only); sha256 pins | Dates |
| Proof lifecycle | claim `status` etext→proofed→signed; people `review: pending`; `signOff.date` | **States without timestamps** |
| Media lifecycle | `media.*.status` pending→draft→final | State |
| Chapter-relative | beats, captions (ms); voice-timing (ms); Maināka phases (s, phase-relative); shot `durationS`; `holdMs` | Numbers |
| Release / calendar | `next.releaseLocal "19:00"`; app `Release(date, 19:00)`; festival dates in docs and mockups | Local time; **no release dates in data** |
| Operational | ledger `at` ISO ms UTC, `run` ids, `ms`/`queueMs`/`submitMs`; cache `.json` `at`; Sarvam `requestId` embeds a date | Timestamps |
| Membership | `Membership.Active(until: Instant?)` | Instant |
| Versioning | git commits only; manifest must equal a rebuild; no data versions | — |

### E.19 Gaps and inconsistencies (data)

1. **No graph store.** The "canon graph" is two JSON files: people with embedded edges, and claims. There are no Place, Event, Object, Era, Source-page or Shot entities, and no `obj.*`, `loc.*` or `style.*` registry.
2. **Edges are not temporal.** Relations have no time, no "as of" story point, and no qualifiers (e.g. `killed_by` with no event or day). Inverses are implicit.
3. **No provenance chain beyond claim ids:**
   - No page or IIIF coordinates (planned: DHE-22).
   - No translator on most claims.
   - No reviewer identity or time on status changes.
4. **`edition` naming differs across files:** `bori-ce` (claims, passages), "Mahābhārata, critical edition (BORI)" (export, manifest top level), "BORI CE" (manifest claims, app fixture).
5. **Range loss:** the manifest drops `adhyayaEnd` and `text`; the app drops `verseEnd`, `summary` and `status`.
6. **`rel` vs `kind`; `source` shape; required `status`:** see D.9.
7. **Three timing conventions:** chapter-relative ms (manifest, beats); line-duration ms (voice-timing); phase-relative seconds (Maināka). Chakravyūha timing is hard-coded in JS.
8. **Language codes:** `en-IN`/`hi-IN` (voice) against `en`/`hi`/`sa` (manifest, app, canon names).
9. **`vanara` is a class stored as a person.** Witness ids are an enum in two schemas plus canon flags, with three places to keep in sync.
10. **Star passages have no id grammar in claims** (by design). The `*259` key form appears only in `variants.json`.
11. **Ledger:** written per chapter, but dictionary rows are chapter-agnostic and sit in the s1e3 ledger. `usd` is an estimate converted at a fixed 96.32 INR/USD. There is no ledger schema file.
12. **No telemetry schema** exists, though the plan says both tracks share "the same telemetry schema".
13. **`docs/tickets.csv`**, cited by the plan, is absent.
14. The handoff example (`durationMs` 116000, beat boundaries 80000/100000) and the app fixture no longer match the real plan (114000; 84000/102000).

---

## F. Every dated decision in `docs/decisions.md`, across branches

There are 55 entries: **44 on HEAD** (`m6-web`, which already contains every sweet-mendel and M0–M5 entry) **plus 11 only on the app branches**. Every entry is dated 3 or 4 Oct 2026.

**2026-10-03** (10, on all branches):
1. **No local fallbacks for providers.** Every step calls the real service or fails (Avi's call).
2. **Planner and QC run in chat, not via the Anthropic API.** Verdicts are committed files.
3. **Drive output folder** "Dheevara — Build Output". The connector sees only files it created.
4. **Mockups before the app.** The surface is mocked at 390×844 and reviewed by four agents (art, scholarship, product, accessibility).
5. **Jev is the general decision layer** (`JEV_API_KEY`, `JEV_BASE_URL`). It was blocked by the allowlist at the time.
6. **Cold open before the book page.** Grammar: cold open (5–8 s) → verse chanted → witness scene → hidden detail → question; lineage available at any moment.
7. **Product language v2: sleek and clean.** Geist, Tiro for verse only, Noto for Indic; near-black; amber = source; sindoor = now; off-white primary; flex to 360×740.
8. **The look: temple relief, lit by one lamp.** Ellora basalt for MBh, Hampi granite for Ram; miniature only on still surfaces. Avi to confirm.
9. **Wording follows the critical edition.** Seven rings, "sixteen" and the womb story are the popular telling; ch 3 is "The way in", not "The seventh ring".
10. **Release and free rules.** Ch 1 free; members get every released chapter; banked launch; 7 pm viewer time; autoplay stoppable and can be turned off.

**2026-10-04, design and product session** (5):

11. **Style bible drafted** (`design/style-bible.md`). Binding once Avi confirms the look.
12. **Session ownership.** Pipeline owns `src/ schema/ content/ services/ web/`; app owns `apps/`; design owns `design/ docs/research/product/`.
13. **Proposed, for Avi: research-led changes.** Sundara Kāṇḍa pilot timed to 6 Nov 2026; languages en/hi/te/gu/ta; price tests (₹1,499/₹1,999/yr, ₹99 vs ₹149/mo, $49 family, quarterly); authority = visible citation plus a named scholar; paid launch at the April 2027 festivals. Not adopted.
14. **AI disclosure built in.** Burned-in label, spoken disclosure before AI narration and chant, C2PA; lawyer review required.
15. **Chapter order in the season.** Ch 4 "The gatekeeper" (3.256, 7.41–42); ch 5 "Arjuna's vow" (7.50–51).

**2026-10-04, pipeline M0** (3):

16. **Tests on node:test; contracts on strict Ajv (draft 2020-12)**, with errors as sentences.
17. **gitleaks pinned at 8.30.1 in `.tools/bin`**, checksum-verified or `go install`, with no unchecked fallback.
18. **Witness allowlist (sanjaya, vanara, charioteer) and REVERED list live in code until the canon carries them.** Extend, never shorten, without a scholar.

**2026-10-04, M0.5 research** (4):

19. **Provider research lives in `docs/research/`**, one file per provider, every fact with a URL and date; code cites rows.
20. **Hosted MiniMax H3 is treated as India-only** until fal or MiniMax confirm in writing (licence of 2 Aug 2026, §V.4). This reverses the plan.
21. **Sarvam is treated as a service that may train on inputs.** Unreleased source is blocked; Avi is to opt out.
22. **Jev is proposed, not routed.** Four uses proposed; #1 and #3 recommended; its terms say no training.

**2026-10-04, M5 canon** (5):

23. **Canon v0 is a verse index plus only the cited verses**, generated from GRETIL pinned by sha256 and checked against Smith's Devanagari (35/35). Full e-texts stay in `.cache/` (BORI copyright).
24. **A claim is citable only if it is registered and resolves.** Id forms `mbh.B.A.V`, `-W`, `mbh.B.A`, `mbh.B.A-C`; status etext→proofed→signed; CI fails on unresolved ids.
25. **Star passages are kept apart and are never claims.** *259 after 7.34.18 (K1–2) is flagged for the scholar.
26. **Verse numbers corrected from the e-text.** 7.32.12 (not c.13); 7.48.21 (not c.22); śiśu at 7.48.32 and 7.34.26.
27. **The canon's revered and witness flags mirror the code lists** (`review: pending`). The canon can extend REVERED, never shorten it; a test checks agreement.

**2026-10-04, M1 voice** (4):

28. **Narration is cached on every input, including the dictionary's content hash.** A second run makes zero calls.
29. **The ledger is committed per chapter** (`content/<chapter>/ledger.jsonl`). An intent row is fsynced before a request; done or failed after; `MAX_RUN_USD` cap.
30. **Starting narrators and how they are checked.** en-IN ratan, hi-IN shubh, pace 0.9, temperature 0.7. The Saaras round trip caught 3 faults (Hindi negation, cakravyūha, breach→gap). Advisory; a native reviewer signs.
31. **The chant step fails until `VAGDHENU_URL` exists.** A wrapper for a CUDA 12.1 box over an SSH tunnel; the public HF Space is not used.

**2026-10-04, P plan** (3):

32. **Shot framing gains `medium_wide`; nothing closer may frame a person** (`insert` allowed).
33. **The s1e3 plan: 13 shots, no video on the verse beat, the question stays open.** 8 + 18 + 58 + 18 + 12 = 114 s; disclosure over the first 2 s; never-list plus `counted_rings` in forbidden.
34. **The manifest is built from the plan and timed from the audio.** Captions last as long as their longest language; media pending; the committed manifest must equal a rebuild.

**2026-10-04, M2 compiler** (5):

35. **Renders are driven by polling fal's queue; `webhook.mjs` is for deployment** (ED25519, 300 s window).
36. **Each take is fixed by shot and attempt.** Seed `sha256(shot:attempt)` (Kling null); idempotency `render:<shot>:<attempt>`; 1-day retention; download immediately.
37. **Finals need an approval file per shot** (`content/<chapter>/approvals/<shot>.json` `{shot, quality:"final", by, date}`, human-written).
38. **Video is composed 9:16 for the phone** (Avi to confirm).
39. **Draft routing for s1e3 without H3.** Hook, reveal and cliffhanger → Kling 3.0 standard ($0.084/s, no 480p); stakes and connective → Wan 3.0 480p ($0.05/s); character refs → Wan r2v once assets exist; no model audio; estimate $5.92.

**2026-10-04, M6 web** (5):

40. **The Rāmāyaṇa enters the canon from Smith's e-text of the Baroda CE** (Sundarakāṇḍa). Ids `ram.<kāṇḍa>.<sarga>.<verse>`; the IAST→Devanagari check covers all 99 verses (52 MBh, 47 Ram); rights pending.
41. **Vāyu and Samudra join the revered list.** Maināka is not a deity; the Maināka witness is a vānara on Mahendra, never Hanumān.
42. **One reveal module for every JS experience** (`web/shared/reveal-sheet.js`): three labelled layers, an accessible dialog, inlined at build.
43. **JS experiences are built from sources and the canon, and checked in a browser.** `pnpm web:build`, drift test, `pnpm web:check` at 390 and 1440 in Playwright (not in CI).
44. **Chakravyūha captions now match the CE and show their verse.** "a boy, not yet grown" (7.32.21–23); "He cannot fight his way out" (7.34.19); 7.47.31–33; 7.47.18–30; sunset 7.48.41; three new claims; vibration after a gesture.

**2026-10-04, app branches only** (11; `app-a0-gradle`, `app-a1-core`, `app-a2-ui`):

45. **App toolchain.** Kotlin 2.4.20, CMP 1.12.1, AGP 9.4.1, Gradle 9.8.0, JDK 21, serialization 1.11.0, coroutines 1.11.0, datetime 0.8.0; Android-KMP library plugin.
46. **Android SDK levels.** compile and target 37, minSdk 26 (Android 8.0).
47. **App ids `app.dheevara`**, matching dheevara.app deep links. Avi to confirm before the first store upload (A6).
48. **Walking skeleton first.** core (JVM, Android, iOS), ui (`DheevaraKit`), androidApp; `iosApp/` comes later on macOS.
49. **The app refuses a manifest that breaks the contract.** Unknown keys are ignored. An uncited caption or reveal, a missing claim, a broken timeline or a dangling reveal makes it Invalid. App CI loads every `content/*/manifest.json`.
50. **Provisional manifest fields, pending the schema.** `popular.source` as localized text; people edge `{to, kind, claims}`; `collection` may carry `text`; `signOff` checked for presence. "The pipeline session should adopt these in the schema or say what differs." **The pipeline did not adopt them** (it used `rel` and `{label, url, retrieved}`), and no decision records the difference.
51. **Core coverage gate.** Kover at 90% or more on `shared/core` (JVM); the same tests run on the Android host and the iOS simulator.
52. **Screenshot tests on Compose desktop.** Roborazzi at 390×844 and 360×740 @2x; fails on any pixel change; not a device render.
53. **Fonts bundled in the app, not fetched.** Geist, Tiro and Noto for 9 Indic scripts at 400/500/600, ~4.6 MB, OFL; not subset yet (accessibility finding 8).
54. **Icons come from the mockups' sprite** (`scripts/icons.py` from the `i-*` symbols).
55. **Indic text rules live in one place (`DText`).** Language tag → script font, no letter-spacing, line height ≥1.45, size ≥13, locale for screen readers, daṇḍa kept with its word.

---

## Surprises worth carrying into the documents

1. **The app cannot load the real manifest.** `PersonEdge.kind` is required while the pipeline writes `rel`, so the s1e3 manifest would be `Malformed` the moment the branches meet. The provisional-fields decision (#50) was never answered by the pipeline session.
2. **The womb story is in the critical apparatus** (*259, K1–2). The scholar review and handoff said it was absent. This turns the flagship reveal from "the text doesn't say it" into "the constituted text doesn't; some manuscripts do". That is a better product story, and its wording awaits the scholar.
3. **Hosted H3 is not diaspora-safe**, which reverses the plan. There is no reference-locked character model for the beachhead market.
4. **Total spend to date is about 17 US cents.** Nothing has rendered (no FAL_KEY), nothing is chanted (no GPU), and no scholar exists. Every one of 43 claims is `etext`, and `signOff` is null.
5. **Everything is two days old, and the calendar has moved:**
   - All work is dated 3–4 Oct 2026; nothing since.
   - The s31 Navarātri drop (11–19 Oct 2026) is happening now, with nothing shipped.
   - "Chapter 3 airs on 13 Oct" has passed.
   - The *Ramayana* Part 1 window (6 Nov 2026) the research targets is about 3 weeks away.
6. **Time is almost absent from the data model.** Story time lives only in prose (shot `setting`, "day 13"). Proof status has no timestamps. Relations carry no temporal qualifiers. Release dates exist nowhere in content. Only the ledger has real timestamps. That is the main design gap for a temporal knowledge graph.
7. **Rights constrain the data layer itself.** BORI asks that the e-text not be redistributed, and the 1958 Droṇaparvan may be in copyright in India until 2028. So the canon commits only the cited verses, and the app may not ship verse text until permission arrives.
