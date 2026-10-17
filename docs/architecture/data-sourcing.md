# Dheevara data sourcing plan: from archives to the temporal knowledge graph

Status: plan, 17 Oct 2026. The six principles in §2 are the founder's and are decided. Items marked **Decide** need Avi. This is not legal advice.

Inputs, cited inline by short name:
- **[inventory]** `docs/research/notes-2026-10-17-sourcing/source_inventory.md`
- **[tooling]** `docs/research/notes-2026-10-17-sourcing/acquisition_extraction_tooling.md`
- **[methods]** `docs/research/notes-2026-10-17-sourcing/storylines_trivia_methods.md`
- **[sources]** `docs/research/sources.md`, which covers what is already held and the BORI rights analysis. This plan does not repeat it.
- **[TKG]** `docs/architecture/temporal-knowledge-graph.md`, the target data model. This plan links to its tables and does not redefine them.

---

## 1. Summary

- **What this plan covers.** How every fact Dheevara shows gets from a website, an archive scan, a PDF or a printed book into the knowledge graph, with evidence a scholar can check. It covers both epics from today: the Mahābhārata from the Droṇa Parva (day 13, 7.32–7.51, already in the canon for s1e3) and the Rāmāyaṇa from the Sundara Kāṇḍa (Baroda CE book 5: 66 sargas, 2,487 verses, already indexed), timed to the *Ramayana* film on 6 Nov 2026 ([decisions] 17 Oct).
- **We source by season.** Each season writes a scope file: the adhyāyas or sargas it covers, the verses those passages point back to, the translations and tellings that retell them, and the images that depict them. That scope decides what gets fetched. We get breadth by repeating this season after season, not by ingesting whole corpora up front.
- **Two layers that never mix.**
  - The **evidence layer** holds bytes fetched once and never changed: sha256, page and line coordinates, a Wayback capture, our own WARC copy and a crawl log.
  - The **assertion layer** holds versioned claims. Each claim points at exact evidence spans and is signed off by a scholar. It is the knowledge layer already designed in [TKG §3.3](temporal-knowledge-graph.md#33-node-and-edge-types-by-layer).
- **Verse alignment is the spine.** Every line from every source gets a critical-edition verse id as early as possible:
  - OCR of a Sanskrit print is aligned against the e-texts we already hold, which gives a measured error rate on every page for free.
  - Translations get a section→verse map.
  - Regional tellings get scene-level links to story events.
- **Machines propose and people decide.** OCR, alignment, LLM extraction and regex passes all write *candidates* (`scratch.candidate`, [TKG §6.2](temporal-knowledge-graph.md#62-why-an-llm-extracted-graph-is-not-the-system-of-record)). Only an editor turns a candidate into a claim, and only the scholar signs one. Review throughput is the bottleneck, so the Studio review screen gets built in week 1, not later.
- **Disagreement is data.** Each edition and each telling is its own attributed account.
  - War-day placement is graded *stated*, *derived* or *conventional*.
  - A conventional placement is never stored as a claim.
- **Everything compiles downstream.** The chain is graph → chapter plan → manifest → shot contracts → renders. A corrected claim lists every caption, shot and kept reveal that used it.
- **What exists today.**
  - A fetcher that pins URLs by sha256 and fails loudly (`src/canon/fetch.mjs`).
  - Parsers for GRETIL and Smith (`src/ingest/`).
  - 12 pinned files in `content/canon/sources.json`.
  - 99 cited verses (52 MBh, 47 Rām) and 43 claims.
  - The rest of this plan is still to build.
- **First three weeks.** Both lanes run, with the Rāmāyaṇa ranked first because of the film date. The main deliverables:
  - shared fetch, preserve and OCR tooling;
  - a Studio review screen, v0;
  - a print-verified, signed Sundara Kāṇḍa pilot;
  - page coordinates for every cited Droṇaparvan verse (DHE-1).
- **What blocks the 6 Nov date.** A named scholar who can sign Rāmāyaṇa claims by about 30 Oct, plus four other founder actions (§8).

---

## 2. The approach

### 2.1 Source by season, not by corpus

Each season has a scope file that sits beside its chapters. The proposed location is `content/seasons/<season>/scope.json`, with season ids taken from [TKG `prod` Season](temporal-knowledge-graph.md#production-layer), e.g. `mbh-s1` and `ram-s1`. The file lists four things:

1. **Core window.** The CE passages the season tells.
2. **Pointer verses.** Passages the core retells, recalls or depends on. They are found by the propose step as accounts with `mode = recalled | retold` ([TKG §2.1.1](temporal-knowledge-graph.md#211-narration-frames-tellings)), and get added to scope as they are found.
3. **Retellings.** Translations, commentaries and regional tellings, each with the parts of it that cover the window.
4. **Visual references.** Images that depict the window.

The fetcher acquires only what a scope file names. The register (§3) can list a source long before any season asks for it, but nothing is OCR'd, aligned or proposed until a season's scope includes it.

| | `mbh-s1` (Droṇa, day 13) | `ram-s1` (Sundara Kāṇḍa) |
|---|---|---|
| Core window | 7.32–7.51 (Abhimanyuvadha sub-parvan; MCI maps it to "Adhyāyas 7. 32-51" [inventory §1]): 20 adhyāyas, 643 CE verses | 5.1–5.66: 66 sargas, 2,487 CE verses (from `content/canon/ram/verse-index.json`) |
| Pointer verses already cited | 1.213 (birth), 3.132 (heard from the womb), 3.256 (Jayadratha's boon, retold at 7.41), 4.67 (marriage), 14.65–69 (Parīkṣit) | none yet. The 15 Maināka claims all sit in 5.1. Hanumān's recollections will add Araṇya and Kiṣkindhā pointers |
| Apparatus | 7.34.18\*259 (womb passage) and CE App. I No. 8 (the Vyāsa consolation, Ganguli L–LXXI) [sources §3] | Smith's Rāmāyaṇa star passages: not checked [inventory §2 gaps] |
| Translations | Ganguli XXXI–XLIX and LXXII–LXXIII (map in [sources §3]); Dutt's Droṇa volume (to locate) | Griffith Book V (PG #24869); Dutt's Sundara volume |
| Tellings (tier C) | Pampa, Sāraḷā Dāsa, Telugu MBh, each for its day-13 episode | Kṛttivāsa (Sundarā kāṇḍa), Growse's *Mānas* (Sundar Kāṇḍ), Kamba (Sundara Kāṇḍam), Ezhuthachan |
| Next window | Day 14, Jayadrathavadha (from 7.52; range to confirm from MCI's sub-parvan entry) | Yuddha Kāṇḍa opening (6.1ff.), or back into Kiṣkindhā; **Decide** after the film |

### 2.2 Two layers that never mix

**Evidence layer.** This layer is append-only and holds bytes and their coordinates:
- an evidence object for every fetched file (fields in §4.3);
- a page record for every scan page;
- an evidence span for every quotable piece: file sha256, page, IIIF/`xywh` box, line, character offsets, and the exact quote with prefix and suffix (W3C `TextQuoteSelector` + `TextPositionSelector` + `FragmentSelector` [tooling §5–6]).

Nothing in this layer is ever edited. A re-fetch that returns different bytes makes a new object. In [TKG](temporal-knowledge-graph.md#22-textual-time) terms, an evidence object is a `txt.manifestation` with its sha256, and its bytes live in the object store ([TKG §4.5](temporal-knowledge-graph.md#45-object-store)).

**Assertion layer.** This layer holds:
- `kn.claim` / `kn.claim_version` / `kn.claim_target`;
- `story.*` facts with their `kn.support`;
- popular attestations (`pa.*`);
- `kn.review` sign-offs.

All of these are defined in [TKG §3.3 and §4.3](temporal-knowledge-graph.md#33-node-and-edge-types-by-layer). An assertion points *down* into the evidence layer. Nothing points the other way, so editing a claim can never change an evidence span.

**What TKG does not have yet.** TKG has no table for the evidence layer below `txt.manifestation`: page records, evidence spans, alignment links and the crawl log. §4 gives their fields. They belong in a `src` (source) schema next to `txt`, and TKG should gain a short section for them. This is a proposal, not yet in the architecture document.

### 2.3 Verse alignment is the spine

A line that has no CE verse id cannot support a claim, so alignment happens straight after extraction, before any LLM sees the text. There are three methods, from the most to the least exact:

| Source kind | Method | What it yields |
|---|---|---|
| Sanskrit print of a text we hold as e-text (BORI Droṇaparvan, Baroda Sundara) | Character alignment of the OCR output against Smith/GRETIL for the expected adhyāya | Verse id, page and box per line, plus a **measured CER** per page |
| Translation (Ganguli, Dutt, Griffith) or vulgate (Nīlakaṇṭha) | Section→verse map: hand-anchored at the section boundaries, then embedding-proposed inside them, then human-accepted | Many-to-many links, each with a score and a status |
| Regional telling (Kṛttivāsa, Pampa, …) | Scene-level link to a `story.event`, with the CE locator of the episode it diverges from | Event links, not verse links |

### 2.4 Machines propose, people decide

Every automated step writes to the evidence layer (OCR and alignment) or to `scratch.candidate` (proposals). Only three kinds of person write assertions:
- the **editor** registers a claim;
- the **proofreader** marks it `proofed`;
- the **scholar** signs it.

These roles follow [methods §6] and [TKG §2.3](temporal-knowledge-graph.md#23-knowledge-system-time-bitemporal). The Studio review screen is where people work through candidates, so its throughput (candidates decided per hour) sets how fast the graph grows. We measure it from week 1 (§4.8).

### 2.5 Disagreement is data

- Each edition, recension, translation and telling is its own `txt.expression`.
- A fact two sources disagree on gets one `story.account` per source, each with its own claim or attestation. The two are never averaged into one value.
- Ranks follow the Wikidata pattern [methods §3]:
  - **preferred**: `bori-ce` / `baroda-ce` main text;
  - **normal**: other expressions, shown with their label;
  - **deprecated**: only our own withdrawn versions.
- Popular tellings are never ranks on a claim. They stay `pa.*`.
- War-day placement is graded:
  - **stated**: a verse names the day or boundary, cited with `kn.support.role = 'dates'`;
  - **derived**: counted from stated anchors along `story.event_order` edges, with the tick computed rather than asserted;
  - **conventional**: the parvan-to-day schema (Bhīṣma 1–10, Droṇa 11–15 …). It is never stored as a claim; at most it appears as a popular attestation or an editorial note [methods §2].

### 2.6 Everything compiles downstream

Every downstream artifact is a projection: the chapter plan (`content/<ch>/plan.json`), the manifest ([TKG §5.1](temporal-knowledge-graph.md#51-the-chapter-manifest-becomes-a-projection)), shot contracts, web experiences and renders. A corrected claim is a new `kn.claim_version`, and the blast-radius query (TKG Q3) lists what used the old version: captions, narration lines, shot contracts, kept reveals and web pages. Today `src/canon/claims-used.mjs` already finds every claim id used under `content/`, and the web build fails on an unresolved id. That is the seed of this query. A correction produces new versions of everything it touches, and it never rewrites anything already released.

---

## 3. Source register

### 3.1 Tiers

| Tier | Meaning | May support | Example |
|---|---|---|---|
| **A, the text** | Critical-edition constituted text | `kn.claim_target` (main text only, [TKG §4.4](temporal-knowledge-graph.md#44-the-star-passage-guard)) | `bori-ce`, `baroda-ce`, Harivaṃśa CE |
| **B, scholarship** | Translations, commentaries, indexes, lexicons, studies | Glosses, translations, finding aids, apparatus notes. A tier-B source can *lead to* a claim but never *be* its target | Ganguli, MCI, Nīlakaṇṭha |
| **C, popular telling** | "What many heard": regional poems, comics, TV | `kn.popular_attestation` only | Kṛttivāsa, Amar Chitra Katha |
| **D, pointer** | Leads and join keys | Nothing. Ids and leads only | Wikidata, Wikipedia |

### 3.2 Rules that apply to every row

1. **An archive.org uploader's rights mark is never rights evidence.** A `licenseurl` of CC0, PDM or CC BY-NC-ND set by an uploader is recorded and ignored. We have already seen it on scans of BORI, Amar Chitra Katha, Rajaji and Mani [sources §5; inventory §5, §7]. What counts as evidence:
   - a scanning centre's `possible-copyright-status: NOT_IN_COPYRIGHT`;
   - a publication date we have verified, plus an author's death date we have verified;
   - a licence text we hold by sha256.
2. **Locators get converted to CE before use.** A Calcutta, vulgate or recension locator (Sørensen, Mani, Dutt, Griffith) is a lead until it is converted to a CE id through the alignment of §2.3.
3. **Every row names its verse-mapping method.** If it cannot name one, it is tier D.

**Status values:** *held* (pinned in `content/canon/sources.json` today), *next* (in a season scope within three weeks), *later*, *excluded*.

### 3.3 Mahābhārata lane

| Source | Tier | Format | Rights (one line) | Verse mapping | Status |
|---|---|---|---|---|---|
| Smith CE e-text, `text/UD` (Devanagari) books 1, 3, 4, 7, 14 | A | plain text, 9-char ids | (C) BORI; "Please do not provide copies" [sources §2] | native CE | **held** (as `devanagariCheck`) |
| Smith CE `text/UR` (ISO 15919) books 1–18 + `apps/UR/SuppNN.txt` | A (+ apparatus) | plain text | same | native CE; star passages `07*0259_01` | **next**: becomes the parse source in place of GRETIL [sources §0, §9.1] |
| GRETIL `mbh_NN_u.htm` books 1, 3, 4, 7, 14 | A (cross-check) | HTML, `07,034.019a` | defers to the BORI terms | native CE; 83 Book 7 lines differ from Smith [sources §1] | **held** (parse source today) |
| BORI CE print scans, Droṇaparvan 1958 (`in.ernet.dli.2015.407869`, 826 pp, among others) | A (print witness) | scans; DLI OCR unusable | print may be protected to 2028/2038 (De's death date conflicts); uploader CC0 irrelevant | OCR→e-text alignment | **next** (DHE-1: page coordinates) |
| Harivaṃśa CE (Vaidya, BORI 1969), GRETIL TEI + App. I | A | TEI | BORI print + GRETIL CC BY-NC-SA 4.0 | native CE + star | later (Kṛṣṇa material) |
| Ganguli, PG #15475 + scans `mahabharataofkri04royp` | B | PG text; scans NOT_IN_COPYRIGHT | PD (1883–96) [sources §9.2] | section map; done by hand for 7.32–7.51 | **held** (researched; not pinned in `sources.json`) |
| M. N. Dutt prose MBh (1895–1905), `aproseenglishtr00duttgoog`, DLI parvan volumes | B | scans only | PD in the US; India on Dutt's death (≈1912, unverified) | numbered vulgate verses → vulgate→CE map | **next** (Droṇa volume to locate) |
| Nīlakaṇṭha *Bhāratabhāvadīpa*, Chitrashala 1929–36 (Droṇa 1931: `cRkp_…`) | B (later layer; vulgate numbering) | scans; no e-text | commentary PD; Kinjawadekar's editorial matter unverified; 1931 is borderline for the US | vulgate chapter/verse → CE map | later (needed to bridge Mani and Dutt) |
| Mehendale, *MBh Cultural Index* (CDSL `mci.txt`) | B (finding aid) | tagged text, 2,643 records | print in copyright (1993); digital: CC BY-NC-SA 3.0 header vs CC BY-SA 4.0 LICENSE | **cites the CE directly** (`7. 32. 13`), records war days | **next** (locators only, never its prose) |
| Sørensen, *Index to the Names* (CDSL `inm.txt`; DLI scans `in.ernet.dli.2015.98210`) | B (aliases) | tagged text; scans | print PD (1904–25); digital layer carries the same licence conflict | Calcutta locators → Ganguli → CE | **next** (take the text from the PD scans; CDSL file as internal lookup only) |
| Vettam Mani, *Purāṇic Encyclopaedia* (CDSL `pe.txt`) | B, pointer only | tagged text | in copyright (1975; US to ≈2070) | vulgate chapter → CE | later, pointer only |
| Monier-Williams 1899, Apte 1890 (CDSL `mw`, `ap90`) | B (lexical) | tagged text | print PD; digital NC/SA conflict | n/a (glosses) | **next**, internal only until Cologne answers |
| Hopkins, *Epic Mythology* 1915 | B | scans (`epicmythology00hopkuoft`, NOT_IN_COPYRIGHT) | US PD; India PD if he died before 1966 (1932 unverified) | vulgate | later |
| DCS CoNLL-U (Hellwig) | B (morphology) | CoNLL-U | CC BY 4.0 on GitHub, CC BY 3.0 on the site | counter is not CE; drifts [sources §7] | later (lemmas only) |
| Pampa Bhārata (1898 Bibliotheca Carnatica, `india.history.resource.111026`) | C | scans | work PD; 1898 edition pre-1931 | scene-level | **next** (day-13 scenes) |
| Sāraḷā Dāsa MBh (`odia-mahabharata`) | C | scans; no rights field | work PD; edition date to verify | scene-level | later |
| Āndhra Mahābhāratamu (palm-leaf `bwoz-232-…`; 1968 revised print `andhramahabharat025923mbp`) | C | scans | work PD; the 1968 printing may be protected | scene-level | later |
| Kannada Jaimini Bhārata (Lakṣmīśa; 1852 Sanderson tr. `jaiminibharataa00sandgoog`, NOT_IN_COPYRIGHT) | C | scans | PD | scene-level, against Aśvamedha episodes absent from the CE | later (no day-13 content) |
| Villiputhurar (Project Madurai) | C | e-text (unverified) | Project Madurai terms unverified | scene-level | later |
| Rajaji, ACK, B. R. Chopra 1988 | C, cite only | — | in copyright; archive.org PD/CC0 marks are false | by issue, episode or timestamp | cite only; never reproduce |
| Van Buitenen, Debroy, Fitzgerald | B, consult only | — | in copyright | CE | consult; quote within fair dealing only |
| Wikidata (224 MBh items, 13.7% of statements referenced) | D | SPARQL | CC0 | none | **next**, QIDs only, never as evidence |

### 3.4 Rāmāyaṇa lane

| Source | Tier | Format | Rights (one line) | Verse mapping | Status |
|---|---|---|---|---|---|
| Smith Baroda CE `text/UR/Ram05.txt` + `text/UD/Ram05.txt` | A | plain text, 8-char ids `5001089a` | no licence stated; "still far from correct" [inventory §2] | native CE | **held** (book 5) |
| Smith `Ram00`–`Ram07` (UR + UD), plus star passages if published | A | plain text | same | native CE | **next** (all books for the verse index; Ram00 for provenance) |
| GRETIL `sa_rAmAyaNa.xml` / `.txt` (Tokunaga, Smith 1st rev.) | A (cross-check) | TEI, txt `R_1,001.001` | CC BY-NC-SA 4.0 (GRETIL's wrapper) | native CE | **next** (Smith-vs-GRETIL diff, as done for MBh 7) |
| Hellwig rev. 2–3 (`sa_vAlmIki-rAmAyaNa-rev-2-3.xml`) | A (cross-check, kāṇḍas 2–3) | TEI | CC BY-NC-SA 4.0 | CE, with "occasional minor corrections according to the Southern recension" | later |
| Baroda CE print volumes (Oriental Institute, 1960–75) | A (print witness) | scans **not yet located** | editorial copyright possible (Bhatt, Shah; death dates unverified) | OCR→e-text alignment | **next**: locate. Every cited Rām verse needs a print check, because Smith's text is error-prone |
| Griffith, PG #24869 (+ DLI `in.ernet.dli.2015.217237`, `…217235`) | B | PG text (verse); scans | PD (1870–74) | Benares-recension cantos → Baroda sargas (canto-level map) | **next** (Book V) |
| M. N. Dutt prose Rāmāyaṇa 1891–94 | B | scans (uploader PDM ignored; pre-1931 date is the evidence) | PD | vulgate → CE | **next** (Sundara volume) |
| Goldman et al., Princeton (CE-based) | B, consult only | — | in copyright | CE | consult for the scholar |
| Hari Prasad Shastri | **excluded** | — | US probably protected; credible allegation it is translated from Roussel [inventory §3] | — | excluded |
| IIT Kanpur Valmiki (southern recension) | C/D | web (unreachable 17 Oct) | terms unverified | southern numbering, **not CE** | later, never as CE |
| Kṛttivāsī Rāmāyaṇa (DLI `in.ernet.dli.2015.291061`, 1903) | C | scans | work PD; 1903 printing pre-1931 | scene-level | **next** |
| Growse, *Rámáyana of Tulsi Dás* 1883 (HathiTrust 002721438; Wikisource DjVu) | C (with a PD English) | scans; Wikisource `Page:` | PD | scene-level; Wikisource page + revision id as anchor | **next** |
| Kamba Rāmāyaṇam (Project Madurai) | C | e-text (unverified) | work PD; Project Madurai terms unverified; Penguin's new English is in copyright | scene-level | **next**: verify the files and terms |
| Ezhuthachan, *Adhyātma Rāmāyaṇam Kilippāṭṭu* (palm-leaf `zbzh-173-…`) | C | scans | work PD; uploader marks ignored | scene-level | later |
| Ramanand Sagar *Ramayan* 1987, ACK Rāmāyaṇa issues | C, cite only | — | in copyright | episode or issue + timestamp or page | cite only |
| Wikidata Rāmāyaṇa items | D | SPARQL | CC0 | none | **next** (count unknown: the earlier query used a wrong QID) |

### 3.5 Images (both lanes)

| Source | Rights | Use | Status |
|---|---|---|---|
| Cleveland Museum of Art Open Access API (`cc0=1&has_image=1`: 11 MBh, 38 Rām hits) | CC0 | Shippable visual references. Several titles name the kāṇḍa and chapter (e.g. 2013.306, "Chapters 50 and 51 of the Aranya Kanda"), so they link at scene level | **next** |
| Met Open Access | CC0 for public-domain works | Same. The client must use `/public/collection/v1.1/search` (v1 retired 1 Oct 2026) | **next** |
| Smithsonian Open Access (incl. National Museum of Asian Art) | CC0 | Same | later |
| Wikimedia Commons (`Category:Chakravyuha`, 19 files; `Kurukshetra War (Angkor Wat)`; `Ramayana in art`) | per file | Only after a per-file licence check. A CC BY-SA photo of a relief may make a conditioned render a derivative, so flag it before use as a render input | **next**, file by file |
| British Museum | CC BY-NC-SA 4.0 | **Excluded** from anything shipped and from render conditioning | excluded |
| AIIS, Huntington | scholarly only; AIIS bars commercial publicity | **Excluded** unless a written licence is obtained | excluded |

Every image gets an evidence object (the API record snapshot plus the image bytes, both by sha256) and a `prod.asset`-style rights note. Rule 1 still governs what an image may be used for: no deity close-up as a reference for a shot.

---

## 4. The pipeline, stage by stage

```
register → acquire → preserve → extract → align → propose → verify → load → use
 (rows)    (bytes)   (witness)   (text)   (CE ids) (scratch)  (people)  (SQL)  (projections)
```

### 4.1 Register

- **Tool:** a register file per source. The proposal is to extend `content/canon/sources.json` from editions to all sources, or to add `content/canon/register/*.json`. Today `sources.json` holds two editions (`bori-ce`, `baroda-ce`) and 12 pinned files with notices and a rights paragraph.
- **Built today:** the editions shape. **To build:** fields for tier, kind, mapping method, rights evidence and status, plus a test.
- **Record:** `{source_id, title, work, expression_kind (TKG txt.expression.kind), tier, manifestations[], rights: {summary, evidence_kind: scan_centre_status | pubdate+deathdate | licence_text | permission_letter | none, evidence_ref, verified_by, date}, uploader_marks (recorded, ignored), mapping_method, seasons[], status}`.
- **Gate:** a test fails if any source in a season scope has no register row, if a row's `rights.evidence_kind` is an uploader mark, or if a tier-A or tier-B row lacks a mapping method.
- **Cost:** none.

### 4.2 Acquire

- **Tools:**
  - **archive.org.** The Metadata API is used per item. The Scraping API (cursor-based) is used for discovery past advancedsearch's 10k cap. Use advancedsearch `numFound` for counts, because `total_only` returned 3128 for every query [tooling §1]. Files are downloaded from `/download/<id>/<file>`.
  - **Project Gutenberg.** Fetch through mirrors or the harvest feed, never by crawling the main site.
  - **Wikisource and Commons.** The MediaWiki API.
  - **Museums.** The CMA Open Access API and Met v1.1.
  - **Already-pinned e-texts.** Direct URL fetch, as today.
- **Built today:** `src/canon/fetch.mjs`. It fetches each pinned URL into the gitignored `.cache/canon/`, checks the sha256 and throws on a mismatch. It does no robots check, keeps no crawl log and makes no WARC. One small fix: its error message says "GRETIL returned" even for Smith URLs.
- **To build:**
  - Read robots.txt first (RFC 9309) and store its sha256.
  - User-Agent `DheevaraCorpusBot/0.1 (+contact)`.
  - One request per second per host, or the Crawl-delay if larger.
  - Back off on 429 and 503.
  - On a 403 challenge, **fail loudly with no retry and no workaround** (the Cloudflare, DCS proof-of-work and CAPTCHA cases [tooling §7]).
  - For archive.org, check IA's own `sha1` from `/metadata/<id>` before computing ours.
  - Email info@archive.org before any job over about 10k files.
- **Record:** a crawl-log line, appended as JSONL to `content/canon/crawl-log/` [tooling §7]: `{ts, url, method, status, bytes, sha256, robots_ok, robots_txt_sha256, user_agent, delay_ms, purpose (season + source_id), warc_file, wayback_ts, ia_id?, ia_sha1?}`.
- **Gate:** no fetch outside a season scope. A sha256 mismatch on a pinned file fails, as today. A `robots_ok = false` fails.
- **Cost:** none, apart from time. The scale per season is hundreds of files, not thousands.

### 4.3 Preserve

- **Tools:**
  - `warcio` (a Python sidecar wrapping the same request, so the WARC holds the exact bytes we hashed), or a Node WARC writer.
  - SPN2 with archive.org S3 keys: `if_not_archived_within=30d`; limits 7 captures/min, 30k/day and 5 per URL per day [tooling §2].
  - CDX lookups to record the capture.
- **Built today:** nothing. **To build:** all of it. SPN2 reachability through this environment's proxy is untested. The Wayback Machine reset connections on 4 Oct [sources §3], which is why we keep our own WARC as well.
- **Where it lives:** an object-store bucket `evidence`, next to the `assets`, `records` and `cache` buckets of [TKG §4.5](temporal-knowledge-graph.md#45-object-store). BORI and Baroda full texts go in the restricted area TKG describes. Git holds only the CDXJ index and the hashes. A copy goes to the Drive folder "Dheevara — Build Output" only for deliverables, not for raw evidence.
- **Record:** the evidence object, `{sha256, bytes, media_type, source_url, retrieved_at, http: {status, last_modified, etag}, warc: {file, offset}, wayback: {ts, spn_job_id} | {error}, ia: {id, file, sha1, metadata_snapshot_sha256}?, rights_hint (recorded only)}`. This becomes a `txt.manifestation` row when loaded.
- **Gate:** an evidence object without a WARC record is incomplete. A missing Wayback capture is allowed but recorded as an error, never left silently empty.
- **Cost:** storage of about $1–5 a month at 100–200 GB [tooling synthesis]. SPN2 is free.

### 4.4 Extract

**E-texts** go through deterministic parsers.
- **Built:** `src/ingest/gretil.mjs` (GRETIL MBh HTML, star passages kept apart) and `src/ingest/smith.mjs` (Smith files, both epics, ISO 15919 → IAST).
- **Still to build:**
  - Smith `apps/` (Supp) files;
  - GRETIL TEI (Harivaṃśa, the Rāmāyaṇa cross-check);
  - a PG text parser that keeps section and canto headings (Ganguli, Griffith);
  - a CDSL record parser (`<L>…<LEND>`, `{@…@}`, page breaks `[Page…]`) for MCI and INM.

**Scans** go through layout, then OCR, then normalisation.
1. **Layout.** Split each page into text block, apparatus, footnote, running head and page number, each with a box. Use Sarvam's layout JSON or docling. Only the text block feeds alignment. The apparatus is kept as evidence and not parsed in v1 [tooling §4].
2. **OCR, two engines** on every text block:
   - **Sarvam Vision** is primary: Indic-first, 23 languages including `sa-IN`. Its limits are 10 pages per PDF job and 10 requests a minute, so about 100 pages a minute at best.
   - **Mistral OCR 3** (`mistral-ocr-2512`, batch) is second.
   - The Gemini paid tier is an alternative second engine.
   - Tesseract `tessdata_best` is the free baseline.
3. **Normalise.** Unicode NFC, then vidyut-lipi to SLP1 for comparison.

Rule 5 and the router:
- Scans of published books are data class `public`, so Sarvam (registered as `opt-out` in `src/providers.mjs`, per `docs/research/sarvam.md`) may receive them.
- Mistral and Gemini **have no entry in `src/providers.mjs`**, so the router refuses them until their terms are recorded. This is deliberate. Note that Mistral's Labs/experimental models may train on inputs under its 5 Aug 2026 terms; only `mistral-ocr` with ZDR qualifies. The Gemini free tier is excluded.
- Set Sarvam's account to opt out of training anyway (§8).

- **Record:** a page record, `{manifestation_sha256, page_no, image_sha256, iiif_canvas?, regions: [{kind, xywh}], ocr: [{engine, engine_version, region, text, confidence?}], normaliser_version}`.
- **Gate:** before any engine is committed, run a bake-off on a **gold set of 50–100 pages** from our own editions (BORI Droṇaparvan; a Ganguli page-image volume; Baroda Sundara once found), hand-transcribed in Label Studio. No public benchmark covers printed Devanagari Sanskrit with apparatus [tooling §4]. The nearest figures are Hindi chrF++ (Gemini 2.5 Flash 86.3) and a Sanskrit-manuscript panel (Gemini 3.1 Pro 9.86% CER). Neither is our material.
- **Cost:** Sarvam ₹0.5–1.5 a page (the published prices conflict); Mistral $1–2 per 1,000 pages. A season of about 5,000 pages (two Sanskrit volumes, a translation volume and three tellings: our estimate) costs about ₹2,500–7,500 on Sarvam plus about $5–10 on Mistral.

### 4.5 Align

**Sanskrit OCR → CE.**
- Take the text-block OCR, convert it to SLP1, strip daṇḍas and punctuation, and align it at character level (Needleman–Wunsch) against the pinned Smith text for the expected adhyāya.
- Each OCR line gets `{verse_id, char_span, page, xywh, edit_distance}`, and each page gets a CER.
- Each line then falls into one of three cases:
  1. **Both engines match the e-text.** The verse is confirmed in print, and we gain its page coordinate. This closes DHE-1 for every cited verse.
  2. **Both engines agree with each other but not with the e-text.** Treat this as a suspected e-text error and send it to the scholar with the page image. This matters most for the Rāmāyaṇa, because Smith says it "still contains many errors". It is how the GRETIL-vs-Smith disagreement at 07014024c [sources §1] would be settled.
  3. **The engines disagree with each other.** Treat it as OCR noise. Above a per-page CER threshold, the page goes to review. The threshold is set from the gold set, not guessed here.

**Translations → CE.**
- First anchor section boundaries by hand. This is already done for Ganguli 7.32–7.51 [sources §3].
- Inside each section, propose paragraph↔verse links by multilingual embedding similarity (LaBSE or similar), against the CE verse and our English gloss.
- A person accepts each link.
- Dutt's numbered vulgate verses go through the Nīlakaṇṭha/Chitrashala numbering. Griffith's cantos map to Baroda sargas at canto level.
- No published Ganguli↔CE concordance was found [tooling §5 gaps]. Ours becomes a reusable asset.

**Regional tellings → events.**
- A reader of the language marks scene boundaries in the PD edition (page, plus canto and verse where printed).
- Each scene is linked to a `story.event`, with the CE locator of the episode it retells or departs from.

- **Built today:** the hand table for Ganguli 7.32–7.51 and the 83-line GRETIL/Smith diff for Book 7 (`sources/gretil_vs_smith_book07_diff.tsv`, referenced in [sources §1]). Everything else is to build.
- **Record:** an alignment link, `{from: evidence_span (manifestation_sha256, page, xywh, char_start, char_end, exact, prefix, suffix), to: {expression, ref} | {event_id}, method: ocr_align | section_anchor | embedding | scene, score, cer?, status: proposed | accepted | rejected, by, at}`. On export it maps to a W3C annotation [tooling §5].
- **Gate:** a tier-A or tier-B line with no accepted link cannot be cited as evidence. A tier-C scene with no event link cannot back an attestation.
- **Cost:** compute only, plus small embedding charges.

### 4.6 Propose

- **Who proposes:**
  - **Claude in session** reads aligned passages per adhyāya or sarga and writes candidate files. This is how planning works today: CLAUDE.md says there is no Anthropic key in the pipeline.
  - **LangExtract** (Apache-2.0, character-offset grounding) on the Gemini paid tier would automate this. It needs a Gemini key, a `src/providers.mjs` entry and the founder's decision that the pipeline may call an LLM API, which is still open from [decisions] 15 Oct. **Decide.**
  - **Deterministic helpers:**
    - a regex pass over Book 7 for day markers (ordinals with *ahan*/*divasa*, sunrise and sunset, "tomorrow") and *iti* frames;
    - MCI's CE locators parsed into candidate rows (vyūhas, war days, places);
    - Sørensen's names as alias candidates, with locators bridged Calcutta → Ganguli → CE.
- **What a candidate can be:** an event, participation, relation, epithet (with its in-text gloss), placement (graded stated, derived or conventional), account (with mode), or popular attestation.
- **Record:** `scratch.candidate` ([TKG §6.2](temporal-knowledge-graph.md#62-why-an-llm-extracted-graph-is-not-the-system-of-record)), with `{origin: llm | regex | finding_aid | viewer | family, model@version?, prompt_sha256?, evidence_span, kind, payload, placement_grade?, season}`.
- **Gates:**
  - The span text must equal the pinned bytes exactly, or the candidate is rejected. This is the cheap test [tooling §6].
  - The span must resolve to a main-text `ord` range for tier A.
  - Entities resolve against the register with **no auto-merge**.
  - Epithet collisions are flagged. Examples: Kṛṣṇa used for Arjuna, Pārtha and Kaunteya across the brothers, and the bird called Droṇa in MCI.
  - A `conventional` placement can be proposed, but it can only be promoted to an editorial note, never to a claim.
- **Cost:** in-session work is free in money. LangExtract on the Gemini paid tier costs "tens of dollars per full parva" (not computed precisely [tooling synthesis]).

### 4.7 Verify

- **Tool: our own Studio review screen.** It extends the Studio of mockups s20 and s21. Generic tools such as INCEpTION and Label Studio do span annotation well, but they do not write our records: `kn.claim_version`, `kn.review` sign-offs pinned to a version, or alignment acceptances. A bridge to them would cost as much as the screen. The plan is therefore:
  - Label Studio for one job only, the OCR gold set;
  - Studio for everything else.
  - **Decide**, since this is [TKG §7.4](temporal-knowledge-graph.md#74-open-questions) Q2.
- **Studio v0 screens:**
  1. **Candidate queue,** per season and kind, sorted by what blocks the next chapter.
  2. **Evidence pane:** the page image with the box drawn, the e-text line, the translation link and the other expressions' readings, side by side.
  3. **Decide:** accept and write the claim (statement and translation), edit, merge into an existing claim, or reject with a reason.
  4. **Proof:** text checked against the print. Quoted verses are double-keyed.
  5. **Sign:** the scholar signs a batch per chapter. The output is a signed JSON over `{claim_id@version: sha256(statement ‖ targets)}` with scholar id, method and date, stored in `records` and referenced by `kn.review` [methods §6].
- **Built today:** nothing for claims. Claims carry `status: etext` and people `review: pending` in git.
- **Record:** `kn.review` rows ([TKG §4.3](temporal-knowledge-graph.md#43-ddl-sketch-core-tables)) plus the signed record asset.
- **Gate:** rule 9. `signed` is derived from review rows, and any edit drops the status back to `etext` ([TKG §2.3](temporal-knowledge-graph.md#23-knowledge-system-time-bitemporal)).
- **Throughput measures, from week 1:**
  - candidates decided per reviewer-hour;
  - the share accepted unchanged;
  - time from candidate to signed;
  - backlog by status.
  
  Hold monthly "review parties" for the `etext → proofed` backlog. Proofing can be delegated; signing cannot [methods §6].
- **Cost:** people's time. This is the real cost of the whole plan.

### 4.8 Load

- **Tool:** `pnpm graph:load`, Phase 1 of [TKG §7.1](temporal-knowledge-graph.md#71-phases): Postgres 18, an idempotent loader from git, and claim history replayed from `git log`.
- **Built today:** nothing. Git JSON is the authoring surface, and `pnpm canon:build` writes only cited verses, a verse index and variants, with the Devanagari cross-check.
- **To build:** the loader, plus the evidence-layer tables of §2.2.
- **Gate:** the loader constraints:
  - the star-passage guard;
  - every story edge supported by a claim;
  - `event_order` acyclic;
  - ticks only with a `dates` support;
  - tellings correctly nested.
  
  CI runs the loader on every PR.
- **Cost:** a small India-hosted Postgres instance.

### 4.9 Use

- **Tools:** the `facts()` / `claims.search()` / `passage()` / `popular()` agent tools ([TKG §6.1](temporal-knowledge-graph.md#61-drafting-only-from-cited-facts)), the plan validator (§5.3), the manifest generator, and `pnpm web:build`.
- **Built today:** the manifest from the plan (deterministic, drift-tested), the web build that fails on unresolved claims, and `claims-used.mjs`.
- **To build:** the plan validator, the blast-radius report (claim → captions, lines, shots, reveals, web pages, manifests), and the trivia pipeline (§5.4).
- **Gate:** finals read only `signed` claims. Drafts may use `etext`.

---

## 5. From the graph to stories

### 5.1 Character bibles

A bible is a projection of cited rows, never a free-text profile [methods §3].

- **Names.** One row per name: `(entity, name, script, lang, kind ∈ {name, epithet, patronymic, metronymic, title}, attested_by claim, gloss_claim)`.
  - Arjuna's ten names, with the etymologies he gives Uttara, are ten rows plus their gloss claims. The CE locator is to confirm: vedapath gives adhyāya 39, Ganguli section 44.
  - Patronymics are resolved per passage, never globally.
  - Sørensen and MCI supply alias *candidates*; the verse supplies the claim.
- **Relations with time.** These are `story.relation` rows from a start event to an optional end event. Examples: `student_of` from Droṇa's instruction; `spouse_of` from the 4.67 marriage; `killed_by` anchored to the event, which carries the day. Ticks are used only where the text gives them.
- **Attributes.** Each is a relation with its own support: Gāṇḍīva, white horses, the monkey banner, Devadatta. An epithet's gloss doubles as attribute evidence (Śvetavāhana → white horses).
- **Conflicts.** Shown as ranked accounts: "CE says X (7.x.y); some manuscripts add Y (\*NNN); popular tellings say Z."
- **Drafting.** Prose bibles are drafted only through `facts()`, with claim ids on every sentence, and checked by the validator of [TKG §6.1](temporal-knowledge-graph.md#61-drafting-only-from-cited-facts).
- **Rāmāyaṇa.** The same shape applies. The revered list (`REVERED` in `src/contract/rules.mjs`, now including Vāyu and Samudra) is read from `story.entity.revered`. Hanumān is never the witness: the Maināka experience's witness is a vānara on Mahendra.

### 5.2 Story time

- **Eras, clock and order.** Placement uses the three tiers of §2.5 on the war clock of [TKG §2.1](temporal-knowledge-graph.md#21-story-time). Day 13 is ticks `[72, 78)`. Events that cannot be placed on the clock are ordered by `story.event_order`.
- **Vocabulary.** Borrow TimeML/Allen terms rather than invent new ones: `before`, `includes`/`during` (for `part_of`), and IDENTITY for a retelling, such as 7.41 retelling 3.256 [methods §1]. The full 13 relations are not needed.
- **Contested placements** become one account per expression: the 58 vs 56 days of Bhīṣma's wait, the night fighting of days 14 and 15, vulgate vs CE ordering.
- **Not modelled:** absolute (BCE) dates [methods §2].
- **QA view:** a time map plotting the war tick against the CE `ord`. It shows Sañjaya's early report of Droṇa's fall against the later narration of the days before it.
- **Rāmāyaṇa.** The Sundara Kāṇḍa needs a clock only if a season places events by night and day in Laṅkā. Until then it uses an era plus partial order, and `clock_span = NULL` is correct for most events.

### 5.3 Storyline and chapter planning

A chapter plan is a typed object: `window`, `witness`, `cold_open`, `verse`, `scene`, `reveal`, `question` [methods §5]. A **plan validator** (same shape as the citation validator) enforces:

1. Every beat references signed claims, or `etext` for drafts only.
2. **`question(N)` is answered by a claim in `claims(N+1)`**, as s1e3 "The way in" → s1e4 "The gatekeeper" (3.256, 7.41–42) does today.
3. The window is contiguous in story time, or it is a flashback marked by `account.mode`.
4. No reveal repeats within a season.
5. The witness is present at the events, or narrates them.
6. Rules 1 and 7 hold.

Planning works in five steps:
1. Claude in session enumerates candidate windows from the season's event graph.
2. It scores them by protagonist centrality, signed-claim density, whether a reveal exists, and continuity.
3. It proposes two or three orderings with rationales.
4. A human picks one, and the pick goes in `docs/decisions.md`.
5. The plan is committed under `content/<chapter>/`.

### 5.4 Trivia and hidden details

The sequence is select → template → paraphrase → decompose → check → review [methods §4].

- **Select.** Items are built only from **signed** claims, using templates: who/what/which day; which name (epithet → entity); text vs telling (claim + `pa.*` + optional star passage); order; who told whom.
- **Atomic fact check.**
  1. The LLM paraphrase is split into atomic facts (FActScore-style).
  2. Each fact is checked for entailment against the claim's statement and translation, and against the passage where `data_class` allows.
  3. **Any unsupported atom rejects the item.** Zero tolerance, not a threshold.
  4. A second-model judge advises; it does not decide.
- **Distractor check across editions.** Each distractor comes from the graph: same type, same era, and not true for the slot in **any** expression. A distractor that is a vulgate reading, a star passage or a regional telling's version turns a quiz into misinformation. So distractors are checked against every expression, not just the CE.
- **Language lint in QC.**
  - A banned-phrase list: "myth", "wrong", "actually", "debunked", "really happened".
  - A framing rubric. The approved pattern is "The critical edition's text does not tell it; some manuscripts do (\*259)" ([TKG §3.3](temporal-knowledge-graph.md#text-layer)).
  - Sensitivity review covers revered figures, caste and community references, and regional traditions that hold the "popular" version as their own.
  - Note: `docs/product-plan.md` §183 says "what the text actually says". The lint would flag that line if it were copy, and the positioning line should be reworded.
- **Sign-off.** The scholar signs each item as a record tied to the exact claim versions it uses.

### 5.5 "Tell our scholar" and family tellings

- An in-app report creates a `scratch.candidate` with `origin = viewer`. It carries the clip or reveal and the `manifestId` shown ([TKG §5.2](temporal-knowledge-graph.md#52-canonical-shapes-manifest-schema-v2) adds it to "Report a mistake"). The editor triages it and the scholar answers.
- If the claim changes, a `pub.correction` goes out with a public notice, and the reporter is credited if they opt in.
- A family telling enters as a candidate with `origin = family`. It can become a `pop.*` expression and a popular attestation only with consent, never with identity ([TKG §3.3, audience layer](temporal-knowledge-graph.md#audience-layer)).
- No viewer or family text ever becomes a claim directly.

---

## 6. Rights and permissions

### 6.1 What we may do now

- **Fetch** and hold full e-texts and scans for internal research, in the gitignored cache or the restricted bucket. Never in the shared store, and never in git.
- **Resolve claim ids internally** against BORI and Baroda e-texts, and quote single cited verses as citations with attribution. This is what the repo does today: 99 verses and a verse index.
  - The repo is public, so even this is a judgment call for Avi [sources, pipeline note].
  - A single chanted śloka in a released chapter is a quotation of the same kind. Whether that holds for a monetised product is part of the BORI and Baroda letters.
- **Use PD translations and tellings in full** where the edition is pre-1931 and the translator's or editor's death date is verified: Ganguli via PG (with PG marks removed), Griffith, the Dutts, Growse 1883, Pampa 1898 and Kṛttivāsa 1903.
- **Use CC0 images** from Cleveland, Met OA and Smithsonian.
- **Use MCI and Sørensen locators** (facts, not expression) as finding aids. Never reproduce their prose.
- **Use Wikidata QIDs** as join keys (CC0). We may also contribute CE-referenced statements back.

### 6.2 What needs permission or an answer

| Who | Ask | Covers | Status |
|---|---|---|---|
| BORI (copy John Smith) | Written permission to show cited verse text (Devanagari and IAST) in the app and on the web, to hold the full e-text in a private database, and to serve references (and later text) via DTS | `bori-ce`, Harivaṃśa CE | planned since 4 Oct; not sent |
| Oriental Institute, M. S. University of Baroda (copy Smith; errors go to Suvarna Deshpande or Pranav Gokhale) | The same for the Baroda CE Rāmāyaṇa. Also: does the Institute claim copyright in the constituted text? | `baroda-ce` | not sent; **urgent** for the film pilot |
| Cologne / The Sanskrit Library (CDSL, csl-orig) | Which licence governs: the CC BY-SA 4.0 LICENSE file or the CC BY-NC-SA 3.0 headers? | MW, Apte, INM, MCI, PE digitisations | not asked |
| GRETIL | None needed if we use Smith as the source. GRETIL's TEI files are NC, so use them for cross-checks only | — | — |
| archive.org | Advance notice before any job over about 10k files | bulk scans | when needed |
| AIIS, Huntington, British Museum | Only if a specific image is needed | images | not planned |

Every answer becomes a `txt.rights_grant` row with valid time and the letter as an evidence asset ([TKG §3.3](temporal-knowledge-graph.md#text-layer)). Until a grant exists, the release gate refuses to show text.

### 6.3 Copyright terms to verify (death dates)

India: life + 60 (s.22); posthumous works, 60 years from publication (s.24, not re-read). US: published before 1931 = PD; later foreign works are usually protected 95 years from publication (URAA).

| Person | Why it matters | Known / claimed |
|---|---|---|
| S. K. De (Droṇaparvan ed.) | Whether the 1958 print is protected to the end of 2028 or 2038 | 1968 (LoC; Wikipedia lead) vs 1978 (Wikipedia infobox) |
| BORI general editors (Sukthankar, Belvalkar) and the editors of books 1, 3, 4, 14 | Joint-authorship term | unverified |
| G. H. Bhatt, U. P. Shah (Baroda Rām.) | Baroda print term | unverified |
| P. L. Vaidya (Harivaṃśa) | Harivaṃśa print term | unverified |
| K. M. Ganguli | Translation (almost certainly PD in India regardless) | unverified |
| M. N. Dutt | Both Dutt translations | ≈1912, unverified |
| R. T. H. Griffith | Rāmāyaṇa translation | ≈1906, unverified |
| F. S. Growse; Lewis Rice (Pampa 1898) | Edition terms | unverified |
| Sørensen, Olesen, Andersen | INM (posthumous) | unverified; s.24 likely makes it PD regardless |
| E. W. Hopkins | *Epic Mythology*, India | ≈1932, unverified |
| R. Kinjawadekar | Chitrashala editorial matter | unverified |
| M. A. Mehendale | MCI print | believed 2010s, unverified |
| Vettam Mani | PE | unverified (in copyright on any plausible date) |
| C. Rajagopalachari | Cite-only status | 1972, so protected to the end of 2032 if that date holds |
| Editors of the 1940/1957/1978 Kṛttivāsī and 1968 Telugu printings | Avoid those printings until checked | unverified |

### 6.4 Questions for Indian counsel

1. **Text and data mining.** The Copyright Act s.52 has no explicit TDM exception [tooling §7 gaps]. Does OCR, alignment and extraction over in-copyright prints (the 1958 Droṇaparvan, the Baroda volumes, MCI) for internal research fall under fair dealing for research (s.52(1)(a))? Does it change once the outputs feed a commercial product?
2. **Critical editions.** Does a reconstructed critical text, as distinct from its apparatus and introduction, attract copyright in India? No Indian ruling was found [sources §8].
3. **Fair dealing** for short quotations of in-copyright popular tellings in reveals (criticism and review). The s.52 wording was not re-read this session.
4. **Public repo.** Is committing cited verses to a public GitHub repo distribution?
5. **Relief photographs** from ASI-protected monuments (Halebidu, Ellora), and CC BY-SA photographs used as render conditioning.

---

## 7. First three weeks (19 Oct – 8 Nov), ranked

The film opens on Friday 6 Nov. The Rāmāyaṇa lane is ranked first wherever the lanes compete for the same person. Shared items come first because both lanes depend on them.

### 7.1 Shared, week 1 (19–25 Oct)

| # | Work | Delivers |
|---|---|---|
| S1 | Extend `fetch.mjs`: robots check, UA, rate limit, fail on 403 challenge, crawl-log JSONL, archive.org Metadata API with IA sha1 check | Every fetch from here on is logged and polite |
| S2 | Preserve: WARC per fetch, SPN2 per cited URL, the `evidence` bucket, CDXJ index in git; test SPN2 through the proxy | An evidence object for each held file, back-filled for the 12 pinned files |
| S3 | Source register shape plus a test; season scope files `mbh-s1`, `ram-s1` | §3's tables as data; nothing fetched out of scope |
| S4 | Studio v0: candidate queue, evidence pane, accept/reject, signed-record export | People can decide candidates and sign; throughput is measured |
| S5 | OCR bake-off: 50 gold pages (25 BORI Droṇaparvan, 25 Ganguli v4; Baroda pages added once found), transcribed in Label Studio; Sarvam vs Mistral vs Tesseract; record the Mistral (and Gemini, if wanted) terms in `src/providers.mjs` first | A chosen engine pair and a CER threshold, from our own pages |

### 7.2 Rāmāyaṇa lane

| # | When | Work | Delivers |
|---|---|---|---|
| R1 | wk 1 | Pin Smith `Ram00`–`Ram07` (UR + UD) and GRETIL `sa_rAmAyaNa.txt`; diff Smith vs GRETIL for all of book 5 | Full Rāmāyaṇa verse index; a list of Sundara lines where the two disagree |
| R2 | wk 1 | Locate Baroda CE print scans (Sundara volume) on archive.org, Wikisource and HathiTrust; register their rights evidence | A print witness, or a recorded gap and a request to borrow the print |
| R3 | wk 1–2 | OCR + align the print for every cited Sundara verse (the 47 held, then the pilot's) | Page coordinates; e-text errors found or ruled out for each cited verse. This is the check Smith's warning requires |
| R4 | wk 1 | Send the Oriental Institute Baroda letter (with BORI's) | A rights question on record, dated |
| R5 | wk 2 | Griffith Book V (PG #24869) and Dutt's Sundara volume: canto→sarga map for 5.1–5.66 | English parallel links for the whole kāṇḍa |
| R6 | wk 2 | Propose pass over the pilot window (Claude in session): events, participations, epithets, recalled accounts; Studio review | Candidate → claim backlog for the pilot; pointer verses added to `ram-s1` scope |
| R7 | wk 2 | Tier C for the reveal: Kṛttivāsa 1903, Growse 1883, Kamba (verify Project Madurai first): scene links for 2–3 reveal candidates | Reveal candidates with attributed tellings |
| R8 | wk 2–3 | Cleveland CC0 Rāmāyaṇa folios (38) filtered to Sundara scenes, plus Met v1.1 | A shippable visual reference set with rights records |
| R9 | wk 3 | Plan validator + language lint; pilot plans validated; scholar signs the pilot's claims and items | **Signed Sundara pilot ready to release in the week of 6 Nov** (rule 9), if the scholar is in place by about 30 Oct |

### 7.3 Mahābhārata lane

| # | When | Work | Delivers |
|---|---|---|---|
| M1 | wk 1 | Switch the MBh parse to Smith UR (the step [sources] names) and pin `Supp07`; keep GRETIL as cross-check; pin UR/UD indexes for all 18 books | One parser for both epics; a full CE verse index; star passages from Smith's apparatus |
| M2 | wk 1–2 | DHE-1: OCR + align the 1958 Droṇaparvan scan for 7.32–7.51 | Printed volume, page and line for every cited Droṇa verse; a measured print-vs-e-text CER |
| M3 | wk 2 | Parse MCI and verify its CE locators for day 13–14 against Smith (vyūhas, war-day mentions, sub-parvans) | Finding-aid candidates, each checked against a verse |
| M4 | wk 2 | Day-marker regex over Book 7 (*ahan*/*divasa* ordinals, sunrise, sunset) | Candidates for *stated* placements on days 13–14; the rest graded *derived* |
| M5 | wk 2–3 | Extend the Ganguli map to day 14 (from 7.52) using PG #15475 and the `mahabharataofkri04royp` page images | A section map ready for s1e4–s1e5 |
| M6 | wk 3 | Sørensen aliases for the s1 cast from the PD scans; locate Dutt's Droṇa volume | Name and epithet candidates with a CE bridge |
| M7 | wk 3 | Pampa (1898): day-13 scene links | One regional telling for the Abhimanyu reveal |
| M8 | wk 3 | Wikidata QIDs for the s1 cast and the Sundara cast | Join keys on `story.entity` (no statements imported) |

---

## 8. What we need from the founder

**People**
1. **A scholar who can sign Rāmāyaṇa claims by about 30 Oct**, and the same or a second scholar for the Mahābhārata. Nothing can be released before then (rule 9).
2. A proofreader for double-keying quoted verses against print.
3. Part-time readers for scene marking: Bengali (Kṛttivāsa), Awadhi/Hindi (Mānas), Tamil (Kamba), Kannada (Pampa), later Odia, Telugu and Malayalam.

**Permissions**
4. Sign the letters to BORI and to the Oriental Institute, Baroda, this week. Approve the email to Cologne about the CDSL licence.
5. Instruct Indian counsel on the §6.4 questions.

**Keys and accounts** (environment only, rule 8)
6. archive.org S3 keys, for SPN2 and bulk download.
7. A Mistral API key (OCR second engine). Optionally, a Gemini paid-tier key.
8. Opt the Sarvam account out of training.
9. An India-hosted object-store bucket for the evidence layer.

**Decisions**
10. May the pipeline call an LLM API for extraction (LangExtract on the Gemini paid tier), or does proposing stay with Claude in session? (Open since 15 Oct.)
11. Build our own Studio review screen (recommended) or adopt INCEpTION or Payload ([TKG §7.4](temporal-knowledge-graph.md#74-open-questions) Q2).
12. Whether the public repo keeps committing cited verse text before the rights answers arrive.
13. Whether the CDSL files may be used internally as lookups while the licence question is open (recommended: yes, never shipped).
14. The `ram-s1` window beyond the pilot, and the next window after day 13.
15. Reword the product-plan line "what the text actually says" to fit the framing lint.

---

## 9. Gaps and unverified items

These come from the research notes and from this plan. None of them has been resolved.

**Sources and texts**
- Baroda CE Rāmāyaṇa print scans: not searched for specifically. Smith's Rāmāyaṇa star passages: not checked. The Oriental Institute's copyright position and its editors' death dates: unverified [inventory §2].
- IIT Kanpur Valmiki: unreachable on 17 Oct; licence unknown.
- Project Madurai files and terms for Kamba and Villi: not opened. The P. S. Sundaram translation's rights: unverified [inventory §5].
- Which base text M. N. Dutt translated is unknown. Whether the 1929–31 Chitrashala volumes are pre-1931 for US purposes: unchecked (Droṇa is 1931).
- MCI: whether volume 2 (persons, weapons, places) exists in CDSL. The header says volume 1 only. Main heroes do not appear as persons in volume 1.
- No e-text of the *Bhāratabhāvadīpa*, and no OCR quality check on it. No Sanskrit Jaiminīya Aśvamedha edition was located.
- The Wikidata Rāmāyaṇa item count is unknown (wrong QID used). IndicKG and Kaggle datasets: not searched.
- No published Ganguli↔CE concordance. Fitzgerald, Hiltebeitel, Brockington and the BORI CE introductions on the war-day count and the Sañjaya frame were not retrieved and must not be cited until checked [methods §2].
- The CE locator of Arjuna's ten names (4.39 vs Ganguli 44): unverified.
- The printed BORI volume and page for 7.34.19 and 7.48.21 (DHE-1) are still unverified, and so is 07014024c.
- The Jayadrathavadha CE range (day 14) is to confirm.

**Tooling**
- archive.org: no published rate limit; the Scraping API `total_only` anomaly is unexplained; eGangotri totals across its accounts are unknown.
- SPN2 through this environment's proxy: untested. perma.cc pricing: unchecked. IA IIIF manifests: unverified.
- OCR: no hosted-vendor CER exists for printed Devanagari Sanskrit with apparatus.
  - Sarvam's prices conflict (₹0.5 vs ₹1.5 a page).
  - Sarvam's training terms contradict each other: the EULA says opt-in; the privacy policy says used unless you opt out. We treat them as opt-out [`docs/research/sarvam.md`].
  - Mistral and Gemini terms are not yet in `src/providers.mjs`.
  - Bhashini OCR status: unverified.
  - Google Document AI and Azure pricing: unfetched.
- Alignment and extraction:
  - Which vidyut Python modules are production-ready is unconfirmed.
  - LangExtract's span accuracy on IAST and Sanskrit is unmeasured.
  - GLiNER's performance on Indic names is unknown.
  - Recogito Studio's hosting is unchecked.
- Story planning: PLOTTER and STORYTELLER were read at abstract level only. There is no precedent for an AI writers' room with mandatory citation, and none for trivia generation over sacred texts with a sensitivity review.
- No published entailment accuracy for Indic-language claim checking. Run the checks over the English statement and translation, and match Sanskrit by id.

**Rights and law**
- All the death dates in §6.3.
- The Indian TDM position; the s.52 and s.24 wording (not re-read); ASI photography rules; LACMA's terms.
- The 19 Chakravyūha Commons files: not licence-checked one by one.
- Met v1.1 search: not yet run for epic objects.
- AIIS terms beyond vmis.in: not found.

**This plan's own assumptions**
- The proposed `src` evidence schema (page record, evidence span, alignment link, crawl log) is not yet in [TKG](temporal-knowledge-graph.md). It needs a section there and a decision entry.
- TKG's `txt.expression.kind` has no value for a medieval retelling such as Kṛttivāsa or Pampa: `popular` was designed for TV and comics, and `regional_recension` means a recension of the Sanskrit. Proposal: add `retelling`.
- The season page estimate of about 5,000 pages and the 30 Oct scholar date are our planning assumptions, not measured figures.
