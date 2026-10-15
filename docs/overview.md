# Dheevara: product overview

Written 15 Oct 2026 for the founder and anyone joining the team. Everything here is read from the repository. All work in it is dated 3–4 Oct 2026, and nothing has been committed since 4 Oct 09:06 UTC. The design and product work is on `origin/claude/sweet-mendel-m0uwou`, the pipeline tip is `origin/claude/m6-web`, and the app is `origin/claude/app-a2-ui`. `main` holds only the licence. Paths are repo-relative.

## In one paragraph

Dheevara is a phone app for Indian mythology, history and culture, sold as serialised chapters of 90–120 seconds: "a book page flips into a scene you witness". Every caption and every hidden detail cites the verse it comes from. Chapters are narrated in up to eleven Indian languages, and the Sanskrit verse is chanted, not read. The first audience is diaspora families in the US, UK, UAE and Canada, who pay in dollars and want their children to learn the stories from a trusted source. Audio for Bharat follows in all eleven languages. The timing argument is that AI video is now cheap and its quality is rising. The first big attempt, the JioHotstar AI Mahabharat, was panned, and a funded competitor (Mythik) has shown demand without showing sources. The *Ramayana* film opens on 6 Nov 2026. As of 15 Oct 2026, Dheevara is a well-specified design and a working skeleton. It has 35 reviewed screens, a clickable prototype and three browser experiences. It has a cited canon of 43 claims, narration for one chapter in English and Hindi, a render compiler that has never rendered, and an app shell that cannot yet load the real chapter file. Total provider spend is about 17 US cents. No video has been made, no verse has been chanted, no scholar has signed anything, and nothing has shipped or been merged.

## Goal and vision

**The pitch, from the founder's plan** (`docs/product-plan.md`, "Dheevara — Final Plan", 3 Oct 2026):

> "Phone-first, premium short-form audio and video for Indian mythology, history and culture. Serialised chapters, cinematic AI-generated scenes, every claim cited to its source, in eleven Indian languages. Video and interactive JS chapters ship in parallel over the same canon."

*Dheevara* means fisherman or ferryman. The splash screen shows "a lamp on water: the ferryman who carries the story across" and the line "Stand beside the story." The working name was Pushpak.

**The plan's decisions.** The plan records fourteen decisions in order, and a later decision overrides an earlier one. The decisions that shape the product:

- It started as "a Pocket FM-shaped platform for Indian mythology, history and culture… built on sources most people cannot reach".
- **Witness, not embodiment.** "The viewer stands beside the event as a vānara or as Sañjaya, rather than playing a deity." This replaced an earlier first-person idea.
- **The canon graph is the engine.** Characters, places, lineages and events drive the script, the references and continuity.
- **Quality over volume.** "The backlash to the AI Mahābhārata set the bar; stylised beats photoreal."
- **Diaspora first.**
- **"Opus directs, fal renders."** Anything that ships uses hosted models.
- **"The JS track is a track, not a demo."**
- **Voice is two systems:** Sarvam Bulbul for narration and Vāgdhenu for chanted ślokas, "because a flat read of a śloka is the tell".
- **"Mythik exists."** Dheevara competes "on form, sourcing and language", not on being first.

**The moat.** "Assume a competitor can assemble the same texts in a week… What they cannot assemble in a week is the graph with a citation on every claim, the retention loop that tells us which beats hold people, and the craft." Against Mythik ("Disney from the East: a studio"), Dheevara positions itself as "a canon with a player on top: the thing other studios eventually license from".

**What it is not.** It is not a microdrama volume play, a ritual or puja app, a lean-back streaming service, or AR-first.

**The bet.** The plan makes four claims and gives each a pass bar and a kill signal. The retention gate is **12 Jan 2027**.

| Claim | Pass bar | Kill signal |
|---|---|---|
| Generation is a commodity; the canon is the moat | Reveal tapped on 40% of chapter views | Viewers skip the reveal |
| Fidelity beats volume | Beats a Mythik episode on completion and next-episode carry (200 diaspora viewers) | Loses on completion |
| Diaspora pays ~10× India's ARPU | Diaspora trial-to-paid >8%, refunds <5% | No better conversion at 10× the price |
| Native language beats English-first | Regional cohorts complete and share at or above English | Viewers default to English |

**The mission test.** The Build Brief (`docs/build-brief.md`; full text in the Build Brief artifact) defines v0 as done when `pnpm chapter s1e3 --quality draft` produces `out/s1e3/draft.mp4` and:

- the video is 90–120 s, with captions and an AI label burned in
- every shot has a ledger row (model, seed, licence, territory, cost)
- the run costs under $15
- the narration is Bulbul and the śloka is chanted by Vāgdhenu
- every caption line resolves to a claim id
- `web/chakravyuha.html` passes its checks and a second experience exists.

The last condition is met. The rest are not (see "What is built").

**Unit economics, as planned.**

- A finished 2-minute chapter costs $60–120 to generate. A 10-chapter pilot season costs $600–1,200.
- Narration costs about ₹160 an hour. Each additional language adds under ₹10 of voice per chapter.
- The benchmark is under $100 per finished minute (Kuku's target).
- Running the pilot season with people (art director, part-time Sanskrit scholar, proofreader, language reviewers, growth) costs ₹27–37 lakh. "The first hire is not an engineer."

**The longer arc** is an immersive track: in-app depth at month 6, a walkable set piece at month 12, and a venue build for temples and museums at month 18 (the first B2B revenue).

## The product

### The content unit

| Level | Definition | Example |
|---|---|---|
| Season | One story arc; slug id | `mbh-s1`, "Mahābhārata · Droṇa Parva — The thirteenth day", 10 chapters |
| Chapter | 90–120 s; id `s<season>e<chapter>` | `s1e3`, "The way in" (hi "भीतर का रास्ता"), 114 s |
| Beat | Five per chapter, contiguous from 0 to the end | `cold_open`, `verse`, `scene`, `reveal`, `question` |
| Shot | 0..n per beat, each a shot contract of 5–10 s | `s1e3-sh01` … `s1e3-sh13` |

The season's chapter order is fixed by decision. Chapter 3, "The way in", asks the question. Chapter 4, "The gatekeeper" (Jayadratha, 3.256 and 7.41–42), answers it. Chapter 5 is "Arjuna's vow" (7.50–51). The v0 chapter is the Chakravyūha episode (Droṇa Parva, day 13) "until the pilot arc is digitised".

### The five beats, with s1e3 timings

The plan first ordered the chapter as book page, scene, detail, lineage, cliffhanger. The product review found the first scene landing at 30–40 s and the steepest drop-off (100→82%) on the book page. The decision of 3 Oct put the cold open first. These timings are from `content/s1e3/beats.json`:

| # | Beat | Target length | s1e3 | What happens |
|---|---|---|---|---|
| 1 | Cold open | 5–8 s | 0–8 s, 1 shot | One witness shot, high and wide with a slow push, and one narrated line. The spoken AI disclosure plays over the first 2 s |
| 2 | The verse | 12–18 s | 8–26 s, no video | The śloka (`mbh.7.34.19`) is chanted and lit line by line on a palm leaf, in Devanagari with IAST and a translation |
| 3 | Witness scene | 40–60 s | 26–84 s, 9 shots | The event from the witness's vantage; narration motivates the cuts |
| 4 | Hidden detail | 15–20 s | 84–102 s, 2 macro shots | Macro on carved detail; opens the three-layer reveal (`who-taught-him`) |
| 5 | The question | 10–16 s | 102–114 s, 1 shot + 2 s hold | The question the next chapter answers; whoever closes the gap is kept in shadow and unnamed |

"People" (the lineage explorer) is not a timed beat. It is available at any moment from the scene.

### The witness point of view

The viewer never stands inside a revered figure. Each chapter names its witness, and the camera keeps that witness's vantage (`design/style-bible.md` §6).

| Witness | Vantage | What it means for the camera |
|---|---|---|
| Sañjaya, given divine sight | Far away at Hastināpura | Elevated and distant; never closer than medium-wide on any person |
| A charioteer | On the chariot platform | Eye level beside the warrior, never at his face |
| A vānara on Mahendra | On the mountain | Low angle, wide sky, the leap seen from below |
| Suratha and Samādhi, hearing Medhas | The sage's hermitage (Devī season) | Frame narrative; episodes shown as relief panels |

Code enforces this. The schema's witness allowlist is `sanjaya | vanara | charioteer`, and adding a witness is a decision. A `REVERED` list in `src/contract/rules.mjs` (19 names, including Vāyu and Samudra, added 4 Oct) "may be extended, never shortened, without a scholar's note". Every shot contract must forbid `deity_face_closeup` and `pov_inside_deity`. The Maināka witness is "a vānara on Mahendra, never Hanumān".

### The reveal's three layers

One tap pauses the scene and opens a palm-leaf sheet. The sheet always shows three layers in this order:

1. **"What many heard"**: the popular telling. Its source is a telling, never a canon claim, and it is never called "myth" or "wrong".
2. **"What the text says"**: what the critical edition gives, "with no judgement on the belief". Say "the critical edition", never "Vyāsa's text".
3. **"From our collection"**: the founder's books and lineage material, shown in its real state (`proofing`, `ready` or hidden when `none`).

The flagship reveal for s1e3 is "Who taught him?":

- **Popular layer:** Abhimanyu learned the way into the formation in his mother's womb.
- **Text layer:** Abhimanyu himself says his father taught him to break in but that he cannot get out (7.34.19). Elsewhere he learns arms from Arjuna as a boy (1.213.65).
- **Collection layer:** `none`.

The reveal behaves the same way everywhere:

- The narrator says "the text says otherwise" and the leaf pulses.
- Reveals can be kept like quotes in the Library.
- Sharing sends the reveal, not a trailer, as `dheevara.app/s1e3/who-taught-him?ref=…`.

### Star passages

The critical edition prints some passages only in its notes (the apparatus), not in the constituted text. GRETIL prints them inline, so "a careless parser would put it into the canon". `src/ingest/gretil.mjs` keeps them apart in `content/canon/mbh/variants.json`, and they can never be claims, because the claim-id grammar has no syntax for them.

The one held so far is `mbh.7.34.18*259`, from Kashmiri manuscripts K1–2. In it Abhimanyu says he heard, while in the womb, how to enter the formation. The scholar review and the handoff had both said the womb story was absent. It is in the apparatus. That turns the flagship reveal from "the text doesn't say it" into "the critical edition's text does not tell it; some manuscripts do (*259)". This is a better product story, and its wording awaits a scholar.

### Release rules and membership

These rules come from the decision of 3 Oct and `Entitlements.kt` in the app:

- Nothing plays before its release.
- **Chapter 1 of every season is free.**
- Members get every released chapter. There are no coins and no per-chapter purchases ("this audience is paying for trust, not for a slot machine").
- The pilot launches with chapters banked. The product review asked for at least five, with binge for members.
- New chapters land at **7 pm in the viewer's own time zone**. "7 pm in Chennai and 7 pm in Toronto are different instants on purpose."
- Autoplay to the next chapter can always be stopped and turned off.
- "Carry" means starting the next chapter within 24 h of it becoming available.
- Prices are **$4.99/month or $39/year** for the diaspora and **₹149/month or ₹999/year** in India, plus a gift season and up to five family profiles.

### Languages

| Stage | Languages |
|---|---|
| Plan, at pilot | English, Hindi, Tamil, Telugu, Kannada |
| Plan, by end of season one | All 11 Bulbul languages: bn, en, gu, hi, kn, ml, mr, od, pa, ta, te |
| Verses | Always Sanskrit, chanted |
| Ingestion | Speech-to-text from 23 languages, including Sanskrit |
| Built | Narration in en-IN and hi-IN for s1e3 only |
| App | Bundles fonts for Latin, Sanskrit and 9 Indic scripts |

Narration language and caption language are separate settings, so "a Tamil-speaking grandmother and an English-reading child share one profile". The research proposes a different pilot set (see Market).

### Surfaces

- **The app.** Kotlin Multiplatform for Android and iOS, phone-first, 9:16. It is the main surface but comes last in the channel order.
- **Web experiences.** Self-contained interactive HTML chapters over the same canon and claim ids: `web/chakravyuha.html`, `web/mainaka.html` and `web/lineage.html`. The standard: correct at 390×844 and 1440×900, sound only after a tap, mute always visible, reduced motion honoured, captions mirrored to aria-live, keyboard-operable, and every claim shown with its source line.
- **Shared clips.** Shorts, Reels, WhatsApp cards and the reveal card. These come first in the channel order because they are free and test the format.
- **Studio.** Internal web tools at 1440×900: a shots board and a retention view.

### AI disclosure

India's IT (Intermediary Guidelines) Amendment Rules 2026 (G.S.R. 120(E)) have been in force since 20 Feb 2026. The decision of 4 Oct and style bible §13 commit to:

- A visible AI label on every scene, burned into every exported cut.
- A spoken disclosure of about 2 s, in the narration language, before AI narration and before the chant. It is built for s1e3: "This narration is AI-generated." / "यह वर्णन एआई द्वारा बनाया गया है।"
- C2PA provenance on every asset. Not built; it belongs to the M4 assembler.
- `provenance.aiLabel: const true` in the manifest schema.
- Takedown within 3 hours of a lawful order.
- If Dheevara counts as an OTT publisher: an age rating, content descriptors and a grievance officer.
- A lawyer review before anything is public.

The player can also make the label continuous, which a 30 Mar 2026 draft rule would require.

## The nine rules and why each exists

These rules are in `CLAUDE.md`, and each is "enforced in code with a test".

| # | Rule | Why it exists |
|---|---|---|
| 1 | **Witness, never the deity.** No shot puts the viewer inside a revered figure; no deity face close-up. | Devotional respect. AI faces of deities are where the backlash lands (an FIR over an AI deity video in June 2026, the SGPC protest over AI Gurus). It is also the product's own idea of witnessing. |
| 2 | **No claim without a citation.** Every caption, narration line and hidden detail carries a claim id resolving to book, chapter and verse. | Citation is the moat and the answer to "is this true?". It also answers Apple guideline 1.1.5 on religious quotation. |
| 3 | **Ledger before spend.** The shot row is written before any provider request. | Every asset needs a provable model, seed, licence, territory and cost, and spend must never be invisible. |
| 4 | **Territory.** H3 output is India-only; a worldwide contract routed to it throws. | The MiniMax H3 licence restricts territory. Research extended this from self-hosted to hosted H3 too. |
| 5 | **No training on our texts.** Unreleased passages never go to an API whose terms allow training on inputs. | The digitised collection is the head start, and leaking it into a model gives it away. |
| 6 | **Draft first.** 480p drafts, edit lock, then finals only for surviving shots; a human approves each final. | Video is the expensive line, and finals are where money is wasted. |
| 7 | **Sanskrit is chanted, not read.** Ślokas go through Vāgdhenu or a human reciter, never a general TTS voice. | "A flat read of a śloka is the tell." |
| 8 | **Secrets only from the environment.** Nothing committed holds a key. | Keys were already pasted in chat once. Gitleaks runs on pre-commit and in CI. |
| 9 | **Scholar sign-off before anything is public**, stored as a record. | The scholar review caught a composed, non-canonical verse in the mockups. Trust is the product. |

The surface keeps five further rules, printed on the mockups:

- The witness is named on every scene.
- Captions carry a verse id.
- The AI label never leaves a scene.
- "Screen off still works."
- "No slot machine."

## Product language

| Term | Meaning |
|---|---|
| Chapter | One 90–120 s episode. Never "episode" in the UI |
| Season | One story arc; its chapter 1 is free |
| Part | A beat, as users hear it ("Part 2 of 5" on the lock screen and to screen readers) |
| Cold open | Part 1: one witness shot and one line |
| The verse / the leaf | Part 2: the chanted śloka on a palm-leaf surface |
| Witness scene | Part 3 |
| Witness | The named vantage of a chapter (Sañjaya, a vānara, a charioteer) |
| Hidden detail / reveal | Part 4 and its three-layer sheet |
| The question | Part 5: the cliffhanger the next chapter answers |
| What many heard / what the text says / from our collection | The three reveal layers |
| Popular telling | Layer 1; never "myth" or "wrong" |
| Collection | The founder's books and lineage material |
| Edition | The text a season follows, named before play ("the edition is the product") |
| Claim | One registered, citable statement with an id such as `mbh.7.34.19` |
| Cite | The amber verse id under a caption |
| Star passage | A passage printed only in the critical apparatus (e.g. `*259`); never a claim |
| The page | Where any citation opens: the source page, highlighted (IIIF once scans exist; for now it says "no scan yet") |
| People | The lineage view: who, before, now, after, with every edge citing its passage |
| Leaf / leaf card | The palm-leaf glyph with two binding holes: citation icon, reveal surface and share card |
| Kept reveals | Reveals saved like quotes in Library |
| Tell our scholar | The report flow; "Another telling" comes first, because "a family's version is a contribution, not an error" |
| The reply | A scholar's signed answer, which places a family telling and never corrects it |
| Membership / member | Never "subscription" |
| Not out yet | Countdown to 7 pm local, with "Remind me" |
| Up next / Stop autoplay | End-of-chapter states |
| Festival drop | A themed season, e.g. "Nine nights of the Devī" |
| Gift a season | Gifting; "No payment details needed" |
| Studio | The internal shots and retention tools |
| Shot contract | The JSON spec for one shot: framing, blocking, references, claims, forbidden list, territory |
| Ledger | The append-only cost and provenance log (`content/<chapter>/ledger.jsonl`) |
| Manifest | The single file the app plays from (`content/<chapter>/manifest.json`) |

## Product design

### Design system ("product language v2")

The design system was adopted 3 Oct after v1 (`design/mockups/v1.html`, 18 screens, gold-and-parchment, Figtree and serif titles) failed review for collisions, contrast and fonts, and the founder asked for "much sleeker, cleaner". The tokens live in `design/mockups/index.html` and are mirrored in the app's `Colors.kt`.

**Colour.**

- Near-black surfaces (`#0B0B0A` → `#272521`) with off-white text (`#F4F2EE`, also the primary button) and two greys.
- **Amber `#F2B04A` means source and nothing else**: citations, verse ids, the leaf icon.
- **Sindoor `#F0694A` means "now"**: what is live, or an opponent.
- The verse and reveal sit on leaf colours (`#EFE6D2`, ink `#1E160C`).
- "Everything else is greyscale."

**Type.**

- Geist for all interface text (32/22/17/15/12.5).
- Tiro Devanagari Sanskrit for verse only.
- Noto Sans for nine Indic scripts.
- Indic rules: no letter-spacing or uppercase, line height at least 1.45, size at least 13, and the daṇḍa stays with its word.

**Motion.** Every transition has a duration:

| Transition | Duration |
|---|---|
| Cold open → verse | 700 ms |
| Verse → scene | 900 ms |
| Scene → reveal (pauses and dims) | 450 ms |
| Reveal → people | 500 ms |
| Reduced motion (opacity only) | 200 ms |

The easing curve is `cubic-bezier(.2,.7,.2,1)`. "No page curls."

**Accessibility floor.**

- 44 pt targets and 4.5:1 text contrast.
- Language tags on every Indic name.
- Reduce motion follows the OS.
- Autoplay is off under a screen reader and counts down 10 s in words, with Stop.
- An exit is always top-left, and every gesture has a button.
- Captions are a real caption track.

Fonts are vendored (`design/fonts/`; about 4.6 MB of TTFs in the app). Headless renders had shown Telugu unshaped and Geist spacing broken.

### Video style bible

`design/style-bible.md` was drafted 4 Oct and becomes binding once the founder confirms the look.

**The look:** "A temple relief that has come alive under one oil lamp."

- Carved stone figures in deep shadow; the lamp is the only warm light.
- "Gold appears only where a claim lives, sindoor only where there is danger."
- It reads as darśan, not cartoon.
- One material hides AI face and costume drift, and raking light gives video models depth.
- The stone changes by epic: dark basalt for the Mahābhārata (Ellora, Halebidu, whose friezes include the chakravyūha), warm granite for the Rāmāyaṇa (Hampi), red sandstone for the Devī Māhātmya.

Two looks were rejected:

- Amar Chitra Katha: a living trade dress, prone to AI line-boil, and it reads "for kids".
- Painted miniature: flat, and it blurs into generic painterly. It is kept for still leaf and share cards only.

**Light.**

- One key light at 2,200–2,700 K, raking at 20–40°.
- No god rays, flares or bloom on faces.
- Flicker of ±3%, never a pulse.
- Time of day follows the text: day 13 runs from the dawn array to sunset, and the last shot of s1e3 is sunset.
- No saturated blues, purples or greens.

**Camera grammar.**

- Each beat has its own framing.
- Lenses: 24–35 mm wide, 50 mm medium, macro for details.
- Never fisheye, drone swoops or handheld shake (except at most 0.5 s at a breach).
- A push is 5–10% of the frame over a whole shot.

**Faces and violence.**

- "Weight and gesture, not facial acting"; no lip-sync.
- **Medium-wide is the closest framing for any human principal.** The schema enforces this when a character reference is present.
- No deity face close-up, ever. Deities appear full figure, at a distance, or through an attribute.
- Death and violence by suggestion only: "a fallen bow, a wheel lying still, a lamp going out".
- A never-list bans anachronisms: plate armour, stirrups, firearms, glass windows, printed text, zips and the like.

**Sound.**

- A tanpura drone in the narration key and pakhawaj or mṛdaṅga, with silence before a reveal.
- No trailer music or "braams".
- Loudness at −16 LUFS.

**Captions** are set in Geist 600 on an 80% night band, at most 2 lines, with the verse id in amber.

### The 35 screens

The screens are in `design/mockups/index.html`, with renders in `design/mockups/shots/` at 390×844 and 360×740. Screens 1–21 were drawn 3 Oct, and 22–35 were added 4 Oct after the reviews.

| Group | Screens |
|---|---|
| First run | 01 Splash · 02 Language · 03 Start (first scene two taps from install, no account) · 04 Link landing on the web ("Kavya sent you this") · 22 Sign in (only after the store confirms a trial) |
| Browsing | 05 Home (resume is the whole first screen) · 06 Season · 33 Search (cross-script: abhimanyu / अभिमन्यु / அபிமன்யு) · 34 Explore (by epic, person, place, source) |
| The chapter | 07 Cold open · 08 The verse · 09 Witness scene · 10 Hidden detail · 11 The page · 12 People · 13 Controls · 14 The question · 15 Screen off |
| States | 23 Not out yet · 24 Offline · 25 Playback error (falls back to audio) · 26 Empty library |
| Membership and gifts | 16 Membership · 31 Festival drop (Navarātri, "Nine nights of the Devī") · 32 Receiving a gift · 35 Manage membership |
| Library, profile, family | 17 Library · 18 You · 29 Profiles · 30 Children's home (curated, no purchase prompts, PIN gate) |
| Trust loop | 19 Share (the reveal card) · 27 Tell our scholar · 28 The reply |
| Studio (1440×900) | 20 Shots board (final render disabled until a person presses it) · 21 Retention (curve over the five beats, tied to shot ids) |

A clickable s1e3 prototype (`design/prototype/chapter.html`) runs cold open → verse → scene → reveal → question with the motion spec, pausing sheets and stoppable autoplay.

### The five reviews and what they caught

The files are in `design/mockups/reviews/`. Four reviewers read screens 1–18 on 3 Oct; one read screens 22–35 on 4 Oct.

| Review | Verdict | What it caught | What changed |
|---|---|---|---|
| Art director | "Direction is right… not signed off" | Wrong fonts in headless renders; AI pill over the beat bar; lineage edges crossing labels; no motion spec; chant highlight read as strikethrough; reveal sheet hid the scene; autoplay pressure on s11 | Fonts vendored; motion spec adopted; karaoke ink; sheet capped at 72%; one leaf icon; temple relief chosen |
| Scholar | "Not cleared" | **The s09 verse was composed Sanskrit, not critical-edition text**; "did not learn in the womb" denied a belief; "seven rings" and "sixteen" are not in the CE; "a wheel no Pāṇḍava can break" is wrong (7.34.15 names four); fake "Proofed · double-keyed" chips and a fake sign-off; Telugu garbled | Genuine 7.34.17–21; reveal reworded; chapter renamed "The way in"; "critical edition", never "Vyāsa's text" |
| Product | "Trust layer ahead of the market… the journey that has to clear the gate is not designed" | First scene at 30–40 s; no link landing; conflicting free and paid rules; nothing marks the reveal; the studio couldn't act on a losing shot; 12 missing screens | Cold open first; s04; one release table; s22–s35 drawn |
| Accessibility | "Not shippable as drawn" | 5 s auto-advance with no pause (WCAG 2.2.1); no exit on two screens; gesture-only page turn; collisions at 360; leaf contrast failures (as low as 1.18:1); Indic letter-spacing; Telugu unshaped | Stop and a 10 s countdown in words; Next buttons; flex layouts; app `ContrastTest` and `TypographyTest` encode the fixes |
| Edges and family | "Close, not cleared" | s31 clipped at 360; no witness rule for the Devī season; Saptaśatī is mantra (needs a human reciter); "Every language" overclaims; the report sheet framed a family telling as an error; sign-in before the store sheet; no parental gate or Restore | All majors applied (commit `ae86ff3`) |

## Market

The sources are `docs/research/product/{competitors,audience-gtm,synthesis}.md`, desk research dated 4 Oct 2026. Many pages were blocked at the time, so the files mark some facts as unverified, and those flags carry over here.

### Audience

- **Beachhead:** diaspora families in the US, UK, UAE and Canada. Median Indian-American household income is $151,200.
- **US home speakers:** Hindi about 1.06M, Telugu about 606k, Gujarati about 492k, Tamil 341–360k, Kannada about 49k (unverified).
- **UK:** Gujarati 189k speakers; British Hindus are about 70% Gujarati.
- **UAE:** 4.36M Indians, about 35% from Kerala.
- **Ready-made networks:** Chinmaya Bala Vihar (18,000+ children, 30-week syllabus), BAPS (116 North American mandirs), HSS (267 shakhas) and ISKCON.
- **Channel order:**
  1. Shorts, Reels and WhatsApp
  2. Temples, satsangs and children's programmes (the *Mahavatar Narsimha* playbook)
  3. Licensing seasons to other platforms
  4. The app.
- **Calendar:** festivals set the release calendar, and each drop is announced 3 weeks ahead.

### Competitors

| Who | What matters |
|---|---|
| **Mythik / Mythik+** (Mumbai, founded Apr 2025) | $15M seed, then $5M at over $50M valuation (May 2026); 10–12 min episodes in English and Hindi; iOS since 6 Aug 2026; ₹3,499/yr. Hires Sanskrit research fellows under Oxford and Harvard professors, so it is "scholar-advised". **No on-screen citation found.** About a year ahead. |
| **Pocket FM** | $500M run rate, about 70% US; AI makes 93% of the catalogue. Coin pricing draws "$1,000+ to finish a story" complaints (Trustpilot 2.5). Shut Pocket TV in Jun 2026. |
| **Kuku** | Targets under $100 per finished minute with a large AI unit. Bhakti content was promoted next to an erotic app (backlash). ₹1–2 trials roll into ₹399–699 autopay. |
| **JioHotstar "Mahabharat: Ek Dharmayudh"** (Galleri5 / Collective Artists, with Star) | 100 AI episodes from 25 Oct 2025; 6.5M views on day one, 26.5M since; IMDb 1.4. Criticised for lip-sync, stiff faces and a modern bedside table. This is the bar the style bible is written against. |
| **Sri Mandir** | 40M downloads; diaspora about 20% of revenue at about 10× Indian ARPU. A partner, not a rival. |
| **Amar Chitra Katha** | ₹999–3,999 plans; an immersive push. The look must stay away from ACK's. |
| Kids' apps (Gurukula, Lipi Epics and others) | Use the śloka card already; none cite. |

### Pricing

| Market | Current plan | Proposed tests |
|---|---|---|
| Diaspora | $4.99/mo, $39/yr (7-day trial), gift season | Keep $39 (≈ Hoichoi); add a $49 family plan and quarterly plans |
| India | ₹149/mo, ₹999/yr | ₹1,499 and ₹1,999/yr; ₹99 against ₹149/mo (Spotify India is ₹139) |

The plan's line, "No coins, no trick trials", doubles as the marketing message against Pocket FM and Kuku.

### Timing

- *Ramayana: Rise of a Legend* Part 1 opens worldwide on **6 Nov 2026**, three weeks from today.
- Part 2 opens at Diwali 2027 (29 Oct), and *Mahavatar Parshuram* lands in Dec 2027.
- Navarātri 2026 (11–19 Oct) is under way now. The research judged it "too close for a drop", and the s31 festival-drop mockup was not built.
- The mockups said "Chapter 3 airs on 13 Oct". That date has passed, and nothing aired.

### India AI-label rules

The 2026 amendment rules are in force (see AI disclosure). Backlash also happens outside the rules: the SGPC protested an AI video of the Sikh Gurus, and police filed an FIR over an AI deity video in June 2026. That is why the research proposes Punjabi last, with no depiction of the Gurus.

### The five open proposals

These were recorded 4 Oct as "Proposed, for Avi". **None is adopted until the founder says so.**

1. **Make the pilot arc the Rāmāyaṇa's Sundara Kāṇḍa, timed to the film.** Ship free pieces 4–8 Nov 2026: the Maināka experience, 2–3 Shorts, one audio chapter and WhatsApp cards. s1e3 stays the pipeline test.
2. **Reorder the pilot languages** to English, Hindi, Telugu, Gujarati and Tamil. Kannada and Malayalam move to the first wave, Bengali comes with a Devī arc, and Punjabi comes last.
3. **Run the price tests** in the table above.
4. **Rewrite "authority".** Mythik is scholar-advised too, so the claim becomes "visible per-line citation, scanned page one tap away, reply from a named scholar".
5. **Use these launch windows:**
   - free pieces for the film (4–8 Nov 2026)
   - the retention gate (12 Jan 2027)
   - **paid launch at the spring festivals**: Ugadi 7 Apr, Rāma Navamī 15 Apr, Hanumān Jayantī 20 Apr 2027, with a temple and Bala Vihar kit
   - the Devī season from Navarātri to Diwali 2027.

## Artifacts

| Artifact | Where | What it is | Current? |
|---|---|---|---|
| Product language v2 | https://claude.ai/artifact/JpYzuuAD5oDfbmzzdcGPY4 · `design/mockups/index.html` | All 35 screens and the design tokens | Current for design. Some copy predates the star-passage finding (it says the womb story "isn't in it") |
| Chapter prototype | https://claude.ai/artifact/BJ3sGDARRf8QSSZrkcHN8q · `design/prototype/chapter.html` | Clickable s1e3 with the motion spec | Current for interaction; content is placeholder |
| Chakravyūha | https://claude.ai/artifact/16qHAubWf2dXmMStqkM6vJ | Reference JS experience | **Stale**: the published version has the pre-review text. The corrected, cited version is `web/chakravyuha.html` on `origin/claude/m6-web` and has not been republished |
| s1e3 narration | https://claude.ai/artifact/52v4B7Rt73oVftrKcwdZJF (private) | Bulbul v3 en and hi, casting samples, STT match scores | Current; draft, internal |
| Lineage explorer | https://claude.ai/artifact/VwPmAnnmWzyyaw9gPiRd9M (private) · `web/lineage.html` | People and cited edges from the canon export | Current; not signed off |
| Maināka | https://claude.ai/artifact/V6G58jzZXNqGgrx7J73dZ3 (private) · `web/mainaka.html` | Sundarakāṇḍa 1 as a JS experience, witness a vānara | Current; not signed off |
| Build Brief | https://claude.ai/code/artifact/653d1aff-1744-4c5f-84ae-97ba0c88fe6b · `docs/build-brief.md` (summary) | Mission test, rules, routing, milestones | Current, except that hosted H3 routing is reversed by research |
| Drive index | https://docs.google.com/document/d/1wDhWaCbXK7gdhiXrmbZuQMm323LT1xBb6WiYCTi6TwQ | Index of the "Dheevara — Build Output" folder | Current as of 4 Oct |
| Founder's plan | `docs/product-plan.md` | Text extract of the "Final Plan" docx | Current as intent; several facts corrected by research. It cites `docs/tickets.csv`, which does not exist on any branch |
| Decisions | `docs/decisions.md` | 44 dated decisions on the pipeline tip, plus 11 more on the app branches | Current |
| Handoffs | `docs/handoff/{pipeline,app}-session.md` | Briefs for the build sessions | Superseded in detail (they say 116 s and 12 shots; the real plan is 114 s and 13 shots) |
| Style bible | `design/style-bible.md` | Video look, camera, figures, never-list, QC checklist, sound | Draft; binding when the look is confirmed |
| Reviews | `design/mockups/reviews/*.md` | The five reviews | Historical record; fixes applied |
| Provider research | `docs/research/{fal,sarvam,jev,vagdhenu,sources}.md` | Every fact with a URL and a date (4 Oct) | Current as of 4 Oct |
| Canon check | `docs/research/canon-check-s1e3.md` | The s1e3 claims checked against the e-text, including the star-passage finding | Current |
| Market research | `docs/research/product/{competitors,audience-gtm,synthesis}.md` | Competitors, audience, calendar, the five proposals | Current as of 4 Oct; partly unverified |
| s1e3 plan | `content/s1e3/{beats.json,shots/,narration.json,manifest.json,ledger.jsonl}` | Beat map, 13 shot contracts, narration, manifest, 238-row ledger | Current |
| Canon | `content/canon/` | Sources, verse index, 99 passages, 1 star passage, 43 claims, 23 people, export | Current; all claims unproofed (`etext`) |

## What we tried and tested

Every session ran on 3–4 Oct 2026. Recorded provider spend is **$0.1658**, all on Sarvam, in six runs between 08:23 and 08:28 UTC on 4 Oct.

**Design and product** (`sweet-mendel-m0uwou`, 3–4 Oct)

- *What happened:* the founder's plan was turned into a Build Brief and nine rules. v1 mockups (18 screens) went through four reviews and failed all four. They were redrawn as v2 (21 screens), extended to 35 after a fifth review, and a clickable prototype and the style bible were added. The session also ran desk research on market and audience.
- *What worked:* the reviews earned their keep. The scholar found **a composed Sanskrit verse in the mockups presented as the critical edition**, plus fake proofing chips and a fake sign-off date. This is the strongest argument for rule 9. The product review found the opening order losing viewers before the first scene, which changed the chapter grammar.
- *What failed or was corrected:* headless renders silently swapped fonts and showed Telugu unshaped, so the fonts are now vendored. "The seventh ring" became "The way in".

**M0: repo boots** (`m0-repo-boots`, `m0-check-green`)

- *What happened:* built environment-only secrets, the shot-contract schema with a strict validator, a pinned and checksum-verified gitleaks pre-commit hook, and CI that runs lint, tests, contract validation and secret scanning.
- *Tests:* 20 at the partial milestone. A planted fake key correctly blocks a commit.
- *What was corrected:* `.env.example` was being ignored by git.

**M0.5: provider research** (`m0-5-research`)

- *What happened:* five research files, each fact with a URL and a date.
- *What changed the plan:*
  - The MiniMax H3 licence (2 Aug 2026) binds hosted use too, so **hosted H3 is India-only**. There is no reference-locked character model for the diaspora market. This reverses the plan.
  - Kling v3 has no seed and no 480p tier, so Wan 3.0 at 480p is the draft lane.
  - The plan's LoRA trainer is deprecated.
  - Exa costs $4 per 1k searches, not $2.50.
  - Sarvam's terms contradict each other, so it is treated as possibly training on inputs.
  - Jev was proposed for citation checks but not wired in.

**M5: canon v0** (`m5-canon`)

- *What happened:* a GRETIL parser pinned by sha256, an IAST→Devanagari converter checked against Smith's Devanagari, claim registration and resolution, and CI failing on any unresolved id. Only cited verses are committed, for rights reasons.
- *What worked:* the canon caught errors in the founder's handoff and the scholar review. Droṇa's vow is 7.32.12, not c. 13. "One against six… not dharma" is 7.48.21, not c. 22. *Śiśu* is at 7.48.32. The womb story is star passage *259, which the scholar had missed by not checking the apparatus.
- *What's open:* GRETIL and Smith differ on 83 lines in Book 7. None of them is cited.

**M1: voice** (`m1-voice`)

- *What happened:* Bulbul v3 narration with limits checked before spend, refusal of any line containing a verse (rule 7), caching on every input including the pronunciation dictionary, and a ledger row before each request. Output is 13 lines plus the disclosure, in two languages: 28 WAVs.
- *What worked:* a speech-to-text round trip (`pnpm voice:check`) caught three real faults: a Hindi negation that wasn't heard, "cakravyūha" mispronounced, and "breach" heard as "bridge" (now "gap"). Spend: $0.142 voice plus $0.024 STT.
- *What failed:* one dictionary update returned 405 because the API wants `PUT ?dict_id=`. The chant does not exist: `src/voice/chant.mjs` throws until a Vāgdhenu server is running on a CUDA box.

**P: plan s1e3** (`p-plan-s1e3`)

- *What happened:* beat map, 13 shot contracts and a generated manifest timed from the real audio. The handoff estimated 12 shots, and the beat lengths needed 13.
- *Schema change:* `medium_wide` was added, and anything closer fails when a character is in frame.
- *Tests:* the beats tile 114 s, every line is placed once, each line's claims are depicted by its beat's shots, and the committed manifest equals a rebuild.

**M2: compiler** (`m2-compiler`)

- *What happened:* a model registry, a router enforcing territory, a deterministic prompt compiler with a golden payload, submit guards (approval file, spend cap, ledger intent, idempotency) and a cost report. The s1e3 draft is estimated at **$5.92** against the $15 cap.
- *What's missing:* **no render has been attempted**, because there is no FAL_KEY. There is also no asset bible, so references like `obj.chariot` resolve nowhere, and no trained style LoRA.

**M6: web track** (`m6-web`)

- *What happened:* one shared reveal-sheet module, a build step that fails on unresolved ids, a drift test, and Playwright checks at 390 and 1440 (not in CI, since it needs Chromium). The Rāmāyaṇa was added to the canon (47 Sundarakāṇḍa verses).
- *Experiences:* Chakravyūha was corrected and cited, and Maināka and the lineage explorer are new. A vibration call before a user gesture was causing console errors; it now waits for a gesture.

**App A0–A2** (`app-a0-gradle` → `app-a2-ui`)

- *What happened:* a Kotlin Multiplatform skeleton:
  - manifest models and a validator
  - a pure chapter-timeline state machine
  - entitlements, with release at 7 pm local
  - deep links
  - the design-system components, with fonts bundled.
- *Tests:* 88 (64 core, 24 UI, including contrast, typography and screenshot tests at two sizes). Core coverage is 97% against a 90% gate.
- *What went wrong:* the app was built from the handoff's sketch before the schema existed. It proposed provisional manifest fields, and the pipeline did not adopt them (see below).

**Pipeline tests** number about 84 across the pipeline areas: canon, contract, env, manifest, plan, render, secrets, translit, voice and web. They were not re-run for this document because dependencies are not installed in this checkout.

## What is built and what is not

| Area | State | Notes |
|---|---|---|
| Plan, rules, brief, decisions | Built | `docs/`, `CLAUDE.md` |
| Mockups (35), prototype, style bible, reviews | Built | Look and 9:16 await confirmation |
| Repo, CI, secret hygiene (M0) | Built | |
| Provider research (M0.5) | Built | |
| Canon v0 (M5) | Built | 43 claims, 23 people, 99 verses. **All `etext`; none proofed or signed** |
| Narration (M1) | Partially built | en and hi for s1e3 only; 9 languages to go |
| Chant (M1) | **Blocked** | No GPU box, no Vāgdhenu permission, no human reciter. **Nothing has been chanted** |
| s1e3 plan and manifest (P) | Built | Media all `pending` |
| Render compiler and submit (M2) | Partially built | Code and tests exist. **Nothing has been rendered**; blocked on FAL_KEY |
| QC gate (M3) | **Not started** | `src/qc/` does not exist |
| Assembly, burned captions, C2PA (M4) | **Not started** | `src/assemble/` does not exist; no `out/s1e3/draft.mp4`, no `pnpm chapter` script |
| Mission test | **Not passed** | Only the web-experience condition is met |
| Web experiences (M6) | Built | Three experiences; private drafts |
| Real canon from the founder's books (M7) | Not started | No scans, no IIIF, no Postgres, Neo4j or Weaviate; the canon is JSON in git |
| Asset bible (characters, places, objects) | Not started | Shot references dangle |
| App core and design system (A0–A2) | Built | 88 tests |
| App screens, chapter flow, screen-off audio, billing (A3–A6), iOS project | Not started | RevenueCat planned |
| App ↔ pipeline manifest | **Broken** | See below |
| Telemetry and retention loop | Not started | No schema, though the bet depends on it |
| Scholar sign-off, rights, lawyer review | **Blocked** | No scholar appointed; no BORI permission |
| Merge to `main` | **Not done** | Nothing is merged; all branches are stacked PRs or open lines |

**The app–pipeline manifest mismatch.** The app branch has never met the pipeline branch. When they merge, the real `content/s1e3/manifest.json` will fail to load:

- **People edges.** The app requires a field `kind` on each people edge, while the pipeline writes `rel`. The manifest loads as `Malformed` and refuses to play.
- **Verse ranges.** The app's claim model has no `verseEnd`, so a 17–21 range prints as `7.34.17`.
- **Popular source.** The app reads `popular.source` as a language map, while the schema makes it `{label, url, retrieved}`, so a wrong value shows silently.
- **Claim status.** The app drops `status`, so it cannot show or gate on proofing.
- **Fixture drift.** The app's fixture still says 116 s, against the real 114 s.
- **Rule 1 at render time.** The manifest carries no revered or witness flags, so the app cannot enforce rule 1 itself.
- **Release dates.** No release date exists anywhere in content, so the app's `Release(date, 19:00)` has no data source.

The fix is a schema decision plus about a day of work on both sides. The app's decision #50 asked the pipeline to "adopt these or say what differs", and that question was never answered.

## Open decisions and who they wait on

**The founder decides:**

1. **The pilot arc.** Mahābhārata Droṇa Parva (as built) or Rāmāyaṇa Sundara Kāṇḍa timed to 6 Nov (proposal 1). If the film window matters, this is the decision with the shortest clock: the free pieces would ship 4–8 Nov.
2. **Pilot languages.** The plan's en/hi/ta/te/kn, or the research's en/hi/te/gu/ta.
3. **Prices, the authority claim, and the launch windows** (proposals 3–5).
4. **The look** (temple relief), the cold-open-first order, 9:16, and the narrator casts. All are drafted and await confirmation.
5. **The app id** `app.dheevara`, before the first store upload.
6. **Whether to route Jev** for citation checks.
7. **Funding for spend.** A fal key and budget, and a GPU box (E2E or IndiaAI) for the chant.
8. **Audio-first or video-first.** Still open in the plan. With the video path blocked and narration already working, audio-first is the cheaper path to the 12 Jan retention gate.

**Waiting on people we do not have yet:**

- **A Sanskrit scholar.** Rule 9 blocks anything public without one. Every claim is unproofed, the *259 wording waits on them, and the Devī season needs one for the edition.
- **A native Hindi reviewer**, to sign off on the narration.
- **A lawyer**, on the AI-label rules, OTT status, and rights.
- **A lineage partner** (maṭha, trust or sampradāya), for the collection layer.

**Waiting on outside parties:**

- **BORI:** written permission before the app can ship verse text. The 1958 Droṇaparvan may be in copyright in India until 2028.
- **Rāmāyaṇa e-text rights:** there is no licence yet.
- **The Vāgdhenu author** (Prof. Prathosh A. P., IISc): permission to use the chant model, or else a human reciter.
- **fal or MiniMax:** a written answer on H3 territory.

**Housekeeping, which any engineer can do once asked:**

- Rotate the Sarvam, Exa and Jev keys that were pasted in chat.
- Opt out of training in the Sarvam dashboard.
- Settle the manifest schema between the app and the pipeline.
- Re-publish the corrected Chakravyūha artifact.
- Merge the stacked branches to `main`.

**Spend so far is 17 cents, and the s1e3 draft is estimated at under $6.** Money is not the bottleneck. A fal key, a GPU box, a scholar and the pilot-arc decision are what stand between the current repo and a first watchable chapter.
