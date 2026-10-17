# Dheevara data sourcing plan: from archives to the temporal knowledge graph

Status: plan, 17 Oct 2026. The six principles in §2 are the founder's and are decided. **Decide** marks items for Avi. This is not legal advice.

Inputs, cited inline:
- **[inventory]** `docs/research/notes-2026-10-17-sourcing/source_inventory.md`
- **[tooling]** `…/acquisition_extraction_tooling.md`
- **[methods]** `…/storylines_trivia_methods.md`
- **[sources]** `docs/research/sources.md`: what is already held, and the BORI rights analysis. Neither is repeated here.
- **[TKG]** [`temporal-knowledge-graph.md`](temporal-knowledge-graph.md): the target data model. Its tables are linked here, not redefined.

---

## 1. Summary

- **Goal.** Every fact Dheevara shows reaches the knowledge graph from a website, scan, PDF or book with evidence a scholar can check. This covers both epics from today:
  - the Mahābhārata from the Droṇa Parva (day 13, 7.32–7.51, already in the canon for s1e3);
  - the Rāmāyaṇa from the Sundara Kāṇḍa (Baroda CE book 5: 66 sargas, 2,487 verses, already indexed), timed to the 6 Nov film ([decisions] 17 Oct).
- **Source by season.** A season's scope file names what gets fetched: its passages, the verses they point to, and the tellings and images that retell them. Breadth comes from repeating this per season.
- **Two layers that never mix.**
  - The **evidence layer** holds immutable bytes, each with a sha256, page and line coordinates, a Wayback capture, our own WARC copy and a crawl-log line.
  - The **assertion layer** holds versioned, signed claims that point at exact evidence spans (the [TKG knowledge layer](temporal-knowledge-graph.md#knowledge-layer)).
- **Verse alignment is the spine.** Every line gets a CE verse id early:
  - OCR is aligned against the e-texts we hold, which gives a measured error rate per page.
  - Translations get a section→verse map.
  - Regional tellings get scene-level links.
- **Machines propose, people decide.** Automated steps write only evidence or `scratch.candidate` rows. Editors promote candidates to claims, and scholars sign. Review throughput is the bottleneck, so a Studio review screen is built in week 1.
- **Disagreement is data.** Each edition and telling is its own account. War-day placement is graded stated, derived or conventional, and a conventional placement is never stored as a claim.
- **Everything compiles downstream.** A corrected claim lists every caption, shot and kept reveal that used it.
- **Built today:**
  - a sha256-pinning fetcher that fails loudly (`src/canon/fetch.mjs`);
  - GRETIL and Smith parsers (`src/ingest/`);
  - 12 pinned files (`content/canon/sources.json`);
  - 99 cited verses (52 MBh, 47 Rām) and 43 claims.

  The rest is to build.
- **The critical dependency for 6 Nov:** a scholar who can sign Rāmāyaṇa claims by about 30 Oct (§8).

---

## 2. The approach

### 2.1 Source by season, not by corpus

Each season gets a scope file: proposed `content/seasons/<season>/scope.json`, with season ids as in [TKG Season](temporal-knowledge-graph.md#production-layer). It lists four things:

1. **Core window:** the CE passages the season tells.
2. **Pointer verses:** passages the core retells or recalls. The propose step finds them as accounts with `mode = recalled | retold` ([TKG §2.1.1](temporal-knowledge-graph.md#211-narration-frames-tellings)) and adds them to scope.
3. **Retellings:** the translation sections, commentary and regional tellings that cover the window.
4. **Images:** visual references that depict the window.

Nothing is fetched, OCR'd, aligned or proposed unless a scope file names it. The register (§3) may list a source long before any season uses it.

| | `mbh-s1` (Droṇa, day 13) | `ram-s1` (Sundara Kāṇḍa) |
|---|---|---|
| Core window | 7.32–7.51, the Abhimanyuvadha sub-parvan (MCI: "related to Adhyāyas 7. 32-51" [inventory §1]): 20 adhyāyas, 643 verses | 5.1–5.66: 66 sargas, 2,487 verses (`content/canon/ram/verse-index.json`) |
| Pointer verses already cited | 1.213, 3.132, 3.256 (retold at 7.41), 4.67, 14.65–69 | none yet: the 15 Maināka claims are all in 5.1. Hanumān's recollections will add Araṇya and Kiṣkindhā pointers |
| Apparatus | 7.34.18\*259 (the womb passage); App. I No. 8 (the Vyāsa consolation, Ganguli L–LXXI) [sources §3] | Smith's Rāmāyaṇa star passages: not yet checked |
| Translations | Ganguli XXXI–XLIX and LXXII–LXXIII (mapped in [sources §3]); Dutt's Droṇa volume | Griffith Book V; Dutt's Sundara volume |
| Tellings | Pampa, Sāraḷā Dāsa, Telugu MBh (their day-13 episodes) | Kṛttivāsa, Growse's *Mānas*, Kamba, Ezhuthachan (their Sundara episodes) |
| Next window | Day 14, Jayadrathavadha (from 7.52; range to confirm) | Yuddha 6.1ff. or back into Kiṣkindhā (**Decide** after the film) |

### 2.2 Two layers that never mix

**Evidence layer.** Append-only. It holds:
- **Evidence objects:** one per fetched file.
- **Page records:** one per scan page.
- **Evidence spans:** file sha256, page, `xywh` box, line, character offsets, and the exact quote with its prefix and suffix. These are W3C `TextQuoteSelector`, `TextPositionSelector` and `FragmentSelector` [tooling §5–6].

A re-fetch that returns different bytes creates a new object. In TKG terms an evidence object is a `txt.manifestation` ([§2.2](temporal-knowledge-graph.md#22-textual-time)), and its bytes live in the object store ([§4.5](temporal-knowledge-graph.md#45-object-store)).

**Assertion layer.** This is `kn.claim` / `claim_version` / `claim_target`, `story.*` with `kn.support`, `pa.*` popular attestations and `kn.review` ([TKG §3.3](temporal-knowledge-graph.md#33-node-and-edge-types-by-layer), [§4.3](temporal-knowledge-graph.md#43-ddl-sketch-core-tables)). Assertions point down into evidence and never the other way, so editing a claim cannot alter a span.

**Gap in TKG.** TKG stops at `txt.manifestation`. Page records, evidence spans, alignment links and the crawl log (fields in §4) need a `src` schema next to `txt`, and TKG needs a section for it. This is a proposal.

### 2.3 Verse alignment is the spine

A line without a CE verse id cannot support a claim. Alignment therefore runs right after extraction, before any LLM sees the text.

| Source kind | Method | Yields |
|---|---|---|
| Sanskrit print of a text we hold as e-text | Character alignment of the OCR against Smith/GRETIL for the expected adhyāya | Verse id, page and box for each line, plus a **measured CER** per page |
| Translation (Ganguli, Dutt, Griffith) or vulgate (Nīlakaṇṭha) | Section boundaries anchored by hand; links inside each section proposed by embedding similarity, then accepted by a person | Many-to-many links, each with a score and a status |
| Regional telling | Scene-level link to a `story.event`, plus the CE locator it retells or departs from | Event links, not verse links |

### 2.4 Machines propose, people decide

Automated steps write evidence (OCR, alignment) or `scratch.candidate` rows ([TKG §6.2](temporal-knowledge-graph.md#62-why-an-llm-extracted-graph-is-not-the-system-of-record)). Only people write assertions:
- the editor registers the claim;
- the proofreader marks it `proofed`;
- the scholar signs it ([TKG §2.3](temporal-knowledge-graph.md#23-knowledge-system-time-bitemporal); roles from [methods §6]).

The Studio review screen therefore sets the pace of the whole graph. Its throughput is measured from the first week (§4.7).

### 2.5 Disagreement is data

- Each edition, recension, translation and telling is its own `txt.expression`.
- Where sources disagree, each gets a `story.account` with its own claim or attestation. Accounts are never averaged.
- Ranks follow Wikidata [methods §3]:
  - *preferred* = `bori-ce` / `baroda-ce` main text;
  - *normal* = other expressions, shown with their label;
  - *deprecated* = our own withdrawn versions.
- Popular tellings stay `pa.*` and never become ranks.
- War-day placement is graded:
  - **stated:** a verse names the day or a boundary, cited with `kn.support.role = 'dates'`;
  - **derived:** counted from stated anchors along `story.event_order` edges, so the tick is computed;
  - **conventional:** the parvan = days schema. It is never a claim; at most it is a popular attestation or an editorial note [methods §2].

### 2.6 Everything compiles downstream

- The chapter plan, manifest ([TKG §5.1](temporal-knowledge-graph.md#51-the-chapter-manifest-becomes-a-projection)), shot contracts, web experiences and renders are all projections of the graph.
- A correction is a new `kn.claim_version`. The blast-radius query (TKG Q3) then lists every caption, narration line, shot, kept reveal and web page that used the old version.
- Pieces that exist today:
  - `src/canon/claims-used.mjs` already finds every claim id used under `content/`;
  - `pnpm web:build` fails on an unresolved id.
- Released versions are never rewritten. Corrections produce new versions.

---

## 3. Source register

### 3.1 Tiers and rules

| Tier | Meaning | May support |
|---|---|---|
| **A, the text** | Critical-edition constituted text | `kn.claim_target`, main text only ([TKG §4.4](temporal-knowledge-graph.md#44-the-star-passage-guard)) |
| **B, scholarship** | Translations, commentaries, indexes, lexicons | Glosses, translations, finding aids, apparatus notes. Can lead to a claim; is never its target |
| **C, popular telling** | Regional poems, comics, TV: "what many heard" | `kn.popular_attestation` only |
| **D, pointer** | Leads and join keys | Nothing |

**Rules for every row:**
1. **An archive.org uploader's rights mark (CC0, PDM, CC BY-NC-ND) is never rights evidence.** We record it and ignore it. Such marks have already turned up on BORI, ACK, Rajaji and Mani scans [sources §5; inventory §5, §7]. Evidence means one of:
   - a scanning centre's `NOT_IN_COPYRIGHT`;
   - a verified publication date plus a verified death date;
   - a licence text held by sha256;
   - a permission letter.
2. Calcutta, vulgate or recension locators are leads until they are aligned to a CE id.
3. A row that names no verse-mapping method is tier D.

**Status values:**
- *held*: pinned today;
- *next*: in a season scope within three weeks;
- *later*;
- *excluded*.

### 3.2 Mahābhārata

| Source | Tier | Format | Rights | Verse mapping | Status |
|---|---|---|---|---|---|
| Smith CE `text/UD`, books 1, 3, 4, 7, 14 | A | text, ids like `07034019a` | (C) BORI, "do not provide copies" | native CE | **held** (Devanagari check) |
| Smith CE `text/UR` books 1–18 + `apps/UR/SuppNN.txt` | A + apparatus | text | same | native CE; star passages `07*0259_01` | **next**, to replace GRETIL as the parse source [sources §9.1] |
| GRETIL `mbh_NN_u.htm`, books 1, 3, 4, 7, 14 | A (cross-check) | HTML | defers to BORI | native; 83 Book 7 lines differ from Smith | **held** (today's parse source) |
| BORI Droṇaparvan print, 1958 (`in.ernet.dli.2015.407869`, 826 pp, and others) | A (print witness) | scans; DLI OCR unusable | print possibly protected to 2028 or 2038; uploader CC0 is irrelevant | OCR→e-text | **next** (DHE-1) |
| Harivaṃśa CE (BORI 1969), GRETIL TEI + App. I | A | TEI | BORI + CC BY-NC-SA 4.0 | native + star passages | later |
| Ganguli, PG #15475; scans `mahabharataofkri04royp` | B | text; scans NOT_IN_COPYRIGHT | PD | section map (7.32–7.51 done) | **held** (researched, not yet pinned) |
| M. N. Dutt prose (1895–1905), `aproseenglishtr00duttgoog` + DLI | B | scans | PD in the US; India hinges on Dutt's death (≈1912, unverified) | numbered vulgate verses → CE | **next** (find the Droṇa volume) |
| Nīlakaṇṭha, Chitrashala 1929–36 (Droṇa 1931, `cRkp_…`) | B (later layer) | scans | commentary PD; editor unverified; 1931 borderline in the US | vulgate numbering → CE | later (the bridge for Mani and Dutt) |
| Mehendale, *Cultural Index* (CDSL `mci.txt`) | B (finding aid) | tagged text | print in copyright; digital layer has a CC BY-NC-SA 3.0 vs CC BY-SA 4.0 conflict | **cites CE directly**; records war days | **next** (locators only) |
| Sørensen, *Index to the Names* (CDSL `inm.txt`; DLI `…98210`) | B (aliases) | text; scans | print PD; digital layer has the same conflict | Calcutta → Ganguli → CE | **next** (text from PD scans; CDSL as internal lookup) |
| Vettam Mani, *Purāṇic Encyclopaedia* (CDSL `pe.txt`) | B, pointer | text | in copyright | vulgate → CE | later |
| Monier-Williams 1899, Apte 1890 (CDSL) | B (lexical) | text | print PD; digital NC/SA conflict | n/a | **next**, internal only |
| Hopkins, *Epic Mythology* 1915 | B | scans | US PD; India hinges on his death year (≈1932) | vulgate | later |
| DCS CoNLL-U | B (morphology) | CoNLL-U | CC BY 4.0 (GitHub) / 3.0 (site) | counter ≠ CE | later |
| Pampa Bhārata, 1898 (`india.history.resource.111026`) | C | scans | PD (pre-1931 edition) | scene | **next** |
| Sāraḷā Dāsa (`odia-mahabharata`) | C | scans | work PD; edition unverified | scene | later |
| Āndhra Mahābhāratamu (palm-leaf `bwoz-232-…`; 1968 print) | C | scans | work PD; 1968 print may be protected | scene | later |
| Kannada Jaimini Bhārata (Sanderson 1852, NOT_IN_COPYRIGHT) | C | scans | PD | scene (Aśvamedha episodes absent from the CE) | later |
| Villiputhurar (Project Madurai) | C | e-text, unverified | terms unverified | scene | later |
| Rajaji, ACK, B. R. Chopra 1988 | C, cite only | — | in copyright; archive.org marks are false | issue, episode, timestamp | cite only |
| Van Buitenen, Debroy, Fitzgerald | B, consult | — | in copyright | CE | consult only |
| Wikidata (224 items; 13.7% of statements referenced) | D | SPARQL | CC0 | none | **next**, QIDs only |

### 3.3 Rāmāyaṇa

| Source | Tier | Format | Rights | Verse mapping | Status |
|---|---|---|---|---|---|
| Smith Baroda CE `Ram05` (UR + UD) | A | text, ids like `5001089a` | no licence stated; "still far from correct" | native CE | **held** |
| Smith `Ram00`–`Ram07` (UR + UD) | A | text | same | native | **next** |
| GRETIL `sa_rAmAyaNa.xml` / `.txt` | A (cross-check) | TEI, txt | CC BY-NC-SA 4.0 | native | **next**: diff against Smith |
| Hellwig rev. 2–3 | A (cross-check) | TEI | CC BY-NC-SA 4.0 | CE with some southern corrections | later |
| Baroda CE print volumes (1960–75) | A (print witness) | scans **not yet located** | possible editorial copyright (Bhatt, Shah) | OCR→e-text | **next**: Smith's warning means every cited verse needs a print check |
| Griffith, PG #24869 (+ DLI vols 1–2) | B | text (verse) | PD | Benares cantos → Baroda sargas | **next** (Book V) |
| M. N. Dutt prose 1891–94 | B | scans (uploader PDM ignored) | PD by date | vulgate → CE | **next** (Sundara volume) |
| Goldman et al. (Princeton) | B, consult | — | in copyright | CE | consult |
| Hari Prasad Shastri | **excluded** | — | likely protected in the US; alleged to be translated from Roussel | — | excluded |
| IIT Kanpur (southern recension) | C/D | web, unreachable 17 Oct | unverified | **not CE** | later |
| Kṛttivāsī, 1903 (`in.ernet.dli.2015.291061`) | C | scans | PD (pre-1931 printing) | scene | **next** |
| Growse, *Tulsi Dás* 1883 (HathiTrust; Wikisource DjVu) | C | scans; Wikisource `Page:` | PD | scene; page + revision id | **next** |
| Kamba (Project Madurai) | C | e-text, unverified | work PD; site terms unverified | scene | **next**: verify first |
| Ezhuthachan (palm-leaf `zbzh-173-…`) | C | scans | work PD | scene | later |
| Sagar *Ramayan* 1987, ACK | C, cite only | — | in copyright | episode, page | cite only |
| Wikidata | D | SPARQL | CC0 | none | **next** (count unknown) |

### 3.4 Images

- **Shippable, CC0:**
  - Cleveland Open Access API: 11 MBh hits, 38 Rām. Some titles name the kāṇḍa and chapter (2013.306: "Chapters 50 and 51 of the Aranya Kanda"), so they can be linked at scene level.
  - Met Open Access: use `/v1.1/search`, since v1 was retired on 1 Oct 2026.
  - Smithsonian Open Access.
- **Per file only:** Wikimedia Commons (`Category:Chakravyuha`, 19 files; Angkor Wat reliefs; `Ramayana in art`).
  - Check each file's licence.
  - Flag CC BY-SA photographs of reliefs before using them to condition a render, since the render may become a derivative.
- **Excluded:**
  - British Museum: CC BY-NC-SA.
  - AIIS: scholarly use only; commercial publicity barred.
  - Huntington: no blanket licence.
- **Records:** each image gets an evidence object (API record and image bytes, both by sha256) and a rights note.
- **Rule 1 still governs use:** no deity close-up as a shot reference.

---

## 4. The pipeline, stage by stage

```
register → acquire → preserve → extract → align → propose → verify → load → use
```

### 4.1 Register

- **Tool.** Extend `content/canon/sources.json`, which today holds two editions and 12 pinned files with notices and a rights paragraph, into a register of all sources.
- **Record.** `{source_id, work, expression_kind, tier, manifestations[], rights: {summary, evidence_kind: scan_centre_status | pubdate+deathdate | licence_text | permission_letter | none, evidence_ref, verified_by, date}, uploader_marks (ignored), mapping_method, seasons[], status}`.
- **Gate.** A test fails if any of these is true:
  - a scoped source has no register row;
  - a row's rights evidence is an uploader mark;
  - a tier-A or tier-B row has no mapping method.
- **Cost.** None.

### 4.2 Acquire

- **Tools.**
  - archive.org: the Metadata API per item, and the Scraping API (cursor-based) for discovery beyond advancedsearch's 10k cap. Use `numFound` for counts, because `total_only` returned 3128 for every query [tooling §1].
  - Project Gutenberg: mirrors or the harvest feed only.
  - Wikisource and Commons: the MediaWiki API.
  - Museums: the CMA API and Met v1.1.
- **Built.** `fetch.mjs` downloads each pinned URL into the gitignored `.cache/canon/`, checks its sha256 and throws on a mismatch. It has no robots check, no log and no WARC. Its error message says "GRETIL returned" even for Smith URLs; this is minor and should be fixed.
- **To build.**
  - Fetch robots.txt first (RFC 9309) and record its sha256.
  - User-Agent `DheevaraCorpusBot/0.1 (+contact)`.
  - One request per second per host, or the Crawl-delay if larger.
  - Back off on 429 and 503.
  - **Fail loudly on a 403 challenge, with no retry or workaround** (Cloudflare, the DCS proof-of-work, CAPTCHAs [tooling §7]).
  - Check IA's `sha1` before computing our sha256.
  - Email info@archive.org before any job over about 10k files.
- **Record.** A JSONL crawl-log line in `content/canon/crawl-log/`: `{ts, url, method, status, bytes, sha256, robots_ok, robots_txt_sha256, user_agent, delay_ms, purpose, warc_file, wayback_ts, ia_id?, ia_sha1?}`.
- **Gate.** No fetch outside a scope. A pin mismatch fails. `robots_ok = false` fails.
- **Cost.** None.

### 4.3 Preserve

- **Tools.**
  - `warcio`, as a Python sidecar around the same request, so the WARC holds exactly the bytes we hashed.
  - SPN2 with S3 keys and `if_not_archived_within=30d`. Its limits are 7 captures a minute, 30k a day and 5 per URL per day [tooling §2].
  - CDX lookup to confirm each capture.
- **Built.** Nothing.
  - SPN2 through this environment's proxy is untested.
  - Wayback reset our connection on 4 Oct [sources §3], which is one reason we keep our own WARC copy.
- **Storage.**
  - An object-store bucket `evidence`, alongside TKG's `assets`, `records` and `cache`.
  - Full BORI and Baroda texts go in TKG's restricted area.
  - Git holds only the CDXJ index and the hashes.
- **Record.** The evidence object: `{sha256, bytes, media_type, source_url, retrieved_at, http: {status, last_modified, etag}, warc: {file, offset}, wayback: {ts, spn_job_id} | {error}, ia: {id, file, sha1, metadata_snapshot_sha256}?, rights_hint}`. It loads as a `txt.manifestation`.
- **Gate.** An evidence object needs a WARC record. A failed Wayback capture is recorded as an error, never left empty.
- **Cost.** Storage of about $1–5 a month at 100–200 GB. SPN2 is free.

### 4.4 Extract

**E-texts: deterministic parsers.**
- Built:
  - `src/ingest/gretil.mjs` (keeps star passages apart);
  - `src/ingest/smith.mjs` (both epics; ISO 15919 → IAST).
- To build:
  - a Smith `apps/` parser;
  - a GRETIL TEI parser;
  - a PG parser that keeps section and canto headings (Ganguli, Griffith);
  - a CDSL record parser (`<L>…<LEND>`) for MCI and INM.

**Scans: layout, then two OCR engines, then normalisation.**
1. **Layout.** Split each page into text block, apparatus, footnote, running head and page number, each with a box (Sarvam layout JSON or docling). Only the text block is aligned. The apparatus is kept as evidence and is not parsed in v1 [tooling §4].
2. **OCR with two engines:**
   - **Sarvam Vision** first: Indic-first, with `sa-IN`. Its limits of 10 pages per job and 10 requests a minute give at most about 100 pages a minute.
   - **Mistral OCR 3** (`mistral-ocr-2512`, batch) second.
   - Gemini paid tier as an alternative second engine.
   - Tesseract `tessdata_best` as the free baseline.
3. **Normalisation.** NFC, then vidyut-lipi to SLP1 for comparison.

**Rule 5.**
- Scans of published books are data class `public`, so Sarvam (registered as `opt-out` in `src/providers.mjs`, per `docs/research/sarvam.md`) may receive them.
- Mistral and Gemini have **no entry** in `src/providers.mjs`, so the router refuses them until their terms are recorded.
- Mistral's Labs models may train on inputs under its 5 Aug 2026 terms, so only `mistral-ocr` with zero data retention qualifies.
- The Gemini free tier is excluded.

**Record.** A page record: `{manifestation_sha256, page_no, image_sha256, iiif_canvas?, regions: [{kind, xywh}], ocr: [{engine@version, region, text}], normaliser_version}`.

**Gate.** A bake-off on **50–100 gold pages from our own editions**, hand-transcribed in Label Studio, before committing to engines. No public benchmark covers printed Sanskrit with apparatus. The nearest figures (Hindi chrF++, where Gemini 2.5 Flash scores 86.3; a Sanskrit-manuscript panel at 9.86% CER) are not our material [tooling §4].

**Cost.**
- Sarvam: ₹0.5–1.5 a page (published prices conflict).
- Mistral: $1–2 per 1,000 pages.
- An assumed season of about 5,000 pages comes to about ₹2,500–7,500 plus $5–10.

### 4.5 Align

**Sanskrit OCR → CE.**
1. Convert OCR to SLP1 and strip daṇḍas.
2. Run a character alignment (Needleman–Wunsch) against the pinned Smith adhyāya.
3. Each line gets `{verse_id, char_span, page, xywh, edit_distance}`, and each page gets a CER.

Each line then falls into one of three cases:
- **Both engines match the e-text.** The verse is confirmed in print and gains a page coordinate. This closes DHE-1 for each cited verse.
- **The engines agree with each other but not the e-text.** This is a suspected e-text error and goes to the scholar with the page image. It matters most for the Rāmāyaṇa, which Smith says "still contains many errors". It is also how 07014024c gets settled [sources §1].
- **The engines disagree with each other.** This is OCR noise. Pages above a CER threshold go to review. The threshold is set from the gold set, not guessed.

**Translations → CE.**
- Section boundaries are anchored by hand (done for Ganguli 7.32–7.51 [sources §3]).
- Inside each section, paragraph↔verse links are proposed by multilingual embeddings (LaBSE or similar) against the verse and our English gloss. A person accepts each link.
- Dutt maps through the Chitrashala vulgate numbering.
- Griffith maps canto to sarga.
- No published Ganguli↔CE concordance exists [tooling §5], so ours becomes an asset.

**Tellings → events.** A reader marks scene boundaries in the PD edition and links each scene to a `story.event`, together with the CE locator it retells or departs from.

- **Built.** The hand-made Ganguli table, and the 83-line Book 7 GRETIL/Smith diff (described in [sources §1]; the TSV itself is not in the repo).
- **Record.** An alignment link: `{from: span (manifestation_sha256, page, xywh, char_start, char_end, exact, prefix, suffix), to: {expression, ref} | {event_id}, method: ocr_align | section_anchor | embedding | scene, score, cer?, status: proposed | accepted | rejected, by, at}`. It exports as a W3C annotation.
- **Gate.** A tier-A or tier-B line with no accepted link is not citable. A tier-C scene with no event link cannot back an attestation.
- **Cost.** Compute, plus a few cents for embeddings.

### 4.6 Propose

- **Who proposes.**
  - **Claude in session** reads aligned passages per adhyāya or sarga and writes candidate files. CLAUDE.md: there is no Anthropic key in the pipeline.
  - **LangExtract** (Apache-2.0, character-offset grounding) on the Gemini paid tier would automate this. It needs a key, a `src/providers.mjs` entry and the founder's decision on LLM calls, which has been open since 15 Oct. **Decide.**
  - **Deterministic helpers:**
    - day-marker and *iti*-frame regexes over Book 7 (ordinals with *ahan*/*divasa*, sunrise, sunset, "tomorrow");
    - MCI's CE locators, turned into candidate rows;
    - Sørensen's names, as alias candidates.
- **Record.** `scratch.candidate`: `{origin: llm | regex | finding_aid | viewer | family, model@version?, prompt_sha256?, span, kind (event, participation, relation, epithet+gloss, placement, account, attestation), payload, placement_grade?, season}`.
- **Gates.**
  - The span text must equal the pinned bytes exactly, or the candidate is rejected [tooling §6].
  - Tier-A spans must resolve to a main-text `ord` range.
  - No entity is ever merged automatically.
  - Epithet collisions are flagged: Kṛṣṇa as a name of Arjuna, Pārtha and Kaunteya across the brothers, Droṇa the bird in MCI.
  - A `conventional` placement can become an editorial note only, never a claim.
- **Cost.** Session time. LangExtract runs at roughly tens of dollars per parva [tooling synthesis].

### 4.7 Verify

- **Tool: our own Studio review screen,** extending the Studio of mockups s20–s21.
  - INCEpTION and Label Studio annotate spans well, but they do not write our records (versioned claims, sign-offs pinned to a version, alignment acceptances), and a bridge would cost as much as the screen.
  - Label Studio is kept for the OCR gold set only.
  - **Decide** ([TKG §7.4](temporal-knowledge-graph.md#74-open-questions) Q2).
- **Studio v0:**
  1. **Queue:** per season and kind, sorted by what blocks the next chapter.
  2. **Evidence pane:** the page image with its box, the e-text line, the translation link, and other expressions' readings, side by side.
  3. **Decide:** accept and write the claim statement and translation, edit, merge, or reject with a reason.
  4. **Proof:** checked against the print; quoted verses double-keyed.
  5. **Sign:** the scholar signs a batch per chapter, producing a signed JSON over `{claim_id@version: sha256(statement ‖ targets)}` stored in `records` [methods §6].
- **Built.** Nothing. Claims carry `status: etext` in git, and people carry `review: pending`.
- **Record.** `kn.review` rows plus the signed record asset.
- **Gate.** Rule 9. `signed` is derived from the review rows, and any edit drops the claim back to `etext`.
- **Measures, from week 1:**
  - candidates decided per reviewer-hour;
  - the share accepted unchanged;
  - time from candidate to signed;
  - the backlog by status.

  Monthly review parties clear the proofing backlog. Proofing can be delegated; signing cannot.
- **Cost.** People's time. This is the plan's real cost.

### 4.8 Load

- **Tool.** `pnpm graph:load`, Phase 1 of [TKG §7.1](temporal-knowledge-graph.md#71-phases): Postgres 18, an idempotent loader from git, and claim history replayed from `git log`.
- **Built.** Only `pnpm canon:build`, which writes cited verses, the verse index and variants, and checks Devanagari against Smith UD.
- **To build.** The loader, plus the `src` evidence tables.
- **Gate.** The loader's constraints, run in CI on every PR:
  - the star-passage guard;
  - every story edge supported;
  - an acyclic `event_order`;
  - ticks only with a `dates` support;
  - correctly nested tellings.
- **Cost.** A small Postgres instance hosted in India.

### 4.9 Use

- **Tools.**
  - `facts()`, `claims.search()`, `passage()` and `popular()` ([TKG §6.1](temporal-knowledge-graph.md#61-drafting-only-from-cited-facts));
  - the plan validator (§5.3);
  - the manifest generator;
  - `pnpm web:build`.
- **Built.**
  - The deterministic manifest, with its drift test.
  - The web build, which fails on unresolved claims.
  - `claims-used.mjs`.
- **To build.**
  - The plan validator.
  - The blast-radius report: claim → captions, lines, shots, reveals, pages, manifests.
  - The trivia pipeline (§5.4).
- **Gate.** Finals read `signed` claims only. Drafts may use `etext`.

---

## 5. From the graph to stories

### 5.1 Character bibles

A bible is a projection of cited rows [methods §3]. It has four parts:
- **Names.** Each name is a row `(entity, name, script, lang, kind ∈ {name, epithet, patronymic, metronymic, title}, attested_by, gloss_claim)`.
  - Arjuna's ten names and the etymologies he gives Uttara become ten rows plus their gloss claims. The CE locator is to confirm: vedapath gives 4.39, Ganguli gives section 44.
  - Patronymics are resolved per passage.
  - Sørensen and MCI supply candidates; the verse supplies the claim.
- **Relations** run from a start event to an optional end event:
  - `student_of` begins with Droṇa's instruction;
  - `spouse_of` begins with the 4.67 marriage;
  - `killed_by` is anchored to its event, which carries the day.
- **Attributes** (Gāṇḍīva, white horses, the banner, Devadatta) are relations, each with its own support. An epithet's gloss doubles as evidence for an attribute.
- **Conflicts** are rendered as "CE says X (7.x.y); some manuscripts add Y (\*NNN); popular tellings say Z".

Drafted bible prose goes through `facts()`, with claim ids on every sentence. For the Rāmāyaṇa:
- the revered list (`REVERED`, now including Vāyu and Samudra) is read from `story.entity.revered`;
- the witness is a vānara, never Hanumān.

### 5.2 Story time

- **Placement.** The three grades of §2.5 apply on the war clock of [TKG §2.1](temporal-knowledge-graph.md#21-story-time), where day 13 is ticks `[72, 78)`. Anything that cannot be placed is held as a partial order in `story.event_order`.
- **Relations.** Use Allen and TimeML terms: `before`, `includes`/`during`, and IDENTITY for a retelling (7.41 retells 3.256). The other ten Allen relations are not needed [methods §1].
- **Contested placements** get one account per expression: Bhīṣma's 58 vs 56 days, the night fighting of days 14–15, vulgate vs CE order.
- **No BCE dates.**
- **QA view.** A time map plotting the war tick against the CE `ord`. It exposes, for example, Sañjaya's early report of Droṇa's fall.
- **The Sundara Kāṇḍa** uses an era plus a partial order. `clock_span = NULL` is correct until a season needs a Laṅkā clock.

### 5.3 Storyline and chapter planning

A plan is typed: `window`, `witness`, `cold_open`, `verse`, `scene`, `reveal`, `question` [methods §5]. The **plan validator** checks:
1. Every beat cites signed claims (`etext` is allowed for drafts).
2. **`question(N)` is answered by a claim in `claims(N+1)`.** Example: s1e3 asks, and s1e4 "The gatekeeper" (3.256, 7.41–42) answers.
3. The window is contiguous, or it is a flashback marked by `account.mode`.
4. No reveal repeats within a season.
5. The witness is present or narrates.
6. Rules 1 and 7 hold.

The planning loop:
1. Claude in session enumerates windows.
2. It scores them on centrality, signed-claim density, whether a reveal exists, and continuity.
3. It proposes two or three orderings.
4. A human picks one, and the pick goes in `docs/decisions.md`.
5. The plan is committed under `content/<chapter>/`.

### 5.4 Trivia and hidden details

Items are built **only from signed claims**, by template:
- who / what / which day;
- epithet → entity;
- text vs telling;
- order;
- who told whom.

Then:
1. **Atomic fact check.**
   - Decompose the LLM paraphrase into atomic facts (FActScore-style).
   - Check each fact for entailment against the claim's statement, translation and, where `data_class` allows, the passage.
   - **Any unsupported atom rejects the item.**
   - A second-model judge only advises.
2. **Distractor check across editions.** Distractors come from the graph: same type and era, and false in **every** expression. A vulgate reading, a star passage or a regional version used as a "wrong" answer would be misinformation.
3. **Language lint.**
   - Ban "myth", "wrong", "actually", "debunked" and "really happened".
   - Apply a framing rubric built on the approved pattern "The critical edition's text does not tell it; some manuscripts do (\*259)".
   - Run a sensitivity review: revered figures, caste and community, and traditions that hold the popular version as their own.
   - Note that `docs/product-plan.md` (line 183) says "what the text actually says". The positioning should be reworded.
4. **Sign-off.** The scholar signs each item as a record tied to exact claim versions.

### 5.5 "Tell our scholar" and family tellings

- A report creates a `scratch.candidate` (`origin = viewer`) carrying the clip or reveal and the `manifestId` shown ([TKG §5.2](temporal-knowledge-graph.md#52-canonical-shapes-manifest-schema-v2)). The editor triages it, the scholar answers, and any claim change goes out as a `pub.correction` with a notice. The reporter is credited if they opt in.
- A family telling enters as `origin = family`. It becomes a `pop.*` expression only with consent, and never carries identity ([TKG audience layer](temporal-knowledge-graph.md#audience-layer)).
- Neither ever becomes a claim directly.

---

## 6. Rights and permissions

### 6.1 What we may do now

- **Fetch and hold** full e-texts and scans for internal research, in the cache or a restricted bucket. Never in git or the shared store.
- **Resolve claim ids** against the BORI and Baroda e-texts, and quote single cited verses with attribution, as the repo does today (99 verses plus an index).
  - The repo is public, so this is already a judgment call for Avi [sources].
  - A single chanted śloka is a quotation of the same kind. Its status in a paid product is part of the letters below.
- **Use PD translations and tellings in full** where the edition predates 1931 and the death date is verified: Ganguli via PG (PG marks removed), Griffith, the Dutts, Growse 1883, Pampa 1898, Kṛttivāsa 1903.
- **Use CC0 museum images.**
- **Use MCI and Sørensen locators** as facts. Never their prose.
- **Use Wikidata QIDs**, and contribute CE-referenced statements back.

### 6.2 What needs permission or an answer

| Who | Ask | Status |
|---|---|---|
| BORI (cc John Smith) | Permission to show cited verse text in the app and on the web; to hold the full e-text privately; to serve references and later text via DTS. Covers `bori-ce` and the Harivaṃśa | planned since 4 Oct, not sent |
| Oriental Institute, M. S. University of Baroda (cc Smith; errata contacts Suvarna Deshpande, Pranav Gokhale) | The same for `baroda-ce`, and whether the Institute claims copyright in the constituted text | not sent; **urgent** for the film |
| Cologne / The Sanskrit Library | Which licence governs csl-orig: CC BY-SA 4.0 (LICENSE) or CC BY-NC-SA 3.0 (headers)? | not asked |
| archive.org | Notice before any job over about 10k files | when needed |
| AIIS, Huntington, British Museum | Only for a specific image we need | not planned |

Each answer becomes a `txt.rights_grant` row with valid time and the letter as evidence ([TKG text layer](temporal-knowledge-graph.md#text-layer)). With no grant, the release gate shows no text.

### 6.3 Copyright terms to verify

The rules:
- **India:** life + 60 (s.22); posthumous works, 60 years from publication (s.24, not re-read).
- **US:** works before 1931 are PD; later foreign works are usually protected for 95 years from publication.

Death dates to verify:
- **S. K. De:** 1968 (LoC) vs 1978 (Wikipedia infobox). This sets whether the Droṇaparvan print is protected to the end of 2028 or 2038.
- **BORI general editors** (Sukthankar, Belvalkar) and the editors of books 1, 3, 4 and 14.
- **Baroda editors** G. H. Bhatt and U. P. Shah; **P. L. Vaidya** (Harivaṃśa).
- **Translators:** K. M. Ganguli, M. N. Dutt (≈1912), R. T. H. Griffith (≈1906), F. S. Growse.
- **Editors:** Lewis Rice (Pampa), R. Kinjawadekar.
- **Index and reference authors:** Sørensen, Olesen and Andersen (s.24 likely makes INM PD anyway); E. W. Hopkins (≈1932); M. A. Mehendale; Vettam Mani.
- **C. Rajagopalachari:** 1972, so protected to the end of 2032.
- **Editors of the 1940, 1957 and 1978 Kṛttivāsī printings and the 1968 Telugu printing.**

### 6.4 Questions for Indian counsel

1. **TDM.** s.52 has no explicit text-and-data-mining exception. Is OCR, alignment and extraction over in-copyright prints (the 1958 Droṇaparvan, the Baroda volumes, MCI) research fair dealing under s.52(1)(a)? Does the answer change once the outputs feed a paid product?
2. **Critical texts.** Does a reconstructed critical text, as distinct from its apparatus and introduction, attract copyright? No Indian ruling was found [sources §8].
3. **Quotation.** Is a short quotation of an in-copyright popular telling in a reveal fair dealing as criticism or review?
4. **Public repo.** Is committing cited verses to a public repository distribution?
5. **Photographs.** What are the rules for photographs of ASI-protected reliefs, and for CC BY-SA photographs used as render conditioning?

---

## 7. First three weeks (19 Oct – 8 Nov), ranked

The film opens Friday 6 Nov. Where the two lanes compete for the same person, the Rāmāyaṇa wins. The shared items come first, because both lanes depend on them.

| # | Wk | Work | Delivers |
|---|---|---|---|
| **S1** | 1 | `fetch.mjs`: robots check, UA, rate limit, fail on challenge, crawl log, IA Metadata API with sha1 check | Polite, logged fetching |
| **S2** | 1 | WARC per fetch, SPN2 per cited URL, `evidence` bucket, CDXJ in git; test SPN2 through the proxy | Evidence objects, back-filled for the 12 pinned files |
| **S3** | 1 | Register shape plus its test; scope files `mbh-s1` and `ram-s1` | §3 as data; out-of-scope fetches refused |
| **S4** | 1 | Studio v0: queue, evidence pane, decide, signed-record export | People can review and sign; throughput measured |
| **S5** | 1 | OCR bake-off on 50 gold pages (Droṇaparvan, Ganguli v4; Baroda pages once found); record Mistral (and Gemini) terms in `src/providers.mjs` first | Engine pair and CER threshold, set on our own pages |
| **R1** | 1 | Pin Smith `Ram00`–`07` (UR + UD) and GRETIL `sa_rAmAyaNa.txt`; diff book 5 | Full Rāmāyaṇa index; list of Sundara disagreements |
| **R2** | 1 | Locate the Baroda Sundara print (archive.org, Wikisource, HathiTrust) | A print witness, or a recorded gap and a plan to borrow the volume |
| **R3** | 1 | Send the Baroda and BORI letters | A dated rights question on record |
| **R4** | 1–2 | OCR and align the print for every cited Sundara verse | Page coordinates; e-text errors found or ruled out |
| **M1** | 1 | Switch the MBh parse to Smith UR; pin `Supp07` and the UR/UD indexes for all 18 books | One parser for both epics; full CE index |
| **R5** | 2 | Griffith Book V and Dutt's Sundara volume: canto→sarga map | English parallels for 5.1–5.66 |
| **R6** | 2 | Propose pass over the pilot window; Studio review | Candidate→claim backlog; pointer verses added to scope |
| **M2** | 1–2 | DHE-1: OCR and align the Droṇaparvan 1958 scan for 7.32–7.51 | Volume, page and line for every cited Droṇa verse; a measured CER |
| **R7** | 2 | Kṛttivāsa 1903, Growse 1883, Kamba (after verifying Project Madurai): scene links for 2–3 reveal candidates | Reveals with attributed tellings |
| **M3** | 2 | MCI locators for days 13–14, verified against Smith | Checked finding-aid candidates |
| **M4** | 2 | Day-marker regex over Book 7 | *Stated* placement candidates for days 13–14 |
| **R8** | 2–3 | Cleveland's 38 Rāmāyaṇa folios filtered to Sundara; Met v1.1 | A shippable visual set with rights records |
| **R9** | 3 | Plan validator and language lint; the scholar signs the pilot's claims and items | **Signed Sundara pilot releasable in the week of 6 Nov**, if the scholar starts by about 30 Oct |
| **M5** | 2–3 | Ganguli map extended to day 14 (from 7.52), with the page images | Section map for s1e4–s1e5 |
| **M6** | 3 | Sørensen aliases for the s1 cast from PD scans; locate Dutt's Droṇa volume | Epithet candidates with a CE bridge |
| **M7** | 3 | Pampa 1898: day-13 scene links | A regional telling for the Abhimanyu reveal |
| **M8** | 3 | Wikidata QIDs for both casts | Join keys only |

---

## 8. What we need from the founder

**People**
1. A scholar who can sign Rāmāyaṇa claims by about 30 Oct, and one (or the same) for the Mahābhārata. Rule 9 blocks release until then.
2. A proofreader for double-keying.
3. Part-time scene readers in Bengali, Awadhi/Hindi, Tamil and Kannada, and later Odia, Telugu and Malayalam.

**Permissions**
4. Sign the BORI and Baroda letters this week, and approve the email to Cologne.
5. Brief Indian counsel on the questions in §6.4.

**Keys and accounts** (environment only, rule 8)
6. archive.org S3 keys.
7. A Mistral key, and optionally a Gemini paid-tier key.
8. Opt the Sarvam account out of training.
9. An India-hosted bucket for the evidence layer.

**Decisions**
10. May the pipeline call an LLM API for extraction, or does proposing stay with Claude in session?
11. Our own Studio screen (recommended) or INCEpTION or Payload?
12. Should the public repo keep committing cited verse text before the rights answers arrive?
13. Internal use of the CDSL files while their licence is open (recommended: yes, never shipped).
14. The windows after the Sundara pilot and after day 13.
15. Reword the "actually" line in the product plan.

---

## 9. Gaps and unverified items

**Sources**
- Baroda print scans: not located. Smith's Rāmāyaṇa star passages: unchecked. The Oriental Institute's rights position and its editors' dates: unknown.
- IIT Kanpur: unreachable. Project Madurai files and terms for Kamba and Villi: unopened. Sundaram's translation rights: unverified.
- Dutt's base text: unknown. Whether the 1931 Chitrashala Droṇa volume is PD in the US: borderline.
- MCI: volume 1 only in CDSL. Persons are absent from it. Whether a volume 2 exists digitally: unknown.
- No *Bhāratabhāvadīpa* e-text and no OCR check of it. No Sanskrit Jaiminīya Aśvamedha edition located.
- Wikidata: the Rāmāyaṇa count is unknown (wrong QID used). IndicKG and Kaggle: not searched.
- No Ganguli↔CE concordance exists.
- Fitzgerald, Hiltebeitel, Brockington and the CE introductions on war days and the Sañjaya frame were not retrieved; do not cite them yet.
- Unconfirmed locators:
  - Arjuna's ten names: 4.39 or 44.
  - DHE-1: printed pages for 7.34.19 and 7.48.21.
  - The 07014024c reading.
  - The Jayadrathavadha range.

**Tooling**
- archive.org: no published rate limit; the `total_only` anomaly is unexplained; eGangotri totals are unknown.
- SPN2 through the proxy: untested. perma.cc pricing: unchecked. IA IIIF manifests: unverified.
- No hosted-vendor CER exists for printed Sanskrit with apparatus.
- Sarvam: the price conflicts, and so do its training terms (EULA opt-in vs privacy-policy opt-out; we treat it as opt-out).
- Mistral and Gemini terms are not yet recorded. Bhashini, Document AI and Azure: unchecked.
- vidyut module readiness, LangExtract accuracy on IAST, and GLiNER on Indic names: unmeasured.
- PLOTTER and STORYTELLER were read at abstract level only.
- No precedents found for:
  - a cited AI writers' room;
  - sacred-text trivia with sensitivity review;
  - Indic entailment accuracy (check against the English statement; match Sanskrit by id).

**Rights**
- Every death date in §6.3.
- The Indian TDM position; the s.52 and s.24 wording; ASI photography rules; LACMA's terms.
- The 19 Chakravyūha Commons files, one by one.
- Met v1.1 results for epic objects.
- AIIS terms beyond vmis.in.

**This plan's assumptions**
- The `src` evidence schema is not yet in [TKG](temporal-knowledge-graph.md). It needs a section there and a decision entry.
- `txt.expression.kind` lacks a value for a medieval retelling such as Kṛttivāsa or Pampa: `popular` was meant for TV and comics, and `regional_recension` means a Sanskrit recension. Proposal: add `retelling`.
- The figures of about 5,000 pages per season and a scholar by 30 Oct are planning assumptions, not measurements.
