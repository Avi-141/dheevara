# Source inventory beyond canon v0: what Dheevara still needs, and the rights on each (as of 17 Oct 2026)

Scope: everything **not** already in `docs/research/sources.md`. That file already covers Smith's CE e-texts, GRETIL MBh, Ganguli via PG #15475, the archive.org Droṇaparvan scans, Ambuda, DCS and the BORI copyright analysis, and none of it is repeated here.
Unless a line says otherwise, every URL was retrieved on 2026-10-17. Where I read a file directly (curl), the quote is verbatim. Where a fact comes only from a search-engine summary, it says "(search summary)". **This is not legal advice.** Indian term: life + 60 (s.22). Posthumous works get 60 years from publication (s.24); that section was not re-read this session.
US rule of thumb used below: works published before 1 Jan 1931 are PD in the US. For foreign works published from 1931 on, URAA restoration usually means 95 years from publication.

---

## 1. Character and entity reference works

### Takeaway
The best find of the session: the **Cologne Digital Sanskrit Dictionaries (CDSL)** already hold machine-readable, entry-tagged editions of **Sørensen's Index to the Names in the Mahābhārata (INM)**, **Vettam Mani's Purāṇic Encyclopaedia (PE)**, **Mehendale's Mahābhārata Cultural Index (MCI)** and Dikshitar's **Purāṇa Index (PUI)**, plus MW and Apte. All are on GitHub as plain text.
- **MCI cites the BORI CE directly**, chapter and verse, and records story time ("on the thirteenth day of the war"). Sørensen cites the **Calcutta** edition. Mani cites the **vulgate** by parvan and chapter.
- The digitisations carry **CC BY-NC-SA 3.0** headers, which conflict with a **CC BY-SA 4.0** LICENSE file in the same repo.
- Mani (1975) and Mehendale (1993) are still in copyright as printed works.
- Wikidata has 224 MBh items, but they are thin and mostly unreferenced.

### Cited Findings

**CDSL: what is there**
- The CDSL home page lists, under "Specialized Dictionaries": "INM * 1904 Index to the Names in the Mahabharata", "PUI * 1951 The Purana Index", "PE * 1975 Puranic Encyclopedia" and "MCI * 1993 Mahabharata Cultural Index". It also says: "We are experiencing some technical issues and some dictionaries m[ay be unavailable]". — [CDSL](https://www.sanskrit-lexicon.uni-koeln.de/)
- **Source repo.** The README of `sanskrit-lexicon/csl-orig` (dated "Created: 14-06-2026 · Last updated: 11-07-2026") calls it "the canonical source-text store for the Cologne Digital Sanskrit Dictionaries", with "**45 dictionary subfolders** under v02/". Each dictionary is a plain-text file, `v02/<dict>/<dict>.txt`. — [csl-orig README](https://raw.githubusercontent.com/sanskrit-lexicon/csl-orig/master/README.md)
- **Files downloaded today**, each from `https://raw.githubusercontent.com/sanskrit-lexicon/csl-orig/master/v02/<d>/<d>.txt`:
  - `inm.txt`: 7,023,737 bytes, 12,647 `<L>` records
  - `mci.txt`: 3,674,321 bytes, 2,643 records
  - `pe.txt`: 6,521,202 bytes, 8,799 records
- **Format.** Records are delimited `<L>n<pc>page<k1>SLP1-headword<k2>…`. Bold is `{@…@}`, italic `{%…%}`, and page breaks are `[Page001-b+ 47]`. Each record ends with `<LEND>`. (Observed in the files.)

**CDSL: licence, verbatim**
- The per-dictionary TEI headers (`pe/peheader.xml`, `inm/inmheader.xml`, `mci/mciheader.xml`, `mw/mwheader.xml`, `ap90/ap90header.xml`, `pui/puiheader.xml`) all read: "Copyright © 2014 The Sanskrit Library and Thomas Malten" / "All rights reserved other than those granted under the Creative Commons Attribution Non-Commercial Share Alike license available in full at //creativecommons.org/licenses/by-nc-sa/3.0/legalcode … Permission is granted to build upon this work non-commercially, as long as credit is explicitly acknowledged exactly as described herein, and derivative work is distributed under the same license." — [PE header](https://raw.githubusercontent.com/sanskrit-lexicon/csl-orig/master/v02/pe/peheader.xml), [INM header](https://raw.githubusercontent.com/sanskrit-lexicon/csl-orig/master/v02/inm/inmheader.xml), [MCI header](https://raw.githubusercontent.com/sanskrit-lexicon/csl-orig/master/v02/mci/mciheader.xml)
- **Conflict.** The repository-level `LICENSE` file opens "Attribution-ShareAlike 4.0 International", which is CC BY-SA 4.0 with **no** NC clause. — [csl-orig LICENSE](https://raw.githubusercontent.com/sanskrit-lexicon/csl-orig/master/LICENSE)

**Sørensen, Index to the Names in the Mahābhārata (INM)**
- **What it is.** The INM header's sourceDesc reads: "Sörensen, Sören. Index to the Names in the Mahabharata with short explanations and a concordance to the Bombay and Calcutta editions and P. C. Roy's translation", editors Elof Olesen and Dines Andersen, London: Williams and Norgate, 1904–1925, "Issued in 13 parts", "xli, 807, [1] p."
  - Note: "When Dr. Sörensen died, pages 1-32 had been put into type … The revision and final preparation of the manuscript was committed to Elof Olesen under the superintendence of Dines Andersen." — [INM header](https://raw.githubusercontent.com/sanskrit-lexicon/csl-orig/master/v02/inm/inmheader.xml)
- **Citation style: Calcutta edition, not the CE.** The Abhimanyu entry, verbatim: "son of Arjuna and Subhadrā, sister of Kṛṣṇa (I, {@2@}, 401; {@63@}, 2449; {@95@}, 3830; {@221@}, 8026), is an incarnation of Varcas, son of Soma (I, {@67@}, 2748)…". That is book, adhyāya, and a running śloka number within the book (Calcutta). — `inm.txt` line 81ff., from [csl-orig](https://raw.githubusercontent.com/sanskrit-lexicon/csl-orig/master/v02/inm/inm.txt)
- **Scans.**
  - Archive.org holds DLI scans `in.ernet.dli.2015.98210` ("An Index To The Names In The Mahabharata", 1904) and `dli.csl.7903` (Part XI), and `india.history.resource.87613` (the full title with "concordance to the Bombay and Calcutta editions and P. C. Roy's translation"). — [archive.org advancedsearch](https://archive.org/advancedsearch.php?q=title%3A%28index+names+mahabharata%29&fl%5B%5D=identifier&output=json)
  - CDSL also serves page scans at `//www.sanskrit-lexicon.uni-koeln.de/scans/INMScan/2013/web/index.php` (distributor line in the [INM header](https://raw.githubusercontent.com/sanskrit-lexicon/csl-orig/master/v02/inm/inmheader.xml)).

**Mehendale, Mahābhārata Cultural Index (MCI): the BORI "Cultural Index"**
- **What it is.** The MCI header's sourceDesc: editor "Mehendale, Madhukar Anant", "Mahābhārata Cultural Index being a comprehenseive [sic] subject-wise index to the cultural information available in the critically constituted text of the Mahābhārata published by the Bhandarkar Oriental Research Institute, Poona", vol. 1, Poona: Bhandarkar Institute Press, 1993, 981 pp. An XML comment adds "vol. 2, fasc. 1-3 published as of 2004". — [MCI header](https://raw.githubusercontent.com/sanskrit-lexicon/csl-orig/master/v02/mci/mciheader.xml)
- **It cites the CE and records story time.** The Cakravyūha entry, verbatim: "Name of a vyūha (a particular arrangement of the army). Droṇa arranged the Kaurava army according to this vyūha on the thirteenth day of the war. A. Description: impenetrable (durbhida) 7. 32. 18; impenetrable even for the gods (abhedyas tridaśair api) 7. 32. 13; unassailable (anādhṛṣya) 7. 34. 1…" — `mci.txt` line 10425ff.
- **Sub-parvans mapped to CE adhyāyas.** "Abhimanyuvadha … Name of the 67th parvan in the list of a hundred sub-parvans … Parvasaṃgraha 1. 2. 57, 33, 70; … related to Adhyāyas 7. 32-51." — `mci.txt` line 16086ff.
- **Coverage observed** in the 2,643 headwords: animals and birds (e.g. "Droṇa … A Śārṅgaka bird", citing "1. 221. 9; 1. 220. 16, 17"), rivers (alakanandā), tīrthas (arundhatīvaṭa), vyūhas and sub-parvan names. The main heroes do **not** appear as persons: "jayadrathavadha" is only the sub-parvan, and "droṇa" is only the bird. — `mci.txt`

**Vettam Mani, Purāṇic Encyclopaedia (PE)**
- **What it is.** CDSL title "Vettam Mani's Purāṇic Encyclopedia", "Mani, Vettam. Purāṇic encyclopedia. 1975". — [PE header](https://raw.githubusercontent.com/sanskrit-lexicon/csl-orig/master/v02/pe/peheader.xml)
- **Citation style.** Vulgate parvan and chapter, e.g. "M.B. Vana Parva, Chapter 22, Verse 11" and "(M.B. Ādi Parva, Chapter 67)". Entries are sectioned; for example, Abhimanyu I has "1) Genealogy. He was descended from Viṣṇu in this order: Brahmā-Atri-Candra-Budha-Purūravas-…". — `pe.txt` lines 15–53
- **Archive.org copies.** These include `puranicencyclopa00maniuoft` (1975) and several uploader-CC0 items (`ZlgV_puranic-encyclopaedia-by-vettam-mani-motilal-banarsidass-delhi`, and `knxc_puranic-encyclopaedia-1921-motilal-banarsidass`, whose "1921" date is evidently wrong). — [archive.org search](https://archive.org/advancedsearch.php?q=title%3A%28puranic+encyclopaedia%29&fl%5B%5D=identifier&fl%5B%5D=licenseurl&output=json)

**Hopkins, Epic Mythology (1915)**
- Archive.org has `epicmythology00hopkuoft` (1915, `possible-copyright-status: NOT_IN_COPYRIGHT`), DLI scans `in.ernet.dli.2015.97785`, `.46233` and `.280013`, and a 1974 reprint, `epicmythology0000hopk`. — [archive.org search](https://archive.org/advancedsearch.php?q=title%3A%28epic+mythology%29+AND+creator%3Ahopkins&fl%5B%5D=identifier&output=json)

**Monier-Williams (1899) and Apte (1890)**
- Both are in CDSL, under the same CC BY-NC-SA 3.0 header as above: "Monier-Williams' Sanskrit-English dictionary … 1899" and "Apte's Practical Sanskrit-English Dictionary … 1890". — [MW header](https://raw.githubusercontent.com/sanskrit-lexicon/csl-orig/master/v02/mw/mwheader.xml), [AP90 header](https://raw.githubusercontent.com/sanskrit-lexicon/csl-orig/master/v02/ap90/ap90header.xml)

**Wikidata: SPARQL sample run today on `query.wikidata.org`** (the API search endpoint rate-limited us)
- **Coverage.** 224 items carry `P1441 present in work = Q8276 (Mahabharata)`. Across those items there are 1,359 item-valued statements, and only 186 of them have any reference (13.7%). — [Wikidata Query Service](https://query.wikidata.org/)
- **Droṇa (Q890529):**
  - father: Bharadwaja
  - spouse: Kripi
  - child: Aśvatthāmā
  - killed by: Dhṛṣṭadyumna
  - students: Arjuna, Dhṛṣṭadyumna, Bhīma
  - student of: Agnivesa
  - residence: Hastinapur
  - **place of death: "Kurukshetra district"** (a modern district)
  - sibling: "Ilavida"
  - instance of: legendary figure
  - — [Q890529](https://www.wikidata.org/wiki/Q890529)
- **Abhimanyu (Q320606):**
  - father: Arjuna
  - mother: Subhadrā
  - spouse: Uttarā (1 reference)
  - child: Parīkṣit
  - instance of: legendary figure / fictional human / "human whose existence is disputed"
  - **producer: "Sitaram Agrawal"**, a film credit merged into the character
  - **no "killed by"**
  - all other statements: 0 references
  - — [Q320606](https://www.wikidata.org/wiki/Q320606)
- **Jayadratha (Q2381146):**
  - killed by: Arjuna
  - spouse: Duhsala
  - instance of: "character in the Mahabharata"
  - 0 references, except on the image
  - — [Q2381146](https://www.wikidata.org/wiki/Q2381146)

**Open datasets and knowledge graphs**
- **Neo4j developer-blog series**, "Unveiling the Mahabharata's web: analyzing epic relationships with Neo4j graph database" (parts 1–2). Characters are nodes and relationships are edges, and the author says the Cypher code is on GitHub (repo URL not confirmed) (search summary). — [Neo4j part 1](https://neo4j.com/blog/developer/mahabharata-epic-graph-database-1/), [part 2](https://neo4j.com/blog/developer/mahabharata-epic-graph-database-2/)
- **Gultepe & Mathangi (2023)**, a social-network analysis of Mahābhārata characters in *Heritage* (MDPI, open access), indexed in DOAJ (search summary). — [DOAJ record](https://doaj.org/article/1585d5ca9cc24f16b86fd09783a97e39)
- **John D. P. Evans, "A Structural Comparison of Indian Epics"**, arXiv:2607.10702, submitted 12 Jul 2026, physics.soc-ph, "submitted to Advances in Complex Systems". The abstract says "We perform network analysis on both texts" and compares with the Iliad. The abstract page states no dataset or code release. — [arXiv](https://arxiv.org/abs/2607.10702)
- **GeekyAnts blog (6 May 2025)**: a GraphRAG Mahābhārata chatbot that extracts entities into a knowledge graph (search summary). — [GeekyAnts](https://geekyants.com/blog/mapping-mythology-with-genai-building-a-mahabharata-chatbot-using-graphrag)

### Inferences
- **MCI is the single most useful entity source for Dheevara.** It is CE-keyed (`7. 32. 13`), so every fact maps straight onto the claim namespace (`mbh.7.32.13`), and it already records war-day story time.
  - **Recommended use:** a *finding aid*. Parse its verse references, then verify each against Smith's CE text and cite the CE verse, never MCI's prose.
  - **Rights:** factual locators are not copyrightable expression. Reproducing Mehendale's prose would infringe both the 1993 BORI print (Mehendale's death date is unverified, so the print is assumed in copyright) and the CDSL NC licence.
- **Sørensen is out of copyright in India and the US.**
  - US: published 1904–1925, before 1931.
  - India: posthumous, so s.24 gives 60 years from publication. Even the last part (1925) is PD by 1986.
  - Use it for **aliases and epithets** (it is a name index). Its Calcutta-edition locators must be converted, though. The CE has no Calcutta concordance in hand, so map via Ganguli (Sørensen also concords to "P. C. Roy's translation", i.e. Ganguli) and then via the Ganguli→CE section table in `sources.md` §3.
  - The CDSL *digitisation* carries an NC licence claim. To avoid the dispute, take the **text from the PD scans**, or treat the CDSL file only as a lookup index for internal use.
- **Monier-Williams and Apte** prints are PD (1899/1890). Only the CDSL digital layer carries the NC/SA claim, and its LICENSE file says BY-SA 4.0 instead. Until the Sanskrit Library or Cologne clarifies, treat the files as **BY-NC-SA 3.0 for anything shipped**, and email Cologne to ask which licence governs (BY-SA 4.0 would allow commercial use).
- **Vettam Mani PE is in copyright.**
  - India: Mani's death year is unverified in this session; on any plausible date the Malayalam original (1964) and the English translation (Motilal, 1975) are still protected.
  - US: 1975, foreign, so URAA-restored and protected to about 2070.
  - The CDSL licence comes from the Sanskrit Library, which cannot license Motilal's or Mani's rights unless it obtained them; that permission is unverified.
  - **Use:** tier B pointer only. Its locators are vulgate chapters, which again need the Ganguli→CE bridge.
- **Hopkins, *Epic Mythology*** (1915) is PD in the US (before 1931). In India it is PD if Hopkins died before 1966; his commonly given death year, 1932, was not verified here. It is useful scholarship on epithets of gods, but its references are to the vulgate.
- **Wikidata** is CC0 (its standard licensing page, not re-fetched this session: https://www.wikidata.org/wiki/Wikidata:Licensing).
  - Usable as a **skeleton id layer** (QIDs for cross-linking and pronunciation audio), never as evidence.
  - The sample shows conflations (film producer on Abhimanyu), anachronisms (Kurukshetra *district*) and 86% unreferenced statements.
  - Dheevara could add CE-referenced statements back to Wikidata, which is in its interest.
- **No dataset found** is CE-referenced with an open licence. The network papers are research outputs with no confirmed data release.

### Gaps
- Sørensen's death year, Mehendale's death year (I believe he died in the 2010s, not verified), Vettam Mani's death year, and Hopkins' death year: none was verified this session.
- Whether MCI volume 2 (fascicles published by 2004) covers persons, weapons and places, and whether the CDSL file holds volume 1 only. The header says vol. 1.
- **IndicKG**: no source found in the time available. Kaggle Mahābhārata datasets were not searched.
- Rāmāyaṇa coverage in Wikidata: my count query used a wrong QID (Q39594), so the number of Rāmāyaṇa items is unknown.
- Cologne's answer on which licence governs csl-orig (CC BY-SA 4.0 LICENSE file vs CC BY-NC-SA 3.0 headers) has not been asked.
- The scans at `scans/INMScan/…` and `MCIScan` were not opened.

---

## 2. Rāmāyaṇa: critical-edition e-text and verse-numbered sources

### Takeaway
- **Smith's site has the Baroda CE Rāmāyaṇa** in the same three formats as the MBh, with fixed-width ids like `6001001a`. It was declared "final" on 14 Jun 2026 but self-described as "still far from correct". **Unlike the MBh file, its general-information file carries no copyright or no-redistribution statement.**
- GRETIL distributes a TEI version under **CC BY-NC-SA 4.0**.
- The IIT Kanpur site follows the **southern recension**, not the CE, and was unreachable today.

### Cited Findings
- **Smith, status.** Verbatim: "Please be aware that, unlike the electronic text of the Mahābhārata, this text has not been submitted to rigorous revision and scrutiny, and still contains many errors." — [bombay.indology.info/ramayana/statement.html](https://bombay.indology.info/ramayana/statement.html)
- **Smith, dates and formats.** Verbatim: "Welcome to the electronic text of the critical edition of the Rāmāyaṇa. The text of the Rāmāyaṇa is available in three formats: Unicode Devanagari, Unicode Roman (using the conventions defined in ISO 15919), and ASCII (using the Harvard/Kyoto conventions). Sunday, June 14, 2026: The text is now considered to be in its final form, though it is still far from correct." Last-updated dates by book:

  | Book | Last updated |
  |---|---|
  | 0 | Fri Sep 25 2020 |
  | 1 | Thu Oct 21 2021 |
  | 2 | Sun Jul 03 2022 |
  | 3 | Wed Nov 18 2020 |
  | 4 | Sat Sep 25 2021 |
  | 5 | Sat Sep 25 2021 |
  | 6 | Wed Mar 11 2020 |
  | 7 | Wed Oct 21 2020 |

  — [welcome.html](https://bombay.indology.info/ramayana/welcome.html)
- **Smith, provenance.** `Ram00.txt`, verbatim: "During the late 1980s and early 1990s, Prof. Tokunaga typed the entire text of the Critical Edition of the Rāmāyaṇa (Baroda, 1960-75) into a computer… this text of the Rāmāyaṇa has not benefited from the attention of a dedicated team working for several years to free it from errors… it should be used with caution."
  - Errors go to Suvarna Deshpande or Pranav Gokhale.
  - The id format is an "eight-character line-number specifying the book or kāṇḍa (one digit), the…" (the rest of the sentence is not quoted).
  - A grep of `Ram00.txt` for "copyright", "permission", "copies" and "licen" found **no match**.
  - — [Ram00.txt](https://bombay.indology.info/ramayana/text/UR/Ram00.txt)
- **Smith, sample lines** (`Ram06.txt`): `6001001a śrutvā hanumato vākyaṁ yathāvad abhibhāṣitam` / `6001001c rāmaḥ prītisamāyukto vākyam uttaram abravīt`. — [Ram06.txt](https://bombay.indology.info/ramayana/text/UR/Ram06.txt)
- **GRETIL Rāmāyaṇa.** The index entry reads: "Valmiki (trad.): Ramayana (input by Muneo Tokunaga) 1st revised version by John Smith, Cambridge". It is offered as TEI XML (`gretil/corpustei/sa_rAmAyaNa.xml`), as HTML, and as plain text (`…/transformations/plaintext/sa_rAmAyaNa.txt`). Also listed:
  - a "2nd revised version by Oliver Hellwig Khanda 2 and 3" (`sa_vAlmIki-rAmAyaNa-rev-2-3.xml`)
  - "Ramayana, Southern recension (input by Oliver Hellwig)" (`sa_vAlmIki-rAmAyaNa-southern-2.xml`)
  - — [GRETIL index](https://gretil.sub.uni-goettingen.de/gretil.html)
- **GRETIL TEI header**, `sa_rAmAyaNa.xml`, verbatim: "This e-text was provided to GRETIL in good faith that no copyright rights have been infringed. If anyone wishes to assert copyright over this file, please contact the GRETIL management… Distributed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License." The source note reads "John Smith's Rāmāyaṇa-Page (last comparison: 2020-04-16)". — [sa_rAmAyaNa.xml](https://gretil.sub.uni-goettingen.de/gretil/corpustei/sa_rAmAyaNa.xml)
- **GRETIL plain text** (2,406,915 bytes): verse ids at line end, e.g. `nāradaṃ paripapraccha vālmīkir munipuṃgavam R_1,001.001`. — [sa_rAmAyaNa.txt](https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_rAmAyaNa.txt)
- **Hellwig's rev. 2–3**, legacy header: "Original input by Muneo Tokunaga / Revision by Oliver Hellwig (with occasional minor corrections according to the Southern recension)". Licence: CC BY-NC-SA 4.0. — [sa_vAlmIki-rAmAyaNa-rev-2-3.xml](https://gretil.sub.uni-goettingen.de/gretil/corpustei/sa_vAlmIki-rAmAyaNa-rev-2-3.xml)
- **IIT Kanpur (valmiki.iitk.ac.in)**: "an electronic text, with an English translation, of the Southern Recension, developed and maintained by IIT Kanpur for the Valmiki Ramayana project by Rashtriya Sanskrita Vidya Peetham, Tirupati". The translations are by K. M. K. Murthy and the late Desiraju Hanumanta Rao (search summary; site not read). Today `https://www.valmiki.iitk.ac.in/` failed TLS ("no alternative certificate subject name matches") and `https://valmiki.iitk.ac.in/` returned HTTP 503 to WebFetch. — [valmiki.iitk.ac.in/links](https://valmiki.iitk.ac.in/links), [sanskritdocuments mirror note](https://sanskritdocuments.org/mirrors/ramayana/valmiki/ramayana.htm)

### Inferences
- **Use Smith's `text/UR/RamN.txt` as the Rāmāyaṇa canon source.** It is the same pipeline shape as the MBh: id `6001001a` → claim `ram.6.1.1`, half-line a. Because Smith calls it error-prone, **every cited Rāmāyaṇa verse needs a check against the printed Baroda volume** (archive.org scans were not located this session).
- **Rights differ from the MBh.**
  - Smith's Rāmāyaṇa file asserts **no** BORI-style copyright, and no "do not provide copies" line.
  - GRETIL's copy is explicitly CC BY-NC-SA 4.0. That licence comes from GRETIL, not from the Baroda Oriental Institute, and the NC clause rules out a commercial app.
  - The underlying 1960–75 Baroda print may carry its own editorial copyright (general editors G. H. Bhatt and U. P. Shah; death dates unverified).
  - So the position is the same as for the MBh: quoting single verses as citations is fine, but shipping full text needs the Oriental Institute's written permission.
- **IIT Kanpur's verse numbers are southern-recension (Gita Press–style) numbers.** They will **not** match CE numbers, so treat it as tier C or D, never as a CE source.

### Gaps
- The Baroda CE Rāmāyaṇa print volumes on archive.org: not searched for specifically.
- IIT Kanpur's licence and terms: the site was unreachable.
- Smith's Rāmāyaṇa star passages (an `apps/` equivalent): not checked.
- The copyright holder of the Baroda CE (the Oriental Institute, M. S. University of Baroda) and the editors' death dates: unverified.

---

## 3. Public-domain English translations and their verse alignment

### Takeaway
- **PD and verse-aligned**, in order of usefulness: **M. N. Dutt's Mahābhārata** (1895–1905; numbers verses, unlike Ganguli, but is accused of cribbing from Ganguli), **Dutt's Rāmāyaṇa** (1891–94) and **Griffith's Rāmāyaṇa** (verse, PG #24869, Benares recension).
- **Hari Prasad Shastri** (1882–1956) is PD in India since 2017 but probably still in copyright in the US, and is credibly alleged to be largely translated from Roussel's French. Avoid it.
- **Clay Sanskrit Library**: no CC licence found.
- **Van Buitenen and Debroy**: in copyright.

### Cited Findings
- **Dutt, Mahābhārata.**
  - Archive.org `aproseenglishtr00duttgoog`: "A prose English translation of the Mahabharata (tr. literally from the original Sanskrit text)", 1895, `possible-copyright-status: NOT_IN_COPYRIGHT`, "18 volumes in 6". — [archive.org metadata](https://archive.org/metadata/aproseenglishtr00duttgoog)
  - DLI scans by parvan: `in.ernet.dli.2015.142209` (Adi, 1895), `in.ernet.dli.2015.134505` (Shanti, 1903), `in.ernet.dli.2015.134527` (Anushasana, 1905). — [archive.org search](https://archive.org/advancedsearch.php?q=title%3A%28mahabharata%29+AND+creator%3A%28dutt%29&fl%5B%5D=identifier&output=json)
- **Dutt's numbering and reputation.** P. Lal, as quoted in a review: Ganguli "did not give specific verse (shloka) numbers, while the Dutt translation had these verse numbers". Critics say Dutt "shamelessly crib[bed] from the Ganguli-Roy translation" and is "more prudish" (search summary). — [Open Magazine, "The First Translator"](https://openthemagazine.com/columns/the-first-translator), [Pradip Bhattacharya](https://pradipbhattacharya.com/2021/09/03/a-watershed-in-epic-studies/)
- **Dutt, Rāmāyaṇa.** Archive.org `Valmiki_Ramayana_English_Prose_Translation_7_volumes_by_Manmatha_Nath_Dutt_1891_to_1894`, with licenseurl the Public Domain Mark 1.0 (set by the uploader). There are also separate volumes: `TheRamayanaKishkindhaKandam` (1891) and `TheRamayanaUttaraKandam` (1894). — [archive.org metadata](https://archive.org/metadata/Valmiki_Ramayana_English_Prose_Translation_7_volumes_by_Manmatha_Nath_Dutt_1891_to_1894)
- **Griffith, Rāmāyaṇa.**
  - PG #24869, "The Rámáyan of Válmíki, translated into English verse", released 18 Mar 2008. The title page names Griffith as "Principal of the Benares College", with imprint "Benares: E. J. Lazarus and Co.", 1870–1874. — [PG #24869](https://www.gutenberg.org/cache/epub/24869/pg24869.txt)
  - An 1871 *Spectator* review: Griffith should "declare his preference for the Benares- over the Bengal recension", whereas Gorresio and Fauche used the Bengal recension. — [Spectator archive, 28 Jan 1871](https://archive.spectator.co.uk/article/28th-january-1871/19/the-ramayana)
  - DLI scans: `in.ernet.dli.2015.217237` (vol. 1, 1870) and `in.ernet.dli.2015.217235` (vol. 2, 1871). — [archive.org search](https://archive.org/advancedsearch.php?q=title%3A%28ramayan+valmiki%29+AND+creator%3A%28griffith%29&fl%5B%5D=identifier&output=json)
- **Hari Prasad Shastri.**
  - Dates 1882–1956, per Shanti Sadan and Wellcome Collection (search summary). — [Shanti Sadan](https://shantisadan.org/book-content/ramayana-complete-set/), [Wellcome](https://content.wellcomecollection.org/concepts/pz6hy88e)
  - Robert Goldman on the Indology list, 2015: "This work has been very substantially translated directly from Alfred Roussel's 1903 French translation", calling it "the most serious and extensive example" of "unethical reliance on earlier scholarship". The work is the 3-vol. London: Shanti Sadan, 1959 edition. — [INDOLOGY, July 2015](https://list.indology.info/pipermail/indology/2015-July/041592.html)
- **Clay Sanskrit Library.** No CC licence for the CSL volumes was found. Dominik Wujastyk (Indology list, 2018) said the volumes are "still very much within copyright" (search summary). A Digital CSL (eCSL) exists. — [eCSL](https://claysanskritlibrary.org/eCSL/), [Indology 2018 attachment](https://list.indology.info/pipermail/indology/attachments/20180806/b54187c6/attachment.htm)

### Inferences
- **Dutt's Mahābhārata** is the one PD English version with **verse numbers**, so it is the best bridge between Sørensen's or Mani's vulgate locators and the CE.
  - It is still a vulgate numbering, not the CE. Build a section concordance the same way as for Ganguli.
  - Rights: India, Dutt's death (commonly given as 1912, unverified) + 60 is long past. US: published before 1931, so PD.
  - Use the Google/Princeton scans (NOT_IN_COPYRIGHT), not uploader-licensed copies.
- **Griffith** is PD (US before 1931; India, Griffith's death year of 1906 is commonly given but unverified here). It is in verse, so poetic, from the Benares (northern/vulgate) text; its numbering will not match the Baroda CE. Use it as tier B for English, cited by Griffith's own canto, as is done for Ganguli.
- **Hari Prasad Shastri.**
  - India: PD since 1 Jan 2017 (1956 + 60).
  - UK: life + 70, so PD from 1 Jan 2027.
  - US: published 1952–59, foreign, so most likely URAA-restored and protected to about 2047–2054.
  - Combined with the Roussel allegation: **do not use**.
- **Van Buitenen** (Chicago, 1973–78) and **Debroy** (Penguin, 2010–14) are in copyright: note only, never quote beyond fair dealing. The Goldman Princeton Rāmāyaṇa is CE-based and the best scholarly English for the Rāmāyaṇa, but it is in copyright: tier B to consult, not to reproduce.

### Gaps
- Which base text Dutt translated (Bombay, Calcutta or Nīlakaṇṭha): no source found.
- Dutt's and Griffith's exact death years, and Ganguli's (already a gap in `sources.md`).
- Whether any CSL volume was ever released under CC: not found.
- Archive.org copies of Roussel (1903, PD) as an alternative French source: not checked.

---

## 4. Commentaries and later layers

### Takeaway
- **Nīlakaṇṭha's Bhāratabhāvadīpa**: scans of the 1929–36 Chitrashala (Kinjawadekar) edition, including Droṇa Parva (1931), and of the 1888 Bombay pothi are on archive.org. No e-text was found.
- **The Harivaṃśa CE** (Vaidya, BORI 1969) is on GRETIL in TEI, with star passages and App. I, under CC BY-NC-SA 4.0.
- **GRETIL hosts 18 Purāṇa entries.**
- **Jaimini Aśvamedha** is found only in its regional forms (Kannada Lakṣmīśa, Telugu); the Sanskrit e-text is not located.

### Cited Findings
- **Nīlakaṇṭha.** Archive.org items:
  - `cRkp_mahabharata-part-4-drona-parva-with-bharata-bhawadeepa-commentary-by-nilakantha-` ("Mahabharata Part 4 Drona Parva With Bharata Bhawadeepa Commentary By Nilakantha 1931 Poona Chitrashala Press")
  - `JFmg_mahabharata-with-commentary-of-nilakantha-1929-poona-chitrashala-press` (from "Rare Books at Panini Kanya Maha Vidyalaya Varanasi")
  - `zbdm-…` (Ādi and Sabhā, 1929)
  - `qfau-…` (Virāṭa, "Ramchandrashastri Kinjawadekar", 1931)
  - `fcih-…` (Śānti, 1932)
  - `bxqm_mahabharata-bhishma-parva-bharatabhavadipa-nilakantha-…-mumbai-1888-ganpat-krishnaji`
  - All carry uploader-set CC0. `mahabharata_nk` carries uploader-set CC BY-NC-ND 3.0.
  - — [archive.org search](https://archive.org/advancedsearch.php?q=title%3A%28mahabharata%29+AND+%28kinjawadekar+OR+chitrashala%29&fl%5B%5D=identifier&fl%5B%5D=licenseurl&output=json), [JFmg metadata](https://archive.org/metadata/JFmg_mahabharata-with-commentary-of-nilakantha-1929-poona-chitrashala-press)
- **Harivaṃśa.** GRETIL: "Constituted text and *-passages: gretil/corpustei/sa_harivaMza.xml", "App. I: sa_harivaMza-app1.xml" and a "Cumulative pada index". The legacy header reads: "Harivamsa, constituted text with star passages / Based on the ed. by Parashuram Lakshman Vaidya, Poona : Bhandarkar Oriental Research Institute 1969 … Corrections by Peter Scharf / TEXT WITH PADA MARKERS". The TEI licence is "Distributed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License." — [GRETIL index](https://gretil.sub.uni-goettingen.de/gretil.html), [sa_harivaMza.xml](https://gretil.sub.uni-goettingen.de/gretil/corpustei/sa_harivaMza.xml)
- **Purāṇas on GRETIL**, from the index: Agni [BI-ed.], Bhāgavata (with a 10.29–33 Śrīdhara-commentary file), Brahma, Brahmāṇḍa, Devībhāgavata (Devīgītā only), Garuḍa, Kūrma, Liṅga, Mārkaṇḍeya, Matsya (adhy. 1–176), Nārada, Narasiṃha, Śiva (books 1 and 7), Skanda, Skanda Revākhaṇḍa, Vāmana and Viṣṇu. All are TEI, and the TEI files carry GRETIL's CC BY-NC-SA 4.0. — [GRETIL index](https://gretil.sub.uni-goettingen.de/gretil.html)
- **Jaimini Bhārata, regional:**
  - `jaiminibharataa00sandgoog`: "The Jaimini Bharata: A Celebrated Canarese Poem, with Translations and Notes", 1852, NOT_IN_COPYRIGHT
  - `ehhf_jaimini-bharata-of-mahakavi-lakshmisha-kannada-bengaluru-1892-…`
  - `UVfM_jaimini-bharata-ashwamedha-parva-by-pillala-marri-pina-veera-bhadra-1883-…` (Telugu)
  - Thanjavur Sarasvati Mahal series no. 539, "Jaimini Bharata Maruti Mairavana Charitam"
  - — [archive.org search](https://archive.org/advancedsearch.php?q=title%3A%28jaimini+ashvamedha+OR+jaimini+bharata%29&fl%5B%5D=identifier&output=json), [1852 metadata](https://archive.org/metadata/jaiminibharataa00sandgoog)

### Inferences
- **Nīlakaṇṭha.** The commentary is 17th-century, so PD. Kinjawadekar's 1929–36 edition is the standard vulgate, and its chapter and verse numbers are the "Bombay/Chitrashala" numbering that most older secondary works use.
  - It is valuable as the **source of the vulgate numbering** for converting Mani and Dutt references, and as tier B "later layer" evidence (e.g. what Nīlakaṇṭha says about the chakravyūha womb story).
  - The editorial matter could carry Kinjawadekar's copyright in India, depending on his death date, which is unverified. The uploader CC0 marks are not evidence of anything.
- **Harivaṃśa CE** is tier A for Kṛṣṇa material. Its rights are the same as the MBh CE (BORI 1969 edition), plus GRETIL's NC wrapper: fine for internal citation, permission needed for full-text shipping.
- **Purāṇas on GRETIL** are vulgate or single editions, not critical editions (except where noted). Use them as tier B "later layer" sources, labelled as Purāṇic, never as epic canon.
- **Jaimini Aśvamedha** belongs in "what many heard" (tier C). It is the source of popular episodes absent from the CE, such as Babhruvāhana and the horse wars.

### Gaps
- No e-text of Bhāratabhāvadīpa (only scans), and no OCR quality check.
- The Sanskrit Jaiminīya Aśvamedhaparvan: neither a printed edition nor an e-text was located.
- The Harivaṃśa e-text's own "Zürich server" licence was not read.

---

## 5. Popular and regional tellings ("what many heard")

### Takeaway
- **PD scans exist** for most of the classic regional tellings: Pampa Bhārata (1898 Bibliotheca Carnatica), Kṛttivāsī (DLI, 1903 and later), Growse's 1883 Rāmcaritmānas (HathiTrust full view and Wikisource), Kannada Jaimini Bhārata (1852), Sāraḷā Dāsa (archive.org), Ezhuthachan, and Āndhra Mahābhāratamu (palm-leaf and print).
- **Project Madurai** is the likely e-text home for Kamba and Villi, but this was not verified.
- **Amar Chitra Katha and Rajagopalachari** appear on archive.org with **false PD/CC0 marks**. They are in copyright: cite them, do not reproduce.

### Cited Findings
- **Growse, Rāmcaritmānas.** The 1883 Allahabad (N.-W. Provinces and Oudh Government Press) edition of "The Rámáyana of Tulsi Dás", translated by F. S. Growse, is full view on HathiTrust (search summary), and Wikisource has a DjVu index. — [HathiTrust 002721438](https://catalog.hathitrust.org/Record/002721438), [Wikisource Index](https://wikisource.org/wiki/Index:The_R%C3%A1m%C3%A1yana_of_Tulsi_D%C3%A1s.djvu)
- **Kṛttivāsī Rāmāyaṇa.** DLI scans on archive.org: `in.ernet.dli.2015.291061` ("Krittibasi Ramayana", 1903), `in.ernet.dli.2015.302459` (1940), `in.ernet.dli.2015.302458` (undated), and an Uttara Kāṇḍa of 1978. — [archive.org search](https://archive.org/advancedsearch.php?q=title%3A%28krittivasi+OR+krittibasi%29&fl%5B%5D=identifier&output=json)
- **Pampa Bhārata.** `india.history.resource.111026`: "The Pampa Bharata or Vikramarjuna Vijaya of Pampa, an Ancient Jain Poem of 941 A.D.- Bibliotheca Carnatica", 1898, with no rights field. — [archive.org metadata](https://archive.org/metadata/india.history.resource.111026)
- **Sāraḷā Dāsa.** `odia-mahabharata`: "ସାରଳା ମହାଭାରତ: Sāraḷā Dāsa's Mahābhārata", with no rights field. — [archive.org metadata](https://archive.org/metadata/odia-mahabharata)
- **Telugu.**
  - `bwoz-232-andhra-mahabharatamu-adi-parvamu-…-nannaya-bhattu` (palm-leaf manuscript)
  - `andhramahabharat025923mbp` ("Andhra Mahabharatamu Samshodhita Mudranamu (Vol-1)", 1968, a critical/revised printing)
  - `eclv_champu-bharatam-…-1899-telugu-mysore`
  - — [archive.org search](https://archive.org/advancedsearch.php?q=title%3A%28andhra+mahabharatamu%29&fl%5B%5D=identifier&output=json)
- **Ezhuthachan.** `zbzh-173-adhyatma-ramayanam-kilippattu-by-thunchath-ezh…` (palm-leaf, uploader CC0), and `Adhyatma_Ramayanam_Kilippattu_Revised_Edition` (uploader CC BY-NC-ND 3.0). — [archive.org search](https://archive.org/advancedsearch.php?q=title%3A%28adhyatma+ramayanam+kilippattu%29&fl%5B%5D=identifier&fl%5B%5D=licenseurl&output=json)
- **Kamba Rāmāyaṇam.** Wikipedia's Ramavataram article links "Kamba Ramayanam at Project Madurai" (search summary). The Project Madurai FAQ says the Tamil Nadu government "has placed the literary works of several distinguished Tamil authors in public domain, after paying some royalties to family members". A complete English translation has been acquired by Penguin Random House India. — [Wikipedia: Ramavataram](https://en.wikipedia.org/wiki/Ramavataram), [Project Madurai FAQ](https://www.projectmadurai.org/faq.html), [Penguin newsroom](https://www.penguin.co.in/newsroom/penguin-random-house-india-acquires-complete-english-translation-of-kampans-ramayana/)
- **Villiputhurar.** The Villibhāratam has "4204 verses (as per Murray's publication) or 4336 verses (as per Vai.Mu.Ko's publication)" (search summary). — [Project Madurai](https://www.projectmadurai.org/index_en.html)
- **False rights marks on in-copyright popular works:**
  - Amar Chitra Katha comics, e.g. `gftd-mahabharata-the-victorious-pandavas-editor-anant-p…` (1989) and `bsdh-dronas-vow-mahabharata-33-…` (1987), carry uploader CC0.
  - C. Rajagopalachari's *Mahabharata* (Bharatiya Vidya Bhavan), item `mahabharata-c-rajagopalachari`, carries the Public Domain Mark 1.0.
  - — [archive.org metadata](https://archive.org/metadata/mahabharata-c-rajagopalachari), [archive.org search](https://archive.org/advancedsearch.php?q=title%3A%28mahabharata%29+AND+nilakantha&fl%5B%5D=identifier&fl%5B%5D=licenseurl&output=json)

### Inferences
- **Medieval texts are PD.** Pampa (941 CE), Kamban (12th c.), Villi, Sāraḷā (15th c.), Kṛttivāsa, Tulsidas, Ezhuthachan and Nannaya–Tikkana–Errana are out of copyright as *works*.
  - Modern **critical editions** and **translations** carry their own rights. The 1898 Rice edition of Pampa and the 1883 Growse are PD (pre-1931, and their editors died long ago).
  - The 1968 Telugu revised printing and modern Kṛttivāsī editions (1940, 1957, 1978) may not be.
  - Pick pre-1931 printings as the citable copy-text.
- **Tiering.** These are **tier C** ("what many heard"). Cite by poet, work, kāṇḍa or parva, canto and verse (or page of the PD edition), alongside the CE locator of the episode they diverge from.
- **ACK, Rajaji and TV serials.** Amar Chitra Katha (ACK Media), Rajaji's *Mahabharata* (1951 onward; Rajaji died 1972, so India protection runs to the end of 2032 if that date holds), B. R. Chopra's *Mahabharat* (1988) and Ramanand Sagar's *Ramayan* (1987) are **in copyright**.
  - Use them as evidence of a popular telling **by citation only**: title, issue or episode number, publisher or broadcaster, year, and a timestamp or page.
  - Quote at most a short line under fair dealing for criticism or review. Never use frames, panel art or audio.
  - The archive.org CC0/PDM marks on them are uploader errors, and relying on them would be reckless.
- **Folklore scholarship** (Hiltebeitel on the Draupadī cult; studies of Telugu and Kannada folk Mahābhāratas; Garhwali Pāṇḍav Līlā) is tier B *about* tier C tellings. Cite it for the existence of a folk variant, which gives the reader evidence that "many heard" a version.

### Gaps
- No Project Madurai page for Kamba or Villi was opened, so their file ids and licence wording are unverified.
- Specific folklore monographs (Hiltebeitel, *The Cult of Draupadī*; Roghair, *Epic of Palnāḍu*; Sax, *Dancing the Self*) were not looked up. Their rights are copyrighted by default.
- No scan of Sanderson's 1852 Jaimini translation was opened for quality.
- Kamba and Villi English translations (e.g. P. S. Sundaram's Tamil Nadu government translation): rights unverified.
- The exact wording of s.52 (fair dealing) was not re-read; the advocatekhoj fetch failed.

---

## 6. Iconography and visual references with clean rights

### Takeaway
- **CC0 or no-restriction:** Cleveland (CC0, with tagged Mahābhārata and Rāmāyaṇa folios), the Met (CC0 for public-domain works; note the **API change**) and Smithsonian Open Access (CC0).
- **Non-commercial only:** the British Museum (CC BY-NC-SA 4.0).
- **AIIS** is scholarly-only with commercial publicity prohibited, and the **Huntington Archive** has no blanket licence.
- **Wikimedia Commons** has a *Chakravyuha* category (19 files) and *Kurukshetra War (Angkor Wat)* categories, but every file needs a per-file licence check.

### Cited Findings
- **Cleveland Museum of Art Open Access API** (`openaccess-api.clevelandart.org`, `cc0=1&has_image=1`): 11 hits for "Mahabharata", 38 for "Ramayana". Examples:
  - 2018.189 "Draupadi Rescued from Abduction, from a Mahabharata" (CC0)
  - 2013.321 "Ghatotkacha and three demons in his company chase Bhagadatta, from Bhishma-parva" (CC0)
  - 2013.306 "Battle of Ravana and Jatayu, from Chapters 50 and 51 of the Aranya Kanda" (CC0)
  - 1996.361 "King Dasharatha confers with Kaikeyi, from the 'Shangri' Ramayana" (CC0)
  - — [CMA API query](https://openaccess-api.clevelandart.org/api/artworks/?q=Mahabharata&cc0=1&has_image=1), [object 2018.189](https://clevelandart.org/art/2018.189)
- **Met.**
  - The policy page offers "more than 406,000 hi-res images of public-domain works", identified by an Open Access icon. Metadata for the whole collection is CC0 (search summary). — [Met Image and Data Resources](https://www.metmuseum.org/policies/image-resources)
  - The API, verbatim from today's response: "/public/collection/v1/search was retired on 2026-10-01. It was backed by Solr and returned every matching object ID in one response; use /public/collection/v1.1/search, which is Elastic-backed and paginated via offset and limit." — [Met API](https://collectionapi.metmuseum.org/public/collection/v1/search?q=Mahabharata)
- **Smithsonian Open Access**: about 2.8 million images and data released under CC0 from February 2020. The Freer and Sackler (National Museum of Asian Art) had posted images since 2015 (search summary). — [Techdirt 2020](https://archive.techdirt.com/articles/20200225/14150743985/smithsonian-releases-28-million-images-3d-models-into-public-domain.shtml), [UDel VRC](https://sites.udel.edu/vrc/tag/smithsonian-institution)
- **British Museum**: most images "© The Trustees of the British Museum" under CC BY-NC-SA 4.0. Commercial use goes through British Museum Images. Free downloads are up to 750 px; up to 2,500 px is available on request (search summary). — [BM images and photography](https://www.britishmuseum.org/terms-use/copyright-and-permissions/images-and-photography)
- **AIIS Center for Art and Archaeology**: the terms posted on vmis.in say prints are released "to genuine scholars for scholarly publications". Commercial publicity is prohibited. Museum objects need the owner's written consent. Users must credit AIIS, notify the Center and send a free copy (search summary). The contact is caa.archives@aiis.edu.in. — [vmis.in terms](https://vmis.in/ImagePermissions/terms), [INDOLOGY Feb 2024](https://list.indology.info/pipermail/indology/2024-February/058710.html)
- **Huntington Archive** (University of Chicago, DSAL), verbatim from the contact page as summarised: "some materials on our website are not copyrighted to us, and, therefore, we are not always able to grant permission to use those images". Questions go to dsal@uchicago.edu (search summary). — [Huntington contact](https://dsal.uchicago.edu/huntington/contact.html), [about](https://dsal.uchicago.edu/huntington/about.php)
- **Wikimedia Commons** (API, today):
  - `Category:Chakravyuha` has 19 files and no subcategories.
  - Related categories found by search: `Category:Chakravyūha`, `Category:Abhimanyu`, `Category:Padmavyūha`, `Category:Kurukshetra War (Angkor Wat)`, `Category:W Gallery, S section. Battle of Kurukshetra`, and `Category:Images by Gerd Eichmann/Kambodscha/Angkor Wat-Reliefs`.
  - `Category:Ramayana in art` has 3 files and 7 subcategories.
  - "Mahabharata in art", "Mahabharata reliefs" and "Hoysaleswara Temple, Halebidu" were not found under those exact names.
  - — [Commons: Chakravyuha](https://commons.wikimedia.org/wiki/Category:Chakravyuha), [Commons: Kurukshetra War (Angkor Wat)](https://commons.wikimedia.org/wiki/Category:Kurukshetra_War_(Angkor_Wat))

### Inferences
- **For an app with possible commercial use, the clean pool is Cleveland, Met Open Access, Smithsonian and Commons files that are verified PD or CC0/CC BY.**
  - Cleveland's folios are especially apt. Several name the parvan or kāṇḍa, such as "from Chapters 50 and 51 of the Aranya Kanda", so they can be tied to claim ids as "from our collection"-style visual references.
  - Any `src/` Met client must use `/v1.1/search` (paginated).
- **British Museum** images are NC: fine for internal reference boards, not for shipping.
- **AIIS and Huntington** are reference-only unless a written licence is obtained. AIIS explicitly bars commercial publicity.
- **Photos of reliefs.** For Halebidu, Ellora and Angkor Wat panels, the monument is PD but the *photo* carries the photographer's rights. Commons CC BY-SA photos require attribution and share-alike on derivatives, and a render conditioned on them may count as a derivative, so flag this for the render pipeline (rule 1 still applies: no deity close-ups).

### Gaps
- LACMA's open-access terms: not found this session.
- ASI photography and reproduction rules for protected monuments (Halebidu and Ellora are ASI-protected): not researched.
- Commons' Halebidu category name: not resolved, because the Commons API rate-limited us on the second pass.
- The 19 Chakravyuha files were not individually licence-checked.
- Met v1.1 search results for epic objects: not run.
- AIIS's own (non-vmis) terms page and fee schedule: not found.

---

## 7. Tier ranking of every source (A = "the text"; B = scholarship or translation; C = popular-telling evidence; D = pointer only)

### Takeaway
Only **critical-edition texts** are tier A: BORI MBh (already held), the Baroda Rāmāyaṇa via Smith, and the BORI Harivaṃśa via GRETIL. MCI is the strongest tier B because it is CE-keyed. Everything regional, comic or TV is tier C. Wikidata and Wikipedia are tier D.

### Cited Findings
(Each row's evidence is cited in sections 1–6 above.)

| Source | Tier | Numbering | India rights | US rights | Machine-readable |
|---|---|---|---|---|---|
| Smith Baroda CE Rāmāyaṇa (`ramayana/text/UR`) | A | CE `6001001a` | Baroda print: editors' dates unverified; e-text has no stated licence | likely protected (post-1931) | yes, plain text |
| GRETIL `sa_rAmAyaNa.xml` | A (cross-check) | CE `R_1,001.001` | CC BY-NC-SA 4.0 (GRETIL) | same | TEI, txt |
| GRETIL Harivaṃśa CE (Vaidya 1969) | A | CE + star + App. I | BORI print + CC BY-NC-SA 4.0 | protected | TEI, txt |
| MCI (Mehendale 1993) via CDSL | B (finding aid) | **CE** | in copyright (print); digital CC BY-NC-SA 3.0 | protected | yes |
| Sørensen INM (1904–25) | B | Calcutta | PD (print); digital CC BY-NC-SA 3.0 claim | PD | yes (CDSL); scans |
| M. N. Dutt MBh (1895–1905) | B | vulgate, numbered | PD | PD | scans only |
| Griffith Rāmāyaṇa (1870–74) | B | Benares recension | PD | PD | PG #24869 text |
| Dutt Rāmāyaṇa (1891–94) | B | vulgate | PD | PD | scans |
| Hopkins *Epic Mythology* (1915) | B | vulgate | PD if d. before 1966 | PD | scans |
| Nīlakaṇṭha / Kinjawadekar (1929–36) | B (later layer; vulgate numbering) | Bombay vulgate | commentary PD; editor unverified | 1929/31 issues PD only if before 1931 | scans |
| GRETIL Purāṇas | B (later layer) | edition-specific | CC BY-NC-SA 4.0 | same | TEI |
| MW 1899, Apte 1890 (CDSL) | B (lexical) | n/a | print PD; digital NC/SA conflict | print PD | yes |
| Vettam Mani PE (1975) | B, pointer only | vulgate | in copyright | in copyright | yes (CDSL) |
| Hari Prasad Shastri (1952–59) | avoid | — | PD since 2017 | likely protected | — |
| Van Buitenen, Debroy, Goldman, Clay | B, consult only | CE (vB, Debroy, Goldman) | in copyright | in copyright | — |
| Pampa 1898, Growse 1883, Kṛttivāsī 1903, Jaimini 1852, Sāraḷā, Ezhuthachan, Āndhra MBh | C | own cantos | PD as works; check edition | pre-1931 editions PD | scans; e-text unverified |
| Kamba, Villi (Project Madurai) | C | own verses | PD as works; PM terms unverified | — | e-text (unverified) |
| ACK, Rajaji, B. R. Chopra 1988, Sagar 1987 | C (cite only) | issue/episode | in copyright | in copyright | — |
| Cleveland, Met OA, Smithsonian | visual, clean | object no. | CC0 | CC0 | APIs |
| British Museum | visual, NC | object no. | CC BY-NC-SA 4.0 | same | web |
| AIIS, Huntington | visual, reference only | — | permission needed | — | — |
| Wikidata | D (id skeleton) | — | CC0 | CC0 | SPARQL |
| Wikipedia, Commons category pages | D | — | CC BY-SA | — | — |

### Inferences
- **Priority order for ingest:**
  1. Smith Rāmāyaṇa UR files, which open Rāmāyaṇa chapters.
  2. MCI `mci.txt`: parse the CE locators into a candidate entity and event table (vyūhas, war days, tīrthas, animals), with every row verified against Smith.
  3. Sørensen `inm.txt` for aliases and epithets, with locators bridged Calcutta → Ganguli → CE.
  4. Wikidata QIDs as join keys only.
  5. Cleveland CC0 folios for "from our collection" visual references.
- **Licensing actions to log in `docs/decisions.md`:**
  - Email Cologne or the Sanskrit Library about the csl-orig licence conflict.
  - Ask the Oriental Institute, Baroda, for Rāmāyaṇa CE permission, together with the BORI request already planned.
  - Do not treat archive.org uploader CC0 or PDM marks as rights evidence. This is now seen on BORI, ACK, Rajaji and Mani items.

### Gaps
- Exact death dates for the editors and translators, which drive several Indian terms: Sørensen, Hopkins, Mani, Mehendale, Dutt, Griffith, Kinjawadekar, Bhatt and Shah.
- Whether the 1929–1931 Chitrashala volumes count as published before 1931 for US purposes: the Droṇa volume (1931) is borderline and was not checked.
