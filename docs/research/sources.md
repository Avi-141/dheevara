# Mahābhārata source corpora and licences

## What the pipeline does with this (added by the pipeline session, 2026-10-04)

- **Canon v0 parses GRETIL's file.** We checked it against Smith's current text: the five lines that differ in 7.32–7.51 (7.32.11, 7.49.6, 7.50.65, 7.50.78, 7.51.2) are not among the verses we cite.
- **Smith's BORI-checked Devanagari files (`text/UD/`) are pinned as a cross-check.** `pnpm canon:build` fails unless every cited verse's Devanagari, transliterated from GRETIL's IAST, equals Smith's line. All 35 match.
- **Rights.** Only the verses our claims cite are committed, as citation quotations with attribution, plus a verse-count index; the full e-texts stay in the gitignored `.cache/`. The repo is public on GitHub, so even this is a judgment call for Avi. Shipping verse text in the app needs BORI's written permission.
- **Next canon step:** switch the parse source to Smith's UR files, with an ISO 15919→IAST mapping, before the canon grows past s1e3.
- **Ganguli:** for English, use Project Gutenberg #15475, not sacred-texts. Cite it by Ganguli's own section numbers, never as a CE verse.

## Exa (reference corpus)

- **Pricing** (https://exa.ai/pricing, retrieved 2026-10-04): Search from $4 per 1,000 requests, Contents $1 per 1,000 pages per content type, Deep Search $12–15 per 1,000. The plan's figure of $2.50 per 1,000 searches is out of date.
- **Training on queries.** Exa's Privacy Policy (https://exa.ai/privacy-policy, last updated 29 June 2026) says: "Query Data is used to improve our products and technology, including by training and fine-tuning models that power our Services". `src/providers.mjs` therefore marks Exa `trainsOnInputs: yes`, and no unreleased passage, nor any query quoting one, may go to it (rule 5). Zero data retention is offered on Enterprise plans only (pricing page).

Research for Dheevara canon v0 (Droṇaparvan 7.32–7.51 plus books 1, 3, 4, 14).
**Every URL below was retrieved on 2026-10-04** unless a line says otherwise. Quotes are verbatim. Where something could not be checked, it says **unverified** and what was tried.

---

## 0. Short answer

| Need | Use | Why | Rights in one line |
|---|---|---|---|
| CE Sanskrit with verse ids | **John Smith's Unicode Roman files**, `https://bombay.indology.info/mahabharata/text/UR/MBh07.txt` (and MBh01/03/04/14), with `.../apps/UR/Supp07.txt` for star passages | The authorised text. Book 7 last updated 22 Sep 2026; declared final on 14 Jun 2026. Ids look like `07034019a`. | (C) BORI. "Please do not provide copies of the text to others." Internal citation lookup is fine; shipping verse text publicly needs BORI's permission. |
| Fallback or cross-check | GRETIL `mbh_07_u.htm` (already parsed by `src/ingest/gretil.mjs`) | Same e-text in IAST, but an older snapshot (file dated 4 Apr 2016): 83 lines in Book 7 differ from Smith's current text, 5 of them in 7.32–7.51 | "COPYRIGHT AND TERMS OF USAGE AS FOR SOURCE FILE", so the same BORI terms apply |
| Public-domain English | **Ganguli, Project Gutenberg #15475** (Vol. 2, Books 4–7), `https://www.gutenberg.org/ebooks/15475.txt.utf-8`; page images from archive.org `mahabharataofkri04royp` | Same ISTA transcription as sacred-texts. PG says "Public domain in the USA." Sacred-texts' terms explicitly free Project Gutenberg from their non-commercial clause. | Text published 1883–1896, so public domain. Remove the PG name and licence if you redistribute. |

**Finding that matters for the chapter:** the womb passage at 7.34.18 is **star passage 259\***, inserted only in the Kashmiri manuscripts K1.2. The CE constituted text does not contain it. GRETIL's file prints it **inline** as `07,034.018*0259_01–04`, right between the speaker line and 7.34.18a, so a careless parser would put it into the canon. `src/ingest/gretil.mjs` already keeps star passages apart. Ganguli (vulgate/Bengal text) does not have it either.

---

## 1. GRETIL (Göttingen)

**What it holds.** "a resource platform providing standardized machine-readable texts in Indian languages that have been contributed by various individuals and institutions" (https://gretil.sub.uni-goettingen.de/gretil.html; the root https://gretil.sub.uni-goettingen.de/ is a meta-refresh to `gretil.html`). The index page says "Last Update: 10.09.2020".

**MBh entry (same page, `#MBh`), verbatim:** "Mahabharata (input by Muneo Tokunaga)", "revised version by John Smith, Cambridge" (links to http://bombay.indology.info/), then one file per book and "Mahabharata 1-18 (mbh1-18u.zip)". It also says: "For other formats / encodings see: TITUS (restricted download / proprietary format) | "Sanskrit Documents"".

**Download URLs (all HTTP 200, `text/html` UTF-8):**

| Book | URL | Bytes | Last-Modified |
|---|---|---|---|
| 1 Ādi | https://gretil.sub.uni-goettingen.de/gretil/1_sanskr/2_epic/mbh/mbh_01_u.htm | 1,954,426 | Mon, 04 Apr 2016 15:17:39 GMT |
| 3 Āraṇyaka | https://gretil.sub.uni-goettingen.de/gretil/1_sanskr/2_epic/mbh/mbh_03_u.htm | 1,980,413 | Mon, 04 Apr 2016 15:17:38 GMT |
| 4 Virāṭa | https://gretil.sub.uni-goettingen.de/gretil/1_sanskr/2_epic/mbh/mbh_04_u.htm | 772,377 | Mon, 04 Apr 2016 15:17:38 GMT |
| 7 Droṇa | https://gretil.sub.uni-goettingen.de/gretil/1_sanskr/2_epic/mbh/mbh_07_u.htm | 1,665,210 | Mon, 04 Apr 2016 15:17:37 GMT |
| 14 Āśvamedhika | https://gretil.sub.uni-goettingen.de/gretil/1_sanskr/2_epic/mbh/mbh_14_u.htm | 746,495 | Mon, 04 Apr 2016 15:17:38 GMT |
| 1–18 zip | https://gretil.sub.uni-goettingen.de/gretil/1_sanskr/2_epic/mbh/mbh1-18u.zip | 5,050,952 | Thu, 02 Oct 2003 10:21:58 GMT |

The zip holds one file, `MBH1-18U.HTM` (16,841,768 bytes, dated 2003-10-02, CRLF line ends), in the same line format. 7.34.19 reads the same in it as in `mbh_07_u.htm`.

**Formats offered.** For the MBh, **HTML only**. The index offers TEI XML and plain-text "transformations" for texts already converted, but lists none for the MBh. Probing `gretil/corpustei/sa_mahAbhArata.xml`, `sa_mahAbhArata-07.xml` and `sa_mahAbhArata-07-droNaparvan.xml` returned 404. The directory `.../2_epic/mbh/` returns 403, so it cannot be listed.

**Encoding and script.** The header says "Text converted to Unicode (UTF-8)". Checked: valid UTF-8, NFC-normalised, **IAST** (`ṃ` for anusvāra, `ṛ` for vocalic r). Avagraha is the ASCII apostrophe U+0027 (`yogo 'nīkasya`). It is not Devanagari, Velthuis or CSX. GRETIL's CSX/REE formats are "deprecated and will be discontinued" (index intro).

**Verse-id convention** (observed in `mbh_07_u.htm`): `BB,CCC.VVVp<TAB>text<BR>`.
- `07,034.019a`: book 07, adhyāya 034, verse 019, first half-line (pādas a+b). `c` is the second half-line, and `e` appears for three-line verses. A capital letter (`A`) marks prose.
- No letter means a speaker line: `07,034.018<TAB>abhimanyur uvāca`.
- Star passage (apparatus, not constituted text): `07,034.018*0259_01`.
- Appendix I passage: `07,004.001d@001_0001`.
- The form `07034019a` (no comma or dot) is **Smith's** convention (§2), not GRETIL's.
- Counts for Book 7: 173 adhyāyas, 8,152 CE verses, 16,712 CE half-lines, 3,423 star lines, 1,912 appendix lines. Book 1: 225 adhyāyas, 7,197 verses. Book 3: 299, 10,316. Book 4: 67, 1,824. Book 14: 96, 2,743. Books 1 and 14 also have star lines numbered under chapter `000`, before chapter 1. Smith's files have the same adhyāya counts (225 and 96).

**Verbatim lines from `mbh_07_u.htm`** (`<TAB>` = one tab character):

```
07,034.016a<TAB>abhimanyo varaṃ tāta yācatāṃ dātum arhasi<BR>
07,034.016c<TAB>pitṝṇāṃ mātulānāṃ ca sainyānāṃ caiva sarvaśaḥ<BR>
07,034.017a<TAB>dhanaṃjayo hi nas tāta garhayed etya saṃyugāt<BR>
07,034.017c<TAB>kṣipram astraṃ samādāya droṇānīkaṃ viśātaya<BR>
07,034.018<TAB>abhimanyur uvāca<BR>
07,034.018*0259_01<TAB>śṛṇu rājan mahābāho vacanaṃ mama suvrata<BR>
07,034.018*0259_02<TAB>purā garbhagate vāpi cakravyūhapraveśanam<BR>
07,034.018*0259_03<TAB>mukhāt kṛṣṇasya rājendra śrutam asmi mayā prabho<BR>
07,034.018*0259_04<TAB>tasmād vyūhaṃ praviśyāmi cakrākhyaṃ nṛpasattama<BR>
07,034.018a<TAB>droṇasya dṛḍham avyagram anīkapravaraṃ yudhi<BR>
07,034.018c<TAB>pitṝṇāṃ jayam ākāṅkṣann avagāhe bhinadmi ca<BR>
07,034.019a<TAB>upadiṣṭo hi me pitrā yogo 'nīkasya bhedane<BR>
07,034.019c<TAB>notsahe tu vinirgantum ahaṃ kasyāṃ cid āpadi<BR>
07,034.020<TAB>yudhiṣṭhira uvāca<BR>
07,034.020a<TAB>bhindhy anīkaṃ yudhā śreṣṭha dvāraṃ saṃjanayasva naḥ<BR>
07,034.020c<TAB>vayaṃ tvānugamiṣyāmo yena tvaṃ tāta yāsyasi<BR>
07,034.021a<TAB>dhanaṃjayasamaṃ yuddhe tvāṃ vayaṃ tāta saṃyuge<BR>
07,034.021c<TAB>praṇidhāyānuyāsyāmo rakṣantaḥ sarvatomukhāḥ<BR>

07,048.022a<TAB>tasmiṃs tu nihate vīre bahv aśobhata medinī<BR>
07,048.022c<TAB>dyaur yathā pūrṇacandreṇa nakṣatragaṇamālinī<BR>
```

(Lines 3724–3741 and 4803–4804 of the file. The 7.34.16 lines are included for context.)

**Licence and terms.**
- *Per-file header* (identical in books 1, 4, 7 and 14), verbatim:
  ```
  % Mahabharata: Dronaparvan
  % Electronic text (C) Bhandarkar Oriental Research Institute,
  % Pune, India, 1999
  % On the basis of the text entered by Muneo Tokunaga et al.,
  % revised by John Smith, Cambridge, et al.
  THIS GRETIL TEXT FILE IS FOR REFERENCE PURPOSES ONLY!
  COPYRIGHT AND TERMS OF USAGE AS FOR SOURCE FILE.
  ```
  Book 3 adds: `% Appendix 21A not included!`
- *General site statement:* **none found.** `gretil.html` contains no match for "licen", "copyright", "permission", "non-commercial" or "terms". `hist.html` has none either. I did not find a "research and teaching only" sentence anywhere on the site, so that phrasing is **unverified** for GRETIL as of today.
- *TEI files only:* the TEI-converted texts carry a CC licence in their header. Verbatim, from https://gretil.sub.uni-goettingen.de/gretil/corpustei/sa_mAdhva-mahAbhAratatAtparyanirNaya.xml (`<date when-iso="2020-07-31"/>`):
  > This e-text was provided to GRETIL in good faith that no copyright rights have been infringed. If anyone wishes to assert copyright over this file, please contact the GRETIL management at gretil(at)sub(dot)uni-goettingen(dot)de. The file will be immediately removed pending resolution of the claim.
  > `<licence target="https://creativecommons.org/licenses/by-nc-sa/4.0/">`Distributed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.`</licence>`

  **This does not cover the MBh.** The MBh is not in TEI on GRETIL, and its own header defers to the source file's terms (§2: BORI copyright).

**GRETIL is stale against Smith.** I normalised GRETIL's IAST to Smith's ISO 15919 (ṃ→ṁ, ṛ→r̥, ṝ→r̥̄, ḷ→l̥, `'`→`’`) and compared Book 7 line by line. Both have the same 17,066 line ids, and **83 lines differ**. Full list: `sources/gretil_vs_smith_book07_diff.tsv`. The five inside 7.32–7.51:

| id | GRETIL (2016) | Smith (2026-09-22) |
|---|---|---|
| 07032011a | …pr̥tanāris **tahārjunaḥ** | …pr̥tanāris **tathārjunaḥ** |
| 07049006c | …**saṁkye**… | …**saṁkhye**… |
| 07050065c | …mr̥tyuṁ **prapnuyāmeti**… | …mr̥tyuṁ **prāpnuyāmeti**… |
| 07050078a | **āho svid**… | **āhosvid**… |
| 07051002a | **vyāḍhānīkaṁ**… | **vyūḍhānīkaṁ**… |

Most of the 83 look like GRETIL typos that were fixed later. At least one goes the other way and needs a human eye: 07014024c, where GRETIL has `śakrāśanir ivopamaḥ` and Smith has `śakrāśaniravopamaḥ` (unverified against the printed volume).

---

## 2. John Smith's e-text (bombay.indology.info)

**Pages:** https://bombay.indology.info/ · https://bombay.indology.info/mahabharata/statement.html · https://bombay.indology.info/mahabharata/welcome.html (main text) · https://bombay.indology.info/mahabharata/apps.html (supplementary passages). `https://bombay.indology.info/mahabharata/` itself returns 403.

**What it is** (statement.html, verbatim): "Based on John Smith's revision of Prof. Muneo Tokunaga's version of the text, it was subjected to detailed checking by a team of assistants based in the Bhandarkar Oriental Research Institute (BORI) in Pune, and is made available with BORI's agreement." The home page calls it "the official, authoritative electronic text of the Sanskrit epic Mahābhārata".

**Status** (welcome.html, verbatim): "Sunday, June 14, 2026: The text is now considered to be in its final form. Since its initial release on March 9, 1999, a total of 535 corrections have been made, most of them following on error reports submitted by users. However, more than two years have now passed since the last such report, and it seems sensible to regard the current version of the text as definitive."
Listed dates: Book 01 "Last updated: Thu Aug 22 2026"; Book 03 "Mon Apr 11 2022"; Book 04 "Thu Dec 1 2011"; Book 07 "Tue Sep 22 2026"; Book 14 "Sun Apr 07 2024". The server's Last-Modified for UR/MBh07.txt is "Tue, 22 Sep 2026 10:21:36 GMT".

**Formats** (welcome.html, verbatim): "The text of the Mahābhārata is available in three formats: Unicode Devanagari, Unicode Roman (using the conventions defined in ISO 15919), and ASCII (using the Harvard/Kyoto conventions)." Also: "(The files are in PC format (end-of-line is CR/LF)…)". These are plain-text files.
- Main text: `https://bombay.indology.info/mahabharata/text/{UD|UR|ASCII}/MBhNN.txt` (NN = 00–18; 00 is "General Information").
- Supplementary (star passages and Appendix I): `https://bombay.indology.info/mahabharata/apps/{UD|UR|ASCII}/SuppNN.txt`. Supp07 is listed as "Last updated: Mon Jul 23 2007".
- Every download returned HTTP 200 with no login. (A sanskritdocuments page from 2017 says "You need to register at his website to download all the latest files including the appendix and star passages", which was not the case today.)

**Verse-id convention** (MBh00.txt, verbatim): "At the start of every line appears a nine-character line-number specifying the book or parvan (two digits), the chapter or adhyāya (three digits), the verse or śloka (three digits), and the quarter-verse or pāda (one letter, specifying the first of the two pādas that form each line)." Prose takes a capital letter (`01003001A`). A header line has a space in place of the letter (`01045003  janamejaya uvāca`). In triṣṭubh, pādas within a line are separated by `;`. Star passages use `07*0259_01`; Appendix I uses `07_008_0001`; an uncounted speaker line uses `=` (`07_008=0000 saṁjaya uvāca`).

**Script details (UR):** ISO 15919, so `ṁ` for anusvāra, `r̥` for vocalic r, and avagraha as `’` (U+2019). It is **not** byte-compatible with GRETIL's IAST.

**Verbatim lines, `text/UR/MBh07.txt`:**
```
07034017a dhanaṁjayo hi nas tāta garhayed etya saṁyugāt
07034017c kṣipram astraṁ samādāya droṇānīkaṁ viśātaya
07034018  abhimanyur uvāca
07034018a droṇasya dr̥ḍham avyagram anīkapravaraṁ yudhi
07034018c pitr̥̄ṇāṁ jayam ākāṅkṣann avagāhe bhinadmi ca
07034019a upadiṣṭo hi me pitrā yogo ’nīkasya bhedane
07034019c notsahe tu vinirgantum ahaṁ kasyāṁ cid āpadi
07034020  yudhiṣṭhira uvāca
07034020a bhindhy anīkaṁ yudhā śreṣṭha dvāraṁ saṁjanayasva naḥ
07034020c vayaṁ tvānugamiṣyāmo yena tvaṁ tāta yāsyasi
07034021a dhanaṁjayasamaṁ yuddhe tvāṁ vayaṁ tāta saṁyuge
07034021c praṇidhāyānuyāsyāmo rakṣantaḥ sarvatomukhāḥ
07048022a tasmiṁs tu nihate vīre bahv aśobhata medinī
07048022c dyaur yathā pūrṇacandreṇa nakṣatragaṇamālinī
```
Devanagari (`text/UD/MBh07.txt`): `07034019a उपदिष्टो हि मे पित्रा योगोऽनीकस्य भेदने` / `07034019c नोत्सहे तु विनिर्गन्तुमहं कस्यांचिदापदि`.
ASCII (`text/ASCII/MBh07.txt`): `07034019a upadiSTo hi me pitrA yogo 'nIkasya bhedane`.

**The womb passage in the apparatus** (`apps/UR/Supp07.txt`, lines 1404–1409, verbatim):
```
% 7.34.18
% After the ref., K1.2 ins.:
07*0259_01 śr̥ṇu rājan mahābāho vacanaṁ mama suvrata
07*0259_02 purā garbhagate vāpi cakravyūhapraveśanam
07*0259_03 mukhāt kr̥ṣṇasya rājendra śrutam asmi mayā prabho
07*0259_04 tasmād vyūhaṁ praviśyāmi cakrākhyaṁ nr̥pasattama
```

**Licence** (MBh00.txt, "The status of the electronic text", verbatim):
> The electronic text of the Mahabharata is Copyright (C) The Bhandarkar Oriental Research Institute (BORI), Pune. This authorised and regularly updated text is available only via the web page http://bombay.indology.info/mahabharata/statement.html. Please do not provide copies of the text to others.

Supp00.txt has the same sentence, with "(C) Bhandarkar Oriental Research Institute, Pune, India, 2001" in its file header. I found no open licence anywhere on the site.

---

## 3. sacred-texts.com (Ganguli; `mbs` Sanskrit)

**Access problem.** sacred-texts.com returned **HTTP 403 (a Cloudflare "Just a moment…" managed challenge)** for `/hin/m07/index.htm`, `/hin/m07/m07033.htm`, `/hin/mbs/index.htm` and `/tos.htm`. `robots.txt` returned 200. WebFetch also got 403. The Wayback Machine (web.archive.org) reset the connection, and WebFetch refuses that host. I did not try to get past the challenge. Instead I read two **third-party mirrors** of the same files:
- ibiblio: https://www.ibiblio.org/sripedia/ebooks/mb/m07/index.htm and `.../m07NNN.htm`
- neonvagabond: https://neonvagabond.xyz/mirrors/sacred-texts/hin/m07/index.htm and `.../m07NNN.htm`. This is a newer copy whose embedded metadata gives the canonical URL, e.g. `"url": "https://sacred-texts.com/hin/m07/m07033.htm"`.

A web search also returned https://sacred-texts.com/hin/m07/m07033.htm as a live page titled "Sacred Texts Hinduism Mahabharata Index Previous Next". The canonical pattern is therefore `https://sacred-texts.com/hin/m07/m07NNN.htm`. **Treat the sacred-texts wording as verified through mirrors only.**

**Title page** (`m07000.htm`, neonvagabond mirror), verbatim: "The Mahabharata of Krishna-Dwaipayana Vyasa BOOK 7 DRONA PARVA Translated into English Prose from the Original Sanskrit Text by Kisari Mohan Ganguli [1883-1896]". Notice:
> NOTICE OF ATTRIBUTION
> Scanned at sacred-texts.com, 2004. Proofed by John Bruno Hare, October 2004. This text is in the public domain. These files may be used for any non-commercial purpose, provided this notice of attribution is left intact.

**Terms of Service** (https://sacred-texts.com/tos.htm, read via https://neonvagabond.xyz/mirrors/sacred-texts/tos.htm), verbatim extracts:
> 4. The texts at this site are believed to be in the public domain in the United States, or freely redistributable for non-commercial purposes.
> 5. … ISTA produced texts are clearly identified by a notice of attribution. ISTA produced texts are believed to be in the public domain. These texts may be copied electronically for any non-commercial purpose, provided the notice of attribution is left intact in the text, and a link or reference back to sacred-texts.com is provided in the copy in a location visible to anyone accessing the file. You are explicitly forbidden to claim a new copyright on ISTA produced texts.
> 6. Commercial uses of ISTA produced texts in their entirety are prohibited without a written licensing agreement and payment of a licensing fee to ISTA. … Commercial use includes any product for sale which incorporates ISTA produced texts in their entirety, or any use where customers must pay money to view said texts.
> 12. Notwithstanding any other statements at this site, the following entities may freely use any of the material derived from public domain books for any purpose without restriction, and, if needed, without attribution: Project Gutenberg Distributed Proofreading Wikipedia, Wikisource, Wikimedia Commons and other websites run by the Wikimedia foundation, Inc. Christian Classics Ethereal Library (CCEL)

The page's meta tag reads `<meta name="copyright" content="Public Domain and Creative Commons">`.

**Ganguli sections for the Abhimanyu episode (Abhimanyu-badha Parva).** The index heading "Abhimanyu-badha Parva" sits above Section XXXI (m07031), and "Jayadratha-Vadha Parva" above Section LXXXV. I matched sections to CE chapters by reading the opening and closing lines of each section against the opening and closing verses of each CE chapter in Smith's text. Ganguli's numbering is about one behind the CE here, and the vulgate inserts the long consolation by Vyāsa.

| CE (Smith) | Opening of CE chapter | Ganguli section | sacred-texts file |
|---|---|---|---|
| 7.32 | pūrvam asmāsu bhagneṣu phalgunenāmitaujasā | XXXI ("Having been first broken by Arjuna…") | m07031.htm |
| 7.33 | samare 'tyugrakarmāṇaḥ… | XXXII | m07032.htm |
| 7.34 (chakravyūha; 7.34.19) | tad anīkam anādhṛṣyaṁ bhāradvājena rakṣitam | XXXIII | m07033.htm |
| 7.35 | saubhadras tu vacaḥ śrutvā dharmarājasya | XXXIV | m07034.htm |
| 7.36 | tāṁ prabhagnāṁ camūṁ dṛṣṭvā | XXXV | m07035.htm |
| 7.37 | (Dhṛ.) tathā pramathamānaṁ taṁ | XXXVI | m07036.htm |
| 7.38 | (Dhṛ.) dvaidhībhavati me cittaṁ | XXXVII | m07037.htm (first half) |
| 7.39 | śaravikṣatagātras tu… (Duḥśāsana) | XXXVIII | m07037.htm (second half; this file has two SECTION headings) |
| 7.40 | so 'bhigarjan dhanuṣpāṇiḥ… | labelled "XXXIX" | m07038.htm |
| 7.41 | (Dhṛ.) bālam atyantasukhinam | XL | m07039.htm |
| 7.42 | yan mā pṛcchasi… sindhurājasya | XLI | m07040.htm |
| 7.43 | saindhavena niruddheṣu | XLII | m07041.htm |
| 7.44 | ādadānas tu śūrāṇām | XLIII | m07042.htm |
| 7.45 | (Dhṛ.) yathā vadasi me sūta | XLIV | m07043.htm |
| 7.46 | (Dhṛ.) tathā praviṣṭaṁ taruṇaṁ | XLV | m07044.htm |
| 7.47 | sa karṇaṁ karṇinā karṇe | XLVI | m07045.htm |
| 7.48 (death; 7.48.22) | viṣṇoḥ svasānandikaraḥ | XLVII + XLVIII | m07046.htm + m07047.htm |
| 7.49 | tasmiṁs tu nihate vīre saubhadre | XLIX | m07048.htm |
| *(CE App. I No. 8, "After 7.49, N (except Ś1 K) S ins.", 920 lines: Vyāsa, origin of Death, the sixteen kings)* | evaṁ vilapamāne tu kuntīputre | L–LXXI | m07049.htm – m07068.htm |
| 7.50 | tasminn ahani nirvṛtte | LXXII | m07069.htm |
| 7.51 | (Yudh.) tvayi yāte mahābāho | LXXIII | m07070.htm |

- Ganguli's rendering of **7.34.19** (m07033; also PG #15475 line 41983): "I have been taught by my father the method of (penetrating and) smiting this kind of array. I shall not be able, however, to come out if any kind of danger overtakes me."
- Ganguli's rendering of **7.48.22** (m07046, Section XLVII): "Upon the slaughter of that hero, the earth looked exceedingly resplendent like the star-bespangled firmament with the moon."
- **Gaps in the numbering:** the index has no separate XXXVIII (it is inside m07037), and it jumps from LIII (m07052) to LVI (m07053). The PG text also goes LIII → LVI. Whether the 1888 print skipped those numbers or the e-text lost text is **unverified**.
- The two mirrors' indexes agree up to m07071 and then disagree: ibiblio labels m07072 "LXXVI", neonvagabond labels it "LXXV". Labels beyond 7.51's equivalent are unverified.

**sacred-texts `mbs` (Sanskrit)** (https://sacred-texts.com/hin/mbs/index.htm, read via https://neonvagabond.xyz/mirrors/sacred-texts/hin/mbs/index.htm), verbatim:
> This the Sanskrit text of the Mahabharata in Sanskrit. This is derived from electronic files created by Prof. Muneo Tokunaga of Kyoto and edited by John D. Smith. Their data was used to generate parallel Devanagari and Romanization, using custom C programs created at sacred-texts. This text has been cross-referenced with Ganguli's English translation on a book-by-book basis. However, due to the mismatch in number of chapters per book, it was not possible to cross-reference this at the chapter level.

- **Numbering:** CE. Book 7 has 173 chapter files (`mbsi07.htm` links `mbs07001`–`mbs07173`), and chapter pages carry CE verse numbers in green (`mbs07034.htm`, verse 19 = `upadiṣṭo hi me pitrā yogo 'nīkasya bhedane`). There are verse numbers only, no pāda letters. Speakers are abbreviated (`[abhi]`, `[y]`, `[bhm]`).
- **It is an old derivative.** It keeps Tokunaga-era split compounds that Smith later rejoined: `anīka pravaraṃ` (7.34.18), `dhanaṃjaya samaṃ`, `sarvato mukhāḥ` (7.34.21). The Devanagari drops word-final virāma (`तद अनीकम`). No notice of attribution appears on the `mbs` pages, so the BORI terms in §2 apply to the underlying text. **Do not use it as a CE source.**

---

## 4. sanskritdocuments.org

**Yes, it has the MBh (CE and the southern recension).** https://sanskritdocuments.org/mirrors/mahabharata/ says, verbatim: "In 1998, we made the e-text of the sanskrit epic Mahabharata (Bhandarkar Oriental Research Institute BORI Critical Edition typed by Prof. Tokunaga) available for the first time…" and "In 2013, the site has been updated to include both the critical edition and the southern recension of Mahabharata in unicode devanagari (utf-8 encoding) along with the ITRANS versions." The page ends "Last update on Vijayadashami 2013".

CE page: https://sanskritdocuments.org/mirrors/mahabharata/mahabharata-bori.html ("Links updated on Feb 15, 2017"). Formats: Unicode Devanagari HTML (`.../unic/mbh07_sa.html`), PDF (`.../pdf/mbh-07.pdf`), ITRANS (`.../txt/mbh07.itx`), and xdvng-font HTML (`.../htm/07.htm`). Source, verbatim: "In 1998 we converted to devanagari the CSX version files prepared by Prof. John Smith based on the original encoding of Mahabharata by Prof. Muneo Tokunaga".

- **Book 7 ITRANS:** https://sanskritdocuments.org/mirrors/mahabharata/txt/mbh07.itx (908,646 bytes; header "Latest update : September 16, 2013"; HTTP Last-Modified Sun, 23 Feb 2025). It numbers verses within each chapter only (`|| 19||`) under chapter headings, with no book.chapter.verse ids, and joins words by sandhi (`notsahe tu vinirgantumahaM kasyA~nchidApadi || 19||`).
- **Terms** (header of `mbh07.itx`, verbatim):
  > The text is prepared by volunteers and is to be used for personal study and research. The file is not to be copied or reposted for promotion of any website or individuals or for commercial purpose without permission.
- **FAQ** (https://sanskritdocuments.org/sanskritfaq.html), verbatim extract: "You cannot use any contents from sanskritdocuments.org if you intend to promote your own web-site, commercial or not, to get more traffic for your site and or to attract viewers for gains from advertisements…"
- The ITRANS header itself points to Smith: "Access available at Prof John Smith's site http://bombay.indology.info/mahabharata/statement.html". **This is a 2013 snapshot. Do not use it as the CE source.**

---

## 5. archive.org

Found with the search API (`https://archive.org/advancedsearch.php`) and checked through `https://archive.org/metadata/<id>`.

**BORI critical edition, Droṇaparvan** (ed. S. K. De; the series is credited to Sukthankar and Belvalkar):

| Item id | Title as given | Rights as recorded |
|---|---|---|
| `in.ernet.dli.2015.407869` | The Dronaparvan Part - Viii (Digital Library of India; "dc.publisher: Poona, Bhandarkar Oriental Research Ins."; "dc.date.copyright: 1958"; 826 pp.) | **No `dc.rights` field.** The OCR (`_djvu.txt`) is unusable (wrong script). |
| `nkdd-the-mahabharata-dronaparvan-volume-8-editor-sushil` | The Mahabharata Dronaparvan Volume 8 Editor Sushil Kumar De … Poona 1958 | `licenseurl` CC0 1.0, set by the uploader (added 2026-09-04) |
| `ctou_mahabharata-drona-parva-volume-9-part-2-by-sushil-kumar-de-sanskrit-and-eng` | Mahabharata Drona Parva Volume 9 Part 2 By Sushil Kumar De … Poona 1958 | uploader-set CC0 1.0 |
| `kgaf_the-mahabharata-dronaparvan-ed-by-vishnu-s.-sukthankar-1958-poona-bhandarkar-ori` | The Mahabharata (Dronaparvan) Ed By Vishnu S. Sukthankar 1958 Poona | uploader-set CC0 1.0 |
| `lzfa_the-mahabharata-drona-parva-part-25-ed.-s-k-de-critically-edited-by-sri-vishnu-s` | … Part 25 Ed. S K De … Poona 1953 (a fascicle) | uploader-set CC0 1.0 |
| `hyHb_…`, `oRrA_the-mahabharat-drona-parva-7-critically-edited-by-vishnu-s-suktankar-pages-missi` | "(Pages Missing)" | uploader-set CC0 1.0 |

**The CC0 marks were set by uploaders on scans of a 1958 BORI book. They are not evidence that BORI released any rights.** The mockups cite "Vol. 8, Droṇaparvan … Page 211, verse 19". Which volume and page hold 7.34 is **unverified**; I did not open the PDFs.

**Ganguli (published under P. C. Roy's name, Bharata Press, Calcutta):**
- `mahabharataofkri04royp`: v.4, holding "Bhishma parva. 1887. Drona parva. 1888". Metadata: `possible-copyright-status: NOT_IN_COPYRIGHT`, `copyright-region: US`, `copyright-evidence`: "no visible notice of copyright; stated date is 1887". Contributor: Princeton Theological Seminary Library. 1,232 page images. **This is the best page-image source for Ganguli's Drona Parva.**
- `in.ernet.dli.2015.501918`: "The Mahabharata(drona Parva)", 1888, Bharata Press; `dc.rights: In Public Domain`.
- `mahabharataofkriNNroypuoft` (Toronto set, "[19--]", NOT_IN_COPYRIGHT). Which volume holds Drona is unverified.
- Avoid `mahabharta-pratap-chandra-roy-drona-parva-1884`: the uploader set CC BY-NC-ND 4.0 on a public-domain book.

---

## 6. Ambuda (ambuda.org)

- **It hosts the MBh, in CE numbering, taken from Smith.** https://ambuda.org/texts/mahabharatam/ (Resources panel, verbatim): "Most of our texts are sourced from a custom snapshot of GRETIL… Our रामायणम् and महाभारतम् texts are sourced from John Smith's website." https://ambuda.org/about/code-and-data, verbatim: "For the Ramayana and Mahabharata specifically, we instead use the "official" electronic versions hosted on John D. Smith's website."
- **Format:** HTML reader with TEI-like elements (`<s-block id="7.34.19">`, `<s-lg>`, `<s-l>`), Devanagari by default, switchable to other scripts. https://ambuda.org/texts/mahabharatam/7.34 has 29 blocks (CE 7.34 has 29 verses) and **no star passage 259\***. Verse 19, verbatim: `उपदिष्टो हि मे पित्रा योगोऽनीकस्य भेदने । नोत्सहे तु विनिर्गन्तुमहं कस्यांचिदापदि ॥ १९ ॥`. The "Quality Report" says "No metadata available for this text."
- **Licence:** no text licence is stated for the MBh. The Terms page (https://ambuda.org/about/terms) says only "Do not violate the law, including appropriate copyright laws." The code is MIT ("Copyright (c) 2022 learnsanskrit.org", https://raw.githubusercontent.com/ambuda-org/ambuda/main/LICENSE.md). The `ambuda-org/gretil` README says: "I release my adhoc changes to the public domain; all documents are available under their original licenses."
- **Conclusion:** a convenient Devanagari view with `book.adhyāya.verse` ids, but the text and its rights are Smith's and BORI's (§2). It adds no licence.

---

## 7. DCS (Digital Corpus of Sanskrit, Oliver Hellwig)

- **Licence on the website:** https://www.sanskrit-linguistics.org/dcs/index.php?contents=impressum, verbatim: "Copyright © 2010-2026 by Oliver Hellwig. The Digital Corpus of Sanskrit by Oliver Hellwig is licensed under a Creative Commons Attribution **3.0** Unported License."
- **Licence on the data dump (GitHub):** https://raw.githubusercontent.com/OliverHellwig/sanskrit/master/dcs/data/readme.md, verbatim: "The data of the DCS and any data in child directories are licensed under the Creative Common BY 4.0 (CC BY 4.0) license." The CoNLL-U readme (`.../dcs/data/conllu/readme.md`) has the same CC BY 4.0 sentence. **So it is CC BY 3.0 on the site and CC BY 4.0 on the GitHub data.**
- **Does it carry the MBh?** Yes. The GitHub folder `dcs/data/conllu/files/Mahābhārata/` exists (listing seen with WebFetch at https://github.com/OliverHellwig/sanskrit/tree/master/dcs/data/conllu/files/Mah%C4%81bh%C4%81rata). Its first file, `Mahābhārata-0000-MBh, 1, 1-2880.conllu`, downloaded from raw.githubusercontent.com, begins `## text: Mahābhārata`, `## chapter: MBh, 1, 1`, `## chapter_id: 2880`.
- **It does not use CE verse numbering.** Each line's `sent_counter` is not the CE verse number. In 1.1 the maṅgala verse is counter 1, so CE 1.1.1 is counter 2, 1.1.46 is 47, 1.1.65 is 66 and 1.1.174 is **176**, so the offset drifts. Spelling also differs from Smith (`sattre` against Smith's normalised `satre`). Chapters look CE-like ("MBh, 1, 1"); whether Book 7 chapters align is **unverified** (GitHub's listing truncates before Book 7). The DCS text pages are behind a proof-of-work browser check that the site says "protects the corpus server from automated mass downloads". I did not bypass it.
- **Use:** morphology and lemma data (CC BY with attribution). Not a source of verse ids.

---

## 8. Copyright status of the BORI critical edition (not legal advice)

**This is research, not legal advice. Have Indian counsel confirm it before anything ships.**

- The CE was published at Poona between 1933 and 1966 (Smith, MBh00.txt: "the Critical Edition of the Mahābhārata (BORI, 1933-66)"). Droṇaparvan is dated 1958 (archive.org metadata above; Wikipedia: S. K. De "edited the Udyoga Parva (1940) and Drona Parva (1958) volumes").
- **Indian Copyright Act 1957, s.22** (as amended by Act 13 of 1992), read from the bare-act mirror https://www.advocatekhoj.com/library/bareacts/copyright/22.php. The official https://copyright.gov.in/Copyright_Act_1957/chapter_v.html failed TLS verification with curl and returned 503 to WebFetch. Verbatim: "copyright shall subsist in any literary, dramatic, musical or artistic work (other than a photograph) published within the lifetime of the author until sixty years from the beginning of the calendar year next following year in which the author dies. Explanation ? In this section the reference to the author shall, in the case of a wok of joint authorship, be construed as a reference to the author who dies last." (The "?" and "wok" are as printed on that mirror.)
- **s.23** (anonymous works): copyright subsists "until sixty years from the beginning of the calendar year next following the years in which the work is fist published" (same mirror, …/23.php). **s.28** (government works): 60 years from publication (…/28.php). BORI is not, to my knowledge, the government, and I did not find a provision giving societies a term counted from publication. s.28A (public undertakings) could not be read: the mirror returned 404.
- **Droṇaparvan's editor**, Sushil Kumar De, died in 1968 according to the Library of Congress authority record n50053388 (https://id.loc.gov/authorities/names/n50053388.json, citation note "(1890-1968)") and the lead of https://en.wikipedia.org/wiki/Sushil_Kumar_De ("29 January 1890 – 31 January 1968"). That Wikipedia article's infobox says "31 January 1978", so the sources conflict.
  - **If** the edited text of Droṇaparvan is a copyright work authored by De, s.22 protects it until **31 Dec 2028** (or 31 Dec 2038 on the 1978 date).
  - If general editors count as joint authors, the last of them to die sets the term. Their death dates are **unverified**.
  - **Books 1, 3, 4 and 14** have different editors. I did not verify their editors or death dates.
- **Whether a critical text attracts copyright at all.** A reconstructed ancient text, as distinct from its apparatus, introduction and notes, may or may not count as an original work. I found no Indian ruling on critical editions in this session (**unverified**).
- **The e-text is a separate claim.** Smith's files say "Electronic text (C) Bhandarkar Oriental Research Institute, Pune, India, 1999" and ask users not to redistribute. Whatever the status of the print, **the e-text comes with an explicit no-redistribution request.**
- **Ganguli:** published 1883–1896. PG says "Public domain in the USA." archive.org says NOT_IN_COPYRIGHT (US); DLI says "In Public Domain". Ganguli's death year is **unverified**: Wikipedia lists it as missing, and LoC no2001039466 gives no dates. Even so, under s.22 the translation could only still be protected in India if he had died after 1965, more than 69 years after the last volume appeared.

---

## 9. Recommendation

### 9.1 CE Sanskrit with verse ids: Smith's Unicode Roman files

- **Ingest** `https://bombay.indology.info/mahabharata/text/UR/MBh{01,03,04,07,14}.txt`, with `MBh00.txt` kept as provenance, and `https://bombay.indology.info/mahabharata/apps/UR/Supp07.txt` for star and appendix passages.
- **Id mapping:** `07034019a` becomes claim `mbh.7.34.19`, half-line a.
- **Store** the `% Last updated:` line and a sha256 per file, and re-check welcome.html before each release.
- **Parsing:**
  - Strip CR.
  - Split ids on fixed width (9 characters plus a space).
  - Map ISO 15919 to the IAST the app uses (ṁ→ṃ, r̥̄→ṝ before r̥→ṛ, l̥→ḷ, ’→'). Smith also uses `m̐` (e.g. `asmim̐l`, 07002006a), which needs a rule of its own.
  - Use the UD file as the Devanagari of record instead of transliterating (it is BORI-checked; e.g. `कस्यांचिदापदि` is joined there).
- **Existing parser:** `src/ingest/gretil.mjs` reads GRETIL's `07,034.019a` form only. Either add a Smith parser, or keep GRETIL and patch it. In 7.32–7.51, the five lines in §1 matter.
- **Keep star passages out of the claim namespace.** The 7.34.18\*259 lines are exactly the "womb story" the 3 Oct decision says is a popular telling.

**Rights note.** The e-text is "Copyright (C) The Bhandarkar Oriental Research Institute (BORI), Pune", is made available "with BORI's agreement", and asks: "Please do not provide copies of the text to others." GRETIL's copy defers to the same terms ("COPYRIGHT AND TERMS OF USAGE AS FOR SOURCE FILE"); Ambuda's and sacred-texts' copies are derived from it and add no licence.
- *Fine:* fetching it for internal use, resolving claim ids, and quoting single verses as citations is ordinary scholarly use.
- *Needs permission:* bundling the verse text into the app's JSON export, or showing Devanagari and IAST for every claim, amounts to redistributing BORI's e-text.
- *Next step:* before anything public, write to BORI (and copy John Smith, whose contact is on welcome.html) for written permission, and log the reply as a rule-9-style record in `docs/decisions.md`.
- *Print edition:* separately, the 1958 Droṇaparvan may still be in copyright in India until the end of 2028 on De's 1968 death date. Not legal advice.

### 9.2 Public-domain English: Ganguli via Project Gutenberg #15475

- **Ingest** `https://www.gutenberg.org/ebooks/15475.txt.utf-8` ("The Mahabharata of Krishna-Dwaipayana Vyasa, Volume 2", Books 4, 5, 6 and 7; "Copyright: Public domain in the USA."; "Produced by John B. Hare, David King, and David Widger").
- **Book 7** runs from "DRONA PARVA" at line 38438 to "The end of Drona Parva." at line 60539. The Abhimanyu sections are XXXI–XLIX plus LXXII–LXXIII (table in §3).
- **Verify** wording against the page images of archive.org `mahabharataofkri04royp` (v.4, Drona parva 1888, NOT_IN_COPYRIGHT).
- **Cite** Ganguli by his own section number with the CE mapping in §3, never as a CE verse.

**Rights note.** The translation was published 1883–1896 and is public domain (PG: "Public domain in the USA."; archive.org: NOT_IN_COPYRIGHT; DLI: "In Public Domain").
- *Why not sacred-texts:* its copy carries a notice limiting use to "any non-commercial purpose", and its TOS forbids commercial use of ISTA texts "in their entirety" without a licence.
- *Why PG is clear:* the same TOS (clause 12) lets Project Gutenberg use the material "for any purpose without restriction". PG's licence says: "If an individual work is unprotected by copyright law in the United States … we do not claim a right to prevent you from copying, distributing … as long as all references to Project Gutenberg are removed."
- *What to do:* take the PG text, strip the PG header, licence and trademark, and keep a provenance line ("K. M. Ganguli tr., 1883–1896; e-text via Project Gutenberg #15475, originally scanned at sacred-texts.com").
- *Caution:* Ganguli follows the vulgate/Bengal text. His section numbers do not match the CE, and the Vyāsa consolation (L–LXXI) is CE Appendix I No. 8, not CE text.

---

## 10. Files read, retrieved 2026-10-04 (the pinned ones are in `content/canon/sources.json`)


| File | From | sha256 |
|---|---|---|
| `mbh_07_u.htm` | GRETIL Book 7 | aaaf837757f8debc593a4b2764ae513525e7570abaa5eb58bc7afc581a1b3778 |
| `mbh_01_u.htm` | GRETIL Book 1 | b4202584cd859d1b7bcacc754af8034a88e5963934b87e0495d8d12d79b8daa2 |
| `mbh_03_u.htm` | GRETIL Book 3 | 018668ae4468c0e14d557e4380e409144f68a53d3b76f941b345b7dba57884b8 |
| `mbh_04_u.htm` | GRETIL Book 4 | c117476099ffc173b74753d0689e88dc488a05fcf74bd4e93ad7278e101cdccf |
| `mbh_14_u.htm` | GRETIL Book 14 | 1b1016860aaf9385b190f2b30b4c38bd26f61d4eac0c73a03862e94f2c7e2c3c |
| `mbh1-18u.zip` | GRETIL all books | 1662631fcd82b58786b9152d5e65aee732283ba2b1bc3b0d8982f1eb67725527 |
| `zip_extract/MBH1-18U.HTM` | unzipped | 2c93769a06b2695aa762b0d1bae0d42928b2c1032eb416ff38ad31bfcbc6df46 |
| `smith/UR/MBh07.txt` | Smith, Unicode Roman | 9d26ca85bab980d078c59108fdb49dda00d1c943ba668cf566d8259618bfffa6 |
| `smith/UD/MBh07.txt` | Smith, Devanagari | 5994ea0fe5cccb5782706b4909398d22c44960d42d4593c4f782a9fbb65d4518 |
| `smith/ASCII/MBh07.txt` | Smith, Harvard-Kyoto | 1e736c83e8767d8da86b8fe1d6e17a2c172860fb6e461e37dc4cc83a05c44513 |
| `smith/UR/MBh00.txt` | Smith, general info and licence | 2711142809b6360d311d1c6af63ac900753338bc30fff3ef14b1668be10fb255 |
| `smith/apps_UR/Supp07.txt` | Smith, star and appendix passages, Book 7 | a14b1bf3351dd6cef6205ed08a6b8195c934e1cc645998f9aa3d446c7d3b52ab |
| `smith/UR/MBh01.txt` | Smith | 73ef4bbaf4758cefe156afd79cc78a674c91842781ee858b09de070ff8522cb7 |
| `smith/UR/MBh03.txt` | Smith | 6ab7220a2a34a3974d871e42713d83aa7344a6ffd128ec897328c8d9e405888f |
| `smith/UR/MBh04.txt` | Smith | 7ae026bdb777cfac57b9c4ddfd15ac9b264dd2b0cade70457e3a41e403d8c08e |
| `smith/UR/MBh14.txt` | Smith | 1f0316fd1533c634e3f072cdbb73e8e4486cd3007306fe5831efc2dec18bca78 |
| `pg15475.txt` | Project Gutenberg, Ganguli vol. 2 (Books 4–7) | 009689aec55696f0d40201138c867db4c306671e6a5ba0091d783f812f395b5b |
| `gretil_vs_smith_book07_diff.tsv` | made here: 83 differing lines | n/a |

Also read: Smith's UD and ASCII files for books 00, 01, 03, 04 and 14, and `apps/UR/Supp00.txt`; Ganguli section HTML from two sacred-texts mirrors.

## 11. Open items

- sacred-texts.com itself was not reachable (Cloudflare challenge). Its pages and TOS were read from mirrors only. Re-check from a browser before citing sacred-texts URLs publicly.
- The printed BORI page and volume for 7.34.19 and 7.48.21 are unverified (PDFs not opened). This is DHE-1. (The pipeline session found the "not dharma" line at 7.48.21, not 7.48.22; see `docs/research/canon-check-s1e3.md`.)
- Editors and death dates for books 1, 3, 4 and 14, and for the general editors, are unverified.
- S. K. De's death year: 1968 (LoC; Wikipedia lead) against 1978 (Wikipedia infobox).
- Ganguli's death year is unverified.
- DCS Book 7 chapter alignment with the CE is unverified.
- Smith 07014024c `śakrāśaniravopamaḥ` against GRETIL `śakrāśanir ivopamaḥ` needs a check against the print.
- The CE upaparvan boundary 7.32–7.51 is taken from the brief. Neither e-text marks sub-parvans. The content matches Ganguli's "Abhimanyu-badha Parva" opening at 7.32.
