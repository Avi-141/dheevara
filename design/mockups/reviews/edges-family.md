# Review: edges, family, festival (s22–s35)

**Verdict: close, not cleared. Two blockers: s31 breaks at 360, and the Devī season has no witness rule beyond its frame. Chapter 3 airs on 13 Oct.**

I checked every shot at both sizes. Contrast from the `:root` tokens passes everywhere (≥5.1:1).

## Findings

1. **[blocker] s31 at 360: the list clips.** Row 3 hides under the footer, and `overflow:hidden` makes rows 4–9 unreachable at any width. Fix: `#s31-festival .body{overflow-y:auto;padding-top:clamp(120px,22vh,196px)}`, and give the SVG `height:auto`.

2. **[blocker] s31: no witness rule after the frame.** Suratha and Samādhi only *hear* Medhas, so the frame is right. Beyond it, the obvious witnesses are the devas, who are revered figures (rule 1). DM 2 also builds the Devī limb by limb from the gods' tejas (her face from Śiva's, her breasts from Soma's), which invites close-ups. Fix:
   - Show the episodes as told: relief panels at listener distance.
   - Add `deity-face-closeup`, `deity-form-assembly` and `deva-pov` to the season's `forbidden` list.
   - End night 9 on DM 13, the boons to the king and the merchant, so the witnesses close the season.

3. **[major] s31, s34: the cites fail rule 2.** "DM 1" gives no verse, and `.ep em` turns the cites grey. "Mārkaṇḍeya Purāṇa" is a text, not an edition. Fix:
   - Use verse ranges, splitting DM 1 where Medhas begins Madhu–Kaiṭabha.
   - Add `.ep em.cite{color:var(--amber)}`.
   - Name the edition (e.g. Gita Press). The MārkP chapters are 81–93 in some editions and 78–90 in others.

   The mappings are correct (high confidence): chapters 1 and 2 are DM 1, chapter 3 is DM 2.

4. **[major] s31: the Saptaśatī is recited as mantra.** Use a human reciter, call the season "a telling, not a pāṭha", and have the scholar clear any verse chanted out of order.

5. **[minor] s31: the dates are correct.**
   - Ghaṭasthāpana is 11 Oct, Navamī 19 Oct and Vijayadaśamī 20 Oct. Bengal and Karnataka end a day later.
   - Confidence: high for the pan-Indian pañcāṅga, moderate for diaspora temples. Add "· Vijayadaśamī 20th" and record which pañcāṅga we follow.
   - The wording ("the gods' anger", "family turned him out") is faithful.

6. **[major] s31: price and access are missing.** Tag row 1 "Free" and rows 2–9 "Members". Make the button "Give it · $X", and draw the giver's sheet.

7. **[major] s32: "Every language" overclaims, since the pilot ships five.** Use "5 languages".
   - "Yours to keep" conflicts with the meaning of "keep" on s35. Use "no membership needed".
   - Draw these states: no app installed, already claimed, and sign-in after Accept.

8. **[major] s28: the reply contradicts itself.** It says "will add it… when we find it" yet links to "the updated reveal". "A beautiful telling" reads as a pat before a "but". The scholar is unnamed (rule 9) and nothing is cited (rule 2). Copy:

   > "Many families tell it this way, as kathā has for generations. The critical edition doesn't: Abhimanyu says his father taught him to break in (7.34.19) and learns arms from Arjuna as a boy (1.213). The epic does know womb-learning: Aṣṭāvakra corrects his father before birth (3.132). We're tracing your grandmother's telling and will tell you when it joins the reveal."

   Sign it with a name, add cite chips, and drop the link.

9. **[major] s27: the sheet frames a family telling as an error.**
   - Retitle it "Tell our scholar" and add an "Another telling" chip.
   - With the keyboard up the sheet overflows at 360, so go full height with Send `position:sticky`.
   - Hide free text on children's profiles.

10. **[major] s22: asking for sign-in before the store sheet costs trials,** and Apple 5.1.1(v) discourages it. Show the store sheet first, then "Save your place" with "Not now". Add phone OTP.

11. **[major] s29, s30: there is no parental gate.** Kavya can tap K and enter Meera's profile. Require a PIN or Face ID to leave a children's profile, and draw the limit-reached state.

12. **[major] s35: there is no "Restore purchases".** Also draw the Play, ₹999 and billing-problem states.

13. **[major] Chips are 36pt, and they are the main controls on s27 and s32.** Set `.chip{min-height:44px}`.

14. **[minor] s30.** "The great leap" is from Sundara Kāṇḍa, which s34 lists as "soon", and it has no cite. During Navarātri, lead with a children's cut of the Devī season, and handle Raktabīja (DM 8) gently.

15. **[minor] s29.** அம்மா and தமிழ் are correct and shape cleanly. The 12.5px sublabel is too small for Tamil: `.pf [lang=ta]{font-size:14px}`.

16. **[minor] s33.**
    - `1.213` needs a verse.
    - Search must ignore diacritics and match across scripts (अभिमन्यु, அபிமன்யு).
    - Rename "4 · The vow" to "Arjuna's vow" so it doesn't clash with "The vow of Droṇa".
    - Check the order: "The gatekeeper" (7.41–42) comes before ch 4's events (7.51).

17. **[minor] s23.** "3 h 12 m" contradicts the 9:41 status bar. Draw the notifications-denied state.

18. **[minor] s30, s31: decorative amber and sindoor break "amber = source, sindoor = now".** Use `--fg3` strokes.

19. **[minor] Widows.** "3 Oct / 2027" (s35 at 360) and "in 4 / chapters" (s33) break; use `&nbsp;`. Geist's spacing breaks in the shots ("No t now"), so re-shoot with vendored woff2.

20. **[minor] s24, s25.** Make the offline takeover a banner over Library, and draw the no-downloads case. On s25, "downloaded" should be "already loaded".

Date sources: [cabbazar](https://cabbazar.com/blog/navratri-dussehra-2026-dates-devi-temple-trips-and-cab-booking-guide/), [indiabonds](https://www.indiabonds.com/kuchbhi/when-is-navratri-2026/).
