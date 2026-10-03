# Dheevara — Final Plan
Oct 3, 2026 · @Avi Solanki
Phone-first, premium short-form audio and video for Indian mythology, history and culture. Serialised chapters, cinematic AI-generated scenes, every claim cited to its source, in eleven Indian languages. Video and interactive JS chapters ship in parallel over the same canon.
## Decided, in order
Everything below came out of two weeks of work, in this sequence. Later items override earlier ones.
- The idea. A Pocket FM-shaped platform for Indian mythology, history and culture, in audio and short video, built on sources most people cannot reach.
- Phone-first, not a web app. Decided early and unchanged.
- Witness, not embodiment. The viewer stands beside the event as a vānara or as Sañjaya, rather than playing a deity. This replaced the original first-person idea.
- The canon graph as the engine. Characters, places, lineages and events drive script, references and continuity.
- Quality over volume. The backlash to the AI Mahābhārata set the bar; stylised beats photoreal.
- Diaspora first. Highest willingness to pay, and the reason self-hosted H3 cannot be in the shipping path.
- Name. Pushpak became Dheevara.
- Opus directs, fal renders. Hosted models for anything that ships; self-hosted only for drafts.
- The JS track is a track, not a demo. Chakravyūha proved the chapter grammar before any video existed.
- Voice is two systems. Sarvam Bulbul for narration, Vāgdhenu for chanted ślokas, because a flat read of a śloka is the tell.
- Data is online. Acquisition is online-first; the shelf stops being the gate, and the moat moves to structure, retention and craft.
- Mythik exists. A funded competitor is a year ahead in AI mythology streaming, so we stop competing on being first and compete on form, sourcing and language.
- Every language Sarvam speaks. Not Sanskrit alone: narration in eleven languages through Bulbul, ingestion from 23 through speech-to-text, ślokas still chanted in Sanskrit.
- Claude Code builds it. A starter repo and a build brief set the rules, the order of work and where autonomy stops.
## What we are building
Dheevara is a phone app where a book page flips into a scene you witness. One chapter is 90 to 120 seconds; a season is one story arc.
The chapter grammar, fixed for every episode:
- Book page — the shloka in Devanagari, its transliteration, a translation, and the chant.
- Witness scene — the event, seen through someone standing in it: a vanara in Hanuman's army, Sanjaya with divya drishti, a charioteer.
- Hidden detail — one tap opens a palm-leaf page that sets the popular telling beside the source, and beside the detail only our books hold, each with its citation.
- Lineage explorer — any person, place or event in the scene opens its node: who, before, after, and the passage it comes from.
- Cliffhanger — the last shot asks the question the next chapter answers.
Four rules the product does not break:
- Witness, never the deity. The viewer stands beside the event, never inside a revered figure. This also keeps us clear of the depiction backlash that AI mythology has already drawn.
- Every claim cites its source. Three tiers on screen: popular telling, source text, our collection.
- Stylised, not photoreal. Faces are the weakest thing AI video makes and the easiest thing an audience rejects. Narration carries scenes; dialogue close-ups are rare.
- Audio-first economics. Every chapter works with the screen off. Video spends where retention is decided.
Launch languages are English, Hindi, Tamil, Telugu and Kannada at the pilot, and all eleven languages Sarvam's Bulbul speaks by the end of season one; ślokas stay in Sanskrit, chanted. We are not a microdrama volume play, not a ritual or puja app, not a lean-back streaming service, and not AR-first.
## Where the market stands
Generation is a commodity and the leaders change every quarter, so no model is a moat. Figures checked 20 September 2026.
[TABLE]
| Model | Longest take | Top res. | Price per second | Note for us |
| Wan 3.0 (Alibaba) | 30 s | 1080p | $0.05–0.20 | Leads text-to-video; API only, not open |
| Gemini Omni Flash 1.1 (Google) | 10 s, extends to 40 s | 4K | $0.03–0.30 | Leads image-to-video; check data-use terms |
| MiniMax H3 | 15 s | 2K | $0.08–0.13 | Reference-to-video with LoRA on fal |
| Kling 3.0 (Kuaishou) | 15 s, 6 shots | 1080p | ~$0.075–0.15 | Best multi-shot direction |
| Veo 3.1 (Google) | 8 s | 4K | ~$0.15–0.40 | Hero shots, priciest |
| LTX-2.5 (Lightricks) | multi-shot | 4K HDR | self-host | 22B open weights, our draft lane |
[/TABLE]
Open weights carry conditions. MiniMax H3's licence is free under $20M revenue but excludes the US, UK, EU and South Korea, outputs included, so self-hosted H3 cannot legally be shown to the diaspora. Hosted H3 through fal is unaffected, which is how we use it.
The competition is Indian, loud and early. Collective Artists' Galleri5 made the AI Mahabharat for JioHotstar: 6.5M views in its first week, and a backlash over anachronisms, stiff faces and weak lip-sync, with the top trailer comment rejecting a fully AI Mahabharat. Kuku is building a 1,000-person AI unit targeting under $100 a finished minute. Nobody is competing on sourced depth.
Someone is already building our pitch, funded. Mythik, founded April 2025 by Jason Kothari in Mumbai, makes 10 to 12 minute AI videos of Indian mythology, history and folklore. It raised $15M seed and a further $5M at a valuation above $50M in May 2026, backed among others by Shah Rukh Khan's family office and Sakal Media Group, and calls itself "Disney from the East". Released titles include Ram vs Ravan: The Final Duel, Shakuni's Story and The Women of Ramayana. They are a year ahead and far better capitalised, which kills any "first to do AI mythology" framing. What they do not appear to have is sourced provenance, the witness format, or a chapter length built for retention.
The counter-case for quality. Mahavatar Narsimha grossed ₹300–325 crore on a ₹20 crore budget, stylised rather than photoreal, carried by devotional communities instead of stars.
The audience. Indian microdramas were $300M in 2025 with 100M monthly users and 17M paying, projected at $4.5B by 2030. Devotional demand skews abroad: Sri Mandir has 40M+ downloads with about 20% of demand from the diaspora, and Pocket FM's US listeners averaged over 135 minutes a day. Pocket FM shut Pocket TV in June and kept audio at a ~$500M run rate, which is both a warning about video economics and the reason we start audio-first.
## The bet, and how we test it
Four claims hold the plan up. Each has a test we can run inside the first season and a number that kills it.
[TABLE]
| Claim | Test | Pass bar | Kill signal |
| Generation is a commodity; the canon is the moat | Ship the pilot arc; measure how much of the audience reaction cites the sourced detail (comments, replies, shares of the reveal) | Reveal taps on 40% of chapter views; the detail is the most-quoted thing in comments | Viewers skip the reveal and watch for spectacle alone |
| Fidelity beats volume in this genre | Run our pilot against a Mythik episode on the same story with 200 diaspora viewers | Completion and next-episode carry beat theirs; no anachronism or depiction complaint in the first 10k views | We lose on completion despite higher craft cost |
| The diaspora pays roughly 10x India's ARPU for devotional content | Two paid cohorts from day one: $4.99/month US, UK, UAE, Canada and ₹149/month India | Diaspora trial-to-paid above 8% and refund under 5% | Diaspora converts no better than India at 10x the price |
| Native-language chapters beat English-first | Release the same chapter in five languages; compare completion and carry by language cohort | Regional cohorts complete at or above English and share more | Viewers default to English and regional versions do not move retention |
[/TABLE]
The first thirty seconds carry all three. Every chapter is instrumented second by second, and the cold open, the reveal and the cliffhanger get the premium model and the extra retakes.
## Beating Mythik
Mythik is the competitor to beat, and they are ahead on every axis we cannot buy: $20M raised, a $50M+ valuation, 3.7M members, a claimed 1B+ views, 750+ creatives, apps live on both stores, and a merchandise shop. Their product is Mythik+, a family streaming app of 10–12 minute premium series, scriptures and mantras, with titles like Ram: The First Trial, Shiva & Sati, Rukmini: Krishna's Rebel Bride and Matsya: The First Avatar.
We do not beat that by making the same thing better. We beat it on four axes they have chosen against.
[TABLE]
| Axis | Mythik | Dheevara |
| Form | 10–12 minute premium series, lean-back viewing | 90–120 second chapters built around a hook, a sourced reveal and a cliffhanger, measured second by second |
| Authority | Retellings, no visible sourcing | Every claim cited to book, chapter and verse, with the scanned page one tap away and a scholar's name on it |
| Language | English-first, family streaming | Born multilingual: five languages at the pilot, all eleven Bulbul languages by the end of season one |
| Position | Disney from the East: a studio | A canon with a player on top: the thing other studios eventually license from |
[/TABLE]
Multilingual is the wedge, and Sarvam makes it nearly free. Bulbul v3 speaks Bengali, English, Gujarati, Hindi, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil and Telugu. Their speech-to-text covers 23, including Sanskrit, Assamese, Urdu, Nepali, Konkani, Kashmiri, Sindhi, Santali, Manipuri, Bodo, Maithili and Dogri, which matters for ingesting recorded kathā in regional tongues.
Because narration is a separate track from the visual, a chapter costs its render once and its voice eleven times at a few rupees each. A Telugu or Malayalam audience gets the sacred story in its own language with its own regional telling attached, not a dub of a Hindi script. No competitor at Mythik's scale can retrofit that cheaply, because their cost is in finished premium video, not in a reusable canon.
So the order of play: own one arc completely, in five languages and then eleven, before they finish their next series, publish the sourcing where anyone can check it, and let the regional variant readings be the reason someone switches.
## Sourcing and digitisation
Most of this material is already online, and that changes what the moat is. Sanskrit editions, translations, scanned books, commentaries and manuscript facsimiles are largely findable for free. What is scarce is a verified, cited, machine-readable structure over them.
[TABLE]
| Source | What it gives | How we take it | Caution |
| Online text corpora: GRETIL, sanskritdocuments.org, Muktabodha, TITUS | Machine-readable Sanskrit, often already verse-split | Bulk download, parse, verse-align in week one | Licences differ and several are research-use; record one per corpus |
| Scanned archives: archive.org and the Digital Library of India, the Gyan Bharatam portal, HathiTrust, Google Books | Out-of-copyright editions and commentaries as PDFs and page images | Bulk fetch, OCR, scholar proof | Pre-1965 Indian editions are usually clear; a 20th-century translation is not |
| Websites: Wisdom Library, temple and maṭha sites, scholars' pages, sthala purāṇa pages | Context, iconography, local tellings | Exa search and contents, provenance stored | Reference tier only, never canon |
| Avi's shelf and unpublished lineage material | What is genuinely not online, and the variant readings | Scan, OCR, scholar proof | Our differentiator, and smaller than we first assumed |
| Living tradition: recorded kathā and reciters | Voice, phrasing, oral detail | Record with a signed release | Consent and an honorarium, every time |
[/TABLE]
Tier 2 is bigger than it looks. Under the Gyan Bharatam Mission, India has documented more than 1.2 crore manuscripts, with more than 8 lakh digitised and 3.9 lakh viewable on the portal as of July 2026. We partner with that programme rather than duplicating it.
### From a physical book to a cited passage
- Capture. Overhead scanner with a V-cradle at 400–600 dpi, archival TIFF plus a JPEG derivative. Never destructive on a rare copy. One file per page, named book-edition-page.
- Metadata before text. Book id, edition, publisher, year, translator or commentator, page. A passage without this cannot be cited, so it cannot ship.
- Recognition. Printed Devanagari goes to Sarvam Vision, which covers Sanskrit at 10 pages a job, with Google Document AI as fallback. Handwritten manuscripts need handwritten text recognition, not OCR: an Oxford team fine-tuned Transkribus on 500+ manuscript pages to 97% and above, and Kraken with eScriptorium reaches comparable accuracy from under a thousand lines of ground truth for one typeface.
- Ground-truth loop. Hand-transcribe 300 to 1,000 lines, train, measure character error rate, retrain. Gate: under 1% on verse text before a book enters the pipeline.
- Proof. Scholar pass on everything; double-keying on verses we will quote on screen. At 90% accuracy there is an error a line, and proofing costs as much as retyping, which is why step 3 is worth tuning.
- Align and diff. Assign book-chapter-verse ids, then diff against the public editions. Where our text differs, that is not an error to fix: variant readings are exactly the hidden details the product sells.
Build on what exists rather than writing our own. Ambuda already runs open OCR and collaborative proofing for Sanskrit, exports TEI XML, and hosts the critical editions of both epics. Vidyut (MIT) gives segmentation, transliteration and metre analysis for verse ids and metre tags. IIT Bombay's post-OCR project published a three-stage workflow of correction, verification and proofreading, plus an open editing tool, which becomes our proofing procedure. For every other language, Sarvam Vision reads print and Sarvam speech-to-text transcribes recorded kathā in 23 languages.
### How we store it
[TABLE]
| Layer | Store | Why |
| Page images | Object storage, immutable, checksummed, IIIF manifest | The app can show the actual page beside a claim, which is provenance people can see |
| Passages | Postgres: text, transliteration, translation, proof status, page and bounding box | One row per verse, addressable by id |
| Canon | Neo4j: people, places, events, eras, objects, claims | Drives script, continuity and the lineage explorer |
| Meaning search | Weaviate over passages | Finds the passage behind a half-remembered detail |
| Media | Shot ledger plus object storage | Ties every rendered shot back to its claim |
[/TABLE]
A 400-page book at 600 dpi is roughly 8–12 GB of TIFF and half a gigabyte of JPEG, so fifty books fit in under a terabyte. Storage is not a cost problem; proofing time is.
### The web layer: targeted, never total
Scraping the entire internet is already somebody's job. Common Crawl publishes a free petabyte-scale crawl every month with a queryable index, so if we ever need breadth we query it rather than build a crawler.
What we actually need is a narrow corpus: editions and commentaries, iconography and costume references, scholarly papers on the arc, and what competitors have already made. Exa is the right tool for that, at $2.50 per 1,000 searches with contents around $1 per 1,000 pages, 10 QPS on search and 100 QPS on contents, with subpage crawling inside contents. The loop is: seeded queries, fetch contents, dedupe, classify each page as public domain, permissive or copyrighted, and store it with its URL and retrieval date.
One rule holds the moat together. Web material is evidence and a pointer; it never becomes canon. A claim enters the graph only from a text we hold or have rights to, with its verse id attached.
### The correction this forces
"Books nobody else has" is a thinner moat than we assumed. Assume a competitor can assemble the same texts in a week, because they can. What they cannot assemble in a week is the graph with a citation on every claim, the retention loop that tells us which beats hold people, and the craft. Those three are the moat; the books are the head start.
So we acquire in this order, not the reverse: online corpora first, because they give a working graph within days; then the scanned archives, which need OCR and proofing; then the shelf, which is slow and is where the rarities are; then the living tradition. The shelf stops being a blocker on the pilot.
## Technical architecture
The shot contract is the unit of work: a JSON object per shot carrying camera, blocking, duration, reference ids, the canon claims it depends on and the retention beat it serves. Everything downstream is deterministic from it.
[IMAGE]
production pipeline · 7 stages, one feedback loop
Four choices worth defending. Hosted models through fal rather than our own GPUs for anything that ships, because the queue and webhook pattern handles long jobs and switching models becomes a config change. Self-hosted LTX-2.5 and Wan 2.2 on E2E or IndiaAI GPUs for drafts, where volume is high and quality does not matter yet. Reference-conditioned generation rather than fine-tuning for characters, with LoRAs only for house style. And a ledger row per shot, because licence, territory and cost questions are impossible to answer retrospectively.
## Two tracks, in parallel
Video and JS experiences run as separate tracks over the same canon. Neither waits for the other, and they prove different things.
[TABLE]
| Track | Unit | Cadence | Cost per unit | What it proves |
| Video chapters | 90–120 s MP4, narrated and labelled | Weekly once the assembler lands | $60–120 of generation | Retention, and that the format holds at season scale |
| JS experiences | One self-contained HTML file, written by Opus | One every two weeks, starting now | Near zero | That the format is interactive, ownable and shareable as a link |
[/TABLE]
The JS track is not a demo track. It becomes the interactive layer of the app, it costs nothing per unit so hooks and reveals can be tested before any render budget is spent, and a link is the cheapest thing we have to put in front of a partner, an investor or a temple network. Chakravyūha is the reference build.
The shared spine. Both tracks read the same claim ids, the same canon JSON export, the same Bulbul narration files and the same telemetry schema. A correction in the graph updates both; a beat that wins an A/B test in a JS experience becomes a beat template for the video planner.
How a JS experience gets made. A brief names the scene, the witness and the reveal. Opus writes one file. Playwright screenshots it at 390×844 and 1440×900, and it is reviewed on those, not on code. The art director passes or sends it back. It ships as a published link and a commit under web/.
Next four: the Mainaka leap from Sundara Kāṇḍa, a lineage explorer over the graph export, the reveal sheet as a module both tracks import, and the chapter player shell that will host real video.
## What we build on
Most of the stack already exists in the open. Our own code is the canon, the shot contracts, the gates and the player.
[TABLE]
| Layer | Build on | Why |
| Sanskrit text and proofing | Ambuda, Vidyut | Open OCR, proofing, TEI export, segmentation and metre, already working |
| Canon graph | Neo4j and llm-graph-builder | Keeps the source chunk behind every extracted entity, which is our citation |
| Multi-agent video | ViMax (MIT) | Script, storyboard, consistency-check and generation agents; we read its loop and swap its backends for fal |
| Rendering | fal queue and webhooks; hosted H3 reference-to-video with LoRA | One API for every model, worldwide-safe, no GPUs to run |
| Narration | Sarvam Bulbul v3, eleven languages, pronunciation dictionaries | Indian voices at a few rupees a chapter per language |
| Chant | Vāgdhenu (IISc, Apache-2.0 code) | Metre-aware śloka chanting; permission needed before public use |
| Ingestion | Sarvam Vision, Sarvam speech-to-text (23 languages), Exa | Print, recorded kathā and the reference web |
| Building it | The starter repo and the Build Brief for Claude Code | Rules, order of work and the line where autonomy stops |
[/TABLE]
## Where Opus sits
Opus directs and inspects. It never renders a frame.
[TABLE]
| Job | What Opus produces | Why it, and not a cheaper model |
| Season and episode planning | Arc broken into chapters, each with its beat map and its canon claim ids | Long-context reasoning over the graph and the source passages together |
| Shot contract | Strict JSON per shot: camera, blocking, duration, reference ids, claim ids, retention beat | The contract is the whole pipeline's input; a bad one wastes every rupee downstream |
| Prompt compilation review | The deterministic compiler is code; Opus reviews its output on new shot types | Catches prompt drift before a batch of renders |
| QC gate | Vision pass over each returned clip against its own contract: blocking, references, period accuracy, artefacts | Vision plus canon reasoning in one call, with a written verdict we can audit |
| Narration and caption drafts | Hindi and English caption lines, shloka transliteration, hidden-detail copy | Register matters; this is the voice of the product |
| JS artifacts and internal tools | The interactive chapter prototype, the canon browser, the shot review board, the retention dashboard | Each is a self-contained page; Opus writes and iterates them in hours, as the Chakravyūha prototype showed |
| Immersive code | Unity C# and shader work for the walkable layer, later | Same reasoning, different target |
[/TABLE]
Two rules. The canon graph, not the model, is the source of truth: Opus writes nothing into the graph without a cited passage and a human approval. And unreleased source text never goes to any API whose terms allow training on inputs.
## The immersive track
Immersive ships last, and only once chapters retain. Headset ownership in India is small, and the Ray-Ban Meta glasses sold here have cameras and open-ear speakers but no display, so the near-term glasses play is audio, not video.
Three steps, each usable on its own:
- In-app depth, month 6. Parallax and camera moves over generated plates, built in the same web stack as the chapter player. No new engine.
- Walkable scene, month 12. One set piece per season — stand in the sabha, walk the seventh ring — built from a world model such as World Labs Marble, which exports Gaussian splats and meshes to Unity and Unreal and views on Quest and Vision Pro.
- Venue build, month 18. A 10-minute guided experience for temples, museums and festival installations, which is also the first B2B revenue.
Unity for the product, Unreal for the showpiece. Unity carries mobile AR, Quest builds and the small team; Unreal is worth it only for a venue-grade or film-grade piece where lighting and scale sell the ticket. Decide per build, not once.
The canon graph pays off here too: a walkable scene is the same event data with a different renderer, and the hidden details become objects you can look at rather than cards you tap.
## Unit economics
A finished minute of video costs $30–60 in generation, so a 10-chapter pilot season is under $1,500 of compute. People, not GPUs, are the budget.
[TABLE]
| Line | Figure | Basis |
| Raw generation | $6–12 per minute | 60 s at $0.10–0.20 per second, 1080p class |
| Usable minute | $30–60 | 4–6 attempts per shot, 8+ on hero shots |
| One chapter, 2 min | $60–120 | Hero beats on the premium model, body shots on the cheap one |
| Pilot season, 10 chapters | $600–1,200 | Draft pass at 480p, final render only after edit lock |
| Narration | ~₹160 per hour | Sarvam Bulbul at ₹30 per 10,000 characters; ślokas chanted by Vāgdhenu or a reciter |
| Each extra language, per chapter | Under ₹10 of voice | About 1,500 characters of narration; the real cost is the native reviewer's hour |
| JS experience | Near zero per unit | Opus writes it; review time is the cost |
| Style or character LoRA | ~$10 per train | LTX-2 training at $0.0048 a step, 2,000 steps, minutes to run |
| Draft GPUs, self-host | ₹65–92 per GPU-hour, or $1.80 an hour for an H100 | IndiaAI compute portal (approval-gated) or E2E Networks; also hosts Vāgdhenu |
| Benchmark to beat | Under $100 a finished minute | Kuku's reported all-in target; China runs over $150 |
[/TABLE]
The saving is structural: draft every shot cheap at 480p, cut the episode, lock it, then re-render only the surviving shots at final quality. Without that, most of the spend goes into footage nobody sees.
At $4.99 a month, one diaspora subscriber covers roughly one finished minute of video a year, so the season has to carry thousands of them, not hundreds. That is a marketing problem, not a compute one.
## Go-to-market
The beachhead is diaspora families in the US, UK, UAE and Canada, served in English, Hindi, Tamil, Telugu and Kannada, because much of that diaspora speaks a southern language at home. They pay in dollars, they want their children to know the stories from a source they trust, and a stylised look reads as respectful rather than cheap. Bharat follows on audio in all eleven languages, where the habit and the price point already exist.
[IMAGE]
first year · 7 workstreams, one gate
Channels, in the order we use them. Shorts, Reels and WhatsApp carry the pilot for free and tell us whether the format holds. Temple networks, satsangs and diaspora children's programmes give endorsement and group viewing, which is the Mahavatar Narsimha playbook. Licensing finished seasons to devotional and microdrama platforms earns revenue without buying installs. The app is last, and it is where the canon, the community and the retention data live.
Pricing. $4.99 a month or $39 a year for the diaspora; ₹149 a month or ₹999 a year in India; the first chapter of every season free, and a festival bundle priced as a gift. No coin-per-episode cliffhangers: this audience is paying for trust, not for a slot machine.
Festivals are the calendar. Navratri and Diwali in autumn, Ram Navami and Hanuman Jayanti in spring. Each gets a themed drop announced three weeks ahead through the community channels, which is also when paid acquisition is worth testing.
Ride the film calendar. Ramayana Part 1 opens at Diwali 2026, with Part 2 at Diwali 2027, and Mahavatar Parshuram follows in 2027. Each release floods search and conversation with one story. Have a sourced chapter on that same episode live the week it opens, positioned as what the text actually says.
## Risks, rights and compliance
[TABLE]
| Risk | Likelihood | What we do about it |
| A funded competitor moves into our lane | High | Mythik has $20M and a live app; we stay where they are not: short instrumented chapters, visible sourcing, eleven languages, devotional-community distribution |
| Backlash over depiction or inaccuracy | High | Witness POV, stylised look, scholar sign-off on every chapter, source cited on screen, no contested episode without two attestations |
| Rights in the source texts | High | Rights audit before a single line is adapted: the text may be in the public domain while a 20th-century translation or commentary is not; written consent from any holding lineage, counter-signed |
| Translation errors across languages | Medium | Sarvam drafts, a native reviewer per language, and the source verse shown beside every line |
| Chant voice permission | Medium | Vāgdhenu output stays internal until its author agrees, or we train on our own reciter |
| Model licence and territory | Medium | Licence and territory tagged on every shot row; self-hosted H3 never renders anything shown outside India; a weekly audit query over the shot ledger |
| Training on our source text | Medium | Unreleased passages never leave our infrastructure; APIs whose terms permit training on inputs are blocked at the router |
| India's AI labelling rules | Certain | Visible label and embedded provenance on every asset by default; a continuous on-screen label has been proposed, so the player supports one behind a flag |
| Video economics stay unproven | Medium | Audio-first costs, licensing revenue before paid installs, and a hard cap on compute per season until retention clears its gate |
| Leaked API keys | Already happened | Rotate the pasted keys, environment-only secrets, a gitleaks pre-commit hook, secret scanning on |
[/TABLE]
None of this is legal advice. The rights audit and the lineage agreement need a media lawyer before the pilot ships publicly.
## Team and cost to first season
Five people take us through the pilot season. The first hire is not an engineer.
[TABLE]
| Role | When | Why first | Cost, 6 months |
| Art director and editor | Month 1 | Taste is the product; this role owns the style bible, the asset bible and the cut | ₹9–15 lakh |
| Sanskrit or Indology scholar, part-time | Month 1 | Proofreads the OCR, signs off every chapter, is our shield in public | ₹3–5 lakh |
| Avi with Claude Code: canon graph, pipeline, player | Month 0 | The graph, the router and the app are the defensible engineering; Claude Code builds against the brief | — |
| Proofreader and data entry, contract | Month 1–3 | OCR at 90% accuracy means an error a line; proofing is the real digitisation cost | ₹2–3 lakh |
| Language reviewers, one per pilot language, contract | Month 2 | Each language needs a native reader who knows its regional telling | ₹30–50k per language |
| Growth and community, part-time | Month 4 | Diaspora temple and school networks are relationship work, not ad buying | ₹4–6 lakh |
[/TABLE]
Add roughly ₹3–5 lakh for compute, APIs, voice, scanning and tools over the same six months, which makes the pilot season a ₹27–37 lakh commitment before any paid acquisition. Hold hiring beyond this until the retention gate clears.
## Linear backlog
Nine epics, with DHE-VOICE added below. The first three cycles take us from texts to a pilot chapter in people's hands; everything after that is scale.
[TABLE]
| Epic | Owns | Done when |
| DHE-CANON | Scanning, OCR, proofing, the graph schema, extraction, citations | One arc fully graphed with every claim cited to book, chapter and verse |
| DHE-PLAN | Season and episode planner, beat maps, shot contract schema, prompt compiler | A chapter's shot list generates from the graph and validates clean |
| DHE-RENDER | fal router, job ledger, draft and final passes, LoRA training, licence tagging | A shot list renders end to end with cost and licence recorded per shot |
| DHE-QC | Vision gate, canon and period checks, retry policy, scholar review queue | No shot reaches the cut without a machine verdict and a human sign-off |
| DHE-PLAYER | Chapter player, book page, reveal sheet, lineage explorer, offline audio | A chapter plays on a mid-range Android with the screen off |
| DHE-SIGNAL | Per-second telemetry, retention curves tied to shot ids, A/B on cold opens | We can say which shot lost the viewer |
| DHE-TRUST | Rights audit, lineage agreement, AI labels, provenance, territory audit | Legal sign-off to publish, labels on every asset |
| DHE-XR | Depth layer, walkable set piece, venue build | One set piece runs on Quest at 72fps |
[/TABLE]
### Cycle 1, weeks 1 and 2 — the canon exists
[TABLE]
| Ticket | Epic | Work | Done when | Est. |
| DHE-1 | TRUST | Rights audit on the source books: edition, translator, commentary, holder | A one-page memo per book naming what we may adapt | 3d |
| DHE-2 | CANON | Pick the pilot arc; write the one-line reason no one else has adapted it | Arc chosen, 10 chapters sketched in a paragraph each | 2d |
| DHE-3 | CANON | Scan the arc's pages at 300 ppi; run Sarvam Vision OCR; measure accuracy on 10 pages | Character error rate reported; OCR vendor chosen | 3d |
| DHE-4 | CANON | Proofing pipeline: scholar corrections, book-chapter-verse ids on every passage | 100% of arc passages carry ids and a proofed flag | 5d |
| DHE-5 | CANON | Graph schema v0 in Neo4j: person, place, event, object, era, claim, source, shot | Schema committed with constraints and a seeded test fixture | 3d |
| DHE-6 | CANON | Extraction run with Opus over proofed passages; human verification UI | Arc's events, people and claims in the graph, each linked to its passage | 5d |
[/TABLE]
### Cycle 2, weeks 3 and 4 — one chapter renders
[TABLE]
| Ticket | Epic | Work | Done when | Est. |
| DHE-7 | PLAN | Shot contract JSON schema and validator, including canon claim ids and retention beat | Invalid contracts fail CI with a readable error | 2d |
| DHE-8 | PLAN | Planner prompt: arc plus graph to chapter beat map to shot list | Chapter 1 shot list generated and reviewed by the art director | 3d |
| DHE-9 | RENDER | Prompt compiler: one contract compiles to Wan, Kling, H3 and LTX payloads | Same contract renders on two models with no hand editing | 3d |
| DHE-10 | RENDER | fal worker: queue submit, webhook receive, retries, idempotent job rows | 50 shots submitted, all results landed, no duplicate spend | 3d |
| DHE-11 | RENDER | Shot ledger: model, seed, licence, territory, attempt, cost per shot | Cost per chapter queryable; territory audit returns clean | 2d |
| DHE-12 | RENDER | Asset bible: character sheets, location plates, style LoRA trained on fal | References used by every shot; LoRA versioned with the season | 4d |
| DHE-13 | QC | Vision gate: Opus scores each clip against its contract, three strikes to human | Gate catches a seeded anachronism in a test batch | 3d |
[/TABLE]
### Cycle 3, weeks 5 and 6 — people watch it
[TABLE]
| Ticket | Epic | Work | Done when | Est. |
| DHE-14 | PLAYER | Chapter player: book page, scene, reveal sheet, cliffhanger, audio-only mode | Chapter plays on a ₹15,000 Android and with the screen off | 5d |
| DHE-15 | PLAYER | Lineage explorer over the graph, with citations on every node | Any character in the pilot opens to a sourced card | 3d |
| DHE-16 | SIGNAL | Per-second telemetry tied to shot ids; retention curve view | Drop-off for chapter 1 readable by shot within a day of release | 3d |
| DHE-17 | SIGNAL | Two cold opens per chapter, assigned at random, winner reported | A/B result for chapters 1 to 3 with confidence stated | 2d |
| DHE-18 | TRUST | AI label, provenance metadata, scholar sign-off record per chapter | Every published asset carries label and provenance | 2d |
| DHE-19 | PLAN | Edit lock then final render pass at 1080p for surviving shots only | Final render spend under 40% of a full-quality pass | 2d |
| DHE-20 | GTM | Ship chapters 1 to 3 to Shorts, Reels and WhatsApp in Hindi and English | 10,000 views and the gate numbers measured | 3d |
[/TABLE]
### Added since the first draft
A ninth epic, DHE-VOICE, owns narration, chant, pronunciation and translation. These tickets are also in the starter repo's docs/tickets.csv.
[TABLE]
| Ticket | Epic | Work | Done when | Est. |
| DHE-21 | CANON | Exa reference corpus with dedupe, licence classification and provenance | Seeded queries land in corpus/ with URL and retrieval date | 3d |
| DHE-22 | PLAYER | Show the scanned page beside the claim through IIIF | A reveal opens to the actual page with the verse highlighted | 3d |
| DHE-23 | VOICE | Sarvam narration module with chunking and a content-hash cache | A second run bills zero characters | 2d |
| DHE-24 | VOICE | Vāgdhenu chant service on a GPU box | A śloka from the pilot renders to WAV; internal only | 3d |
| DHE-25 | RENDER | ffmpeg assembler: shots, narration, chant, captions, label | pnpm chapter s1e3 meets the v0 test in the build brief | 3d |
| DHE-26 | WEB | Mainaka experience from Sundara Kāṇḍa | Meets the JS standards at both screen sizes | 4d |
| DHE-27 | WEB | Lineage explorer and shared reveal module | Both tracks import the same reveal | 3d |
| DHE-28 | VOICE | Translation pipeline: Sarvam draft, native reviewer queue, source verse beside each line | A chapter clears review in five languages | 4d |
| DHE-29 | VOICE | Pronunciation dictionaries per language, generated from the graph | Every person and place name is said one way per language | 2d |
| DHE-30 | CANON | Fork Ambuda proofing and wire Vidyut for verse ids and metre | Pilot passages carry Vidyut metre tags | 3d |
| DHE-31 | TRUST | Rotate leaked keys, gitleaks, secret scanning | A planted fake key fails pre-commit | 1d |
[/TABLE]
### After the pilot
Licensing conversations, the app shell and subscription, the second arc, the regional language, and the first walkable set piece. None of it starts before the retention gate clears.
## Open decisions
Only the pilot arc blocks the build, since the texts are online; the rest can be settled in parallel.
- ☐ The pilot arc. One arc with a known reveal, available in public corpora, and not yet made by Mythik.
- ☐ Pilot languages and reviewers. Confirm English, Hindi, Tamil, Telugu and Kannada, and name a reviewer for each.
- ☐ The books. Which of your own texts carry what is not online, and who holds the rights to their translations and commentaries.
- ☐ The look. Stylised in which direction: temple relief, Amar Chitra Katha line and colour, or painted miniature.
- ☐ Audio-first or video-first for the launch season.
- ☐ The lineage partner. Which maṭha, trust or sampradāya we approach, and what we offer them.
- ☐ Vāgdhenu permission, or a plan for our own reciter's voice.
- ☐ Key rotation for the Sarvam, Exa and unidentified keys pasted in chat.
- ☐ Entity and funding. Bootstrapped pilot, or raise on the pilot's retention numbers, with Mythik's $20M as the comparable investors will cite.