# s1e3 canon check: the handoff's claims against the e-text

Checked 2026-10-04 against the GRETIL e-text of the critical edition (BORI; Tokunaga et al., rev. John Smith), files pinned in `content/canon/sources.json`. Every verse was read in the e-text. This is **not** a scholar check. Verse numbers are the e-text's, page numbers are unverified until DHE-1, and nothing here replaces the scholar's sign-off (rule 9).

| Handoff claim | Handoff ref | E-text | Verdict | Claim id |
|---|---|---|---|---|
| Abhimanyu: father taught him to break in; cannot get out if calamity comes | 7.34.19 | 7.34.19a–c, word for word as the handoff quotes it | **Confirmed** | `mbh.7.34.19` |
| Surrounding verses | 7.34.17–21 | 17, 18 (with *abhimanyur uvāca* before it), 19, 20 (*yudhiṣṭhira uvāca*; reads **yudhā**), 21 | Confirmed; check *yudhā* in print | `mbh.7.34.17-21` |
| Learns arms from Arjuna as a boy | 1.213 | 1.213.65: *catuṣpādaṃ daśavidhaṃ dhanurvedam … arjunād veda*; birth to Subhadrā at 1.213.58–61 | Confirmed, now at verse level | `mbh.1.213.65`, `mbh.1.213.58-61` |
| Droṇa's vow to fell a great Pāṇḍava warrior | 7.32 (c. v.13) | **7.32.12**c: *adyaiṣāṃ pravaraṃ vīraṃ pātayiṣye mahāratham*. v.13 is the array the gods cannot break, with Arjuna drawn away | **Corrected: v.12** | `mbh.7.32.12`, `mbh.7.32.13` |
| Only Abhimanyu, Arjuna, Kṛṣṇa or Pradyumna can break it | 7.34.15 | 7.34.15, "*pañcamo 'nyo na vidyate*" | Confirmed | `mbh.7.34.15` |
| Arrangement of the array; no count of rings | 7.33 | 7.33.12–20: the teacher's *cakravyūha*, kings set within, Droṇa at the head, Jayadratha beside him. No rings are counted | Confirmed | `mbh.7.33` |
| Broke it in many places (*anekadhā*) | 7.32 | 7.32.18c: *bibheda durbhidaṃ saṃkhye cakravyūham anekadhā* | Confirmed, v.18 | `mbh.7.32.18` |
| The Saṃśaptakas draw Arjuna south | 7.32 | 7.32.15: *āhvayann arjunaṃ … dakṣiṇām abhito diśam* | Confirmed, v.15 | `mbh.7.32.15` |
| Jayadratha's boon from Śiva; no "for one day" | 3.256; 7.41 | 3.256.25–28: hold back all Pāṇḍavas except Arjuna; no time limit. Retold in 7.41 | Confirmed | `mbh.3.256.25-28`, `mbh.7.41` |
| Jayadratha blocks the path Abhimanyu opened | 7.41–42 | 7.42.6c: *tat khaṇḍaṃ pūrayām āsa yad vyadārayad ārjuniḥ* | Confirmed, v.6 | `mbh.7.42.6` |
| The six warriors | 7.32, 7.48 | 7.32.19c *ṣaṭsu vīreṣu*; 7.48.21a *droṇakarṇamukhaiḥ ṣaḍbhir* | Confirmed | `mbh.7.32.19`, `mbh.7.48.21` |
| The chariot wheel | 7.47 | 7.47.38–39: takes up a wheel and rushes at Droṇa; 7.48.3: they cut it to pieces | Confirmed | `mbh.7.47.38-39`, `mbh.7.48.3` |
| Killed by Duḥśāsana's son | 7.48 | 7.48.12–13: mace to the head as he rises | Confirmed. Depict by suggestion only | `mbh.7.48.12-13` |
| "One alone, he lies slain; this, we hold, was not dharma" | 7.48 (c. v.22) | **7.48.21**c: *eko 'yaṃ nihataḥ śete naiṣa dharmo mato hi naḥ* | **Corrected: v.21** | `mbh.7.48.21` |
| Arjuna finds his son slain; vows to kill Jayadratha | 7.50, 7.51 | 7.50 (e.g. v.22, *kaccin na nihataḥ śete saubhadraḥ*); vow at 7.51.20, *śvo 'smi hantā jayadratham* | Confirmed | `mbh.7.50`, `mbh.7.51.20` |
| Uttarā, daughter of Virāṭa of Matsya | 4.67 | 4.67.7: Arjuna accepts Uttarā as daughter-in-law | Confirmed, v.7 | `mbh.4.67.7` |
| Parikṣit born and revived | 14.65–69 | Born 14.65.8; stillborn by Aśvatthāman's weapon (14.65.16); revived 14.68.18–24; breathes 14.69.3 | Confirmed | `mbh.14.65-69` |
| Age: *bāla*, *śiśu*, *aprāptayauvana* | 7.32 | *aprāptayauvanam* 7.32.21; *bāle*, *bālam* 7.32.22–23. *Śiśu* is **not** in 7.32: it is at 7.34.26 and 7.48.32 (*śiśuke 'prāptayauvane*) | **Corrected: śiśu at 7.48.32** | `mbh.7.32.21-23`, `mbh.7.48.32` |
| Aṣṭāvakra learns in the womb | 3.132 | 3.132.8–9: speaks from the womb to correct his father, and is cursed | Confirmed | `mbh.3.132.8-9` |

## For the scholar: the womb story is in the apparatus

The handoff and the scholar review say the womb story is absent from CE 7.32–51. That is true of the **constituted text**. The scholar review noted that the apparatus had not been checked, and the apparatus has it: star passage **\*259, after 7.34.18**, kept in `content/canon/mbh/variants.json`.

> śṛṇu rājan mahābāho vacanaṃ mama suvrata / purā garbhagate vāpi cakravyūhapraveśanam / mukhāt kṛṣṇasya rājendra śrutam asmi mayā prabho / tasmād vyūhaṃ praviśyāmi cakrākhyaṃ nṛpasattama

Draft sense, unreviewed: "Hear, king… long ago, while still in the womb, I heard from Kṛṣṇa's own mouth how to enter the cakravyūha; so I will enter the wheel-array."

So the popular telling has a textual foothold in part of the manuscript tradition: the critical edition relegates it to the apparatus rather than leaving it out of the tradition altogether. Its manuscript distribution (which recensions carry \*259) needs the printed apparatus. Two things follow:

1. The reveal's tier 2 should not say or imply that the womb story has no textual basis. "The critical edition's text does not tell it; some manuscripts do (\*259)" may be both more accurate and more interesting.
2. A variant like this is exactly the "hidden detail" the product sells (product plan, Sourcing).

No claim is written for \*259: the claim-id form has no star-passage syntax yet, and the wording is the scholar's call. **For Avi and the scholar.**
