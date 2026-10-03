# Product review: Dheevara mockups (s01–s18)

**Verdict: the trust layer is ahead of the market (reveal, page, lineage, AI label), but the journey that has to clear the gate is not designed yet. The cold open comes too late, the link landing is missing, and the paywall and release rules contradict each other. Fix the three blockers before the pilot.**

## Findings

1. **[blocker] s03, s06: the chapter opens on a chanted page, not a cold open.** The first scene lands at about 30–40 s (splash, language, promise wall, ~15 s of chant). s18 shows the steepest drop (100→82%) inside the Book page band. Shot 01 "cold open" in s17 is a title card. *Fix:* open on a 5–8 s witness shot with one narrated line, chant under the scene, and move the page to second 10–20. Cut s03 to one line plus CTA. Preselect the language from the device locale. Target: first scene under 10 s.

2. **[blocker] Missing screen: link landing.** The pilot runs on WhatsApp, Shorts and Reels, and the gate is measured there (DHE-20). No screen shows what a link opens. *Fix:* a web or instant player that needs no install, with a sharer token and UTM, the same telemetry schema, and a deferred deep link to the same timestamp.

3. **[blocker] s05, s11, s13: free/paid and release rules conflict.** The paywall says only chapter 1 is free, but s05 opens chapters 1–3. s11 auto-advances into chapter 4, which is marked "Tonight at 7 pm". *Fix:* write one rule table for free, member and released. When the next chapter isn't out, s11 shows "Chapter 4 at 7 pm your time · Remind me" instead of the countdown.

4. **[major] Cadence vs carry.** Time-gating 2-minute chapters measures patience, not cliffhangers, and makes the 45% carry gate hard to hit. *Fix:* bank at least 5 chapters before launch and let members binge. Release at 7 pm in the viewer's timezone, not IST. Define carry as a start within 24 h of the next chapter becoming available.

5. **[major] s07, s08: nothing marks the reveal moment.** The persistent pill is right but has no beat cue. A 47% tap rate with about 58% still watching at the beat means the denominator is undefined. *Fix:* the narrator says "the text says otherwise" and the leaf pulses. Define taps as a share of viewers who reached the beat. Pause narration while the sheet is open (don't play it muffled underneath) and resume at the same timestamp.

6. **[major] s08: placeholders on the most-shared surface.** "[The detail only Dheevara's books hold]" and "Checked by Dr. ——" are still on screen. *Fix:* hide an empty third tier, and block publishing without a named scholar (DHE-18).

7. **[major] s13: no paywall placement or local pricing.** No screen shows when the paywall appears. USD sits next to an INR footnote. "7 days free" plus "refund in 7 days" is redundant, and the store handles refunds. *Fix:* trigger it at the chapter 1 cliffhanger and on locked taps. Use storefront prices (USD, GBP, AED, CAD, INR) and UPI autopay. Match trial length to the chapters a trial user can actually watch. Add restore. Keep "family profiles" off the paywall until a profile screen exists.

8. **[major] s16: the share card doesn't link back properly.** "Watch the chapter ›" sits inside an image and can't be tapped. The link opens chapter 1 although the reveal is from chapter 3. The card is in English for a Tamil-listening family. *Fix:* send the image plus an OG link into chapter 3 at the reveal, gift-unlocked for the recipient. Use the sharer's narration language. Attribute installs and trials to the sharer.

9. **[major] s02, s07: language switching.** s02 offers 11 languages but the pilot ships 5. The "change on any chapter" promise has no control in the player. *Fix:* list 5 languages, with the rest under "notify me" to collect demand data. Offer narration and caption language separately in onboarding, as s15 does. Add an in-player switch that keeps the timestamp.

10. **[major] s17, s18: the tools find the losing shot but can't act on it.** s18's 64% completion disagrees with a curve that ends near 49%. There are no cuts by source, by audio vs video, or by new vs returning. The drop card has no actions. In s17, the reveal shot's claims (7.41, 3.256) don't match the sheet (7.34.19). *Fix:* define completion as reaching the cliffhanger, and add those cuts plus shot-id ticks on the x-axis. Give the drop card "Open shot / Re-render / A/B variant" actions. Show retention per shot on s17. Add a QC rule that reveal-shot claims must equal reveal-sheet claims.

11. **[minor] s11: auto-advance.** s18 shows 3% lost before the next card appears. *Fix:* overlay the card on the last 3 s. In audio, chain chapters with a 2 s sting.

12. **[minor] s12: audio mode.** iOS can't show a custom marker card on the lock screen. *Fix:* use Now Playing chapters plus a Live Activity, and the Android media notification. Count "heard the reveal" for audio sessions so they don't drag down the tap gate.

13. **[minor] s10: lineage pulls viewers out mid-chapter.** *Fix:* pause on open, return to the same timestamp, and promote lineage after the cliffhanger.

14. **[minor] s15, s14: reporting and offline.** "Report a mistake" is buried in settings, and there's no free-tier download state. *Fix:* report from the reveal sheet and player menu, prefilled with claim id and timestamp. Show a locked download state for free users.

15. **[minor] s07: layout.** The progress segments collide with the AI pill, and the gate ring can't be discovered. *Fix:* move the pill below the segments and show a one-time hint.

## Missing screens (priority order)

**Pilot**
1. Link landing: web or instant player, with attribution and a deferred deep link.
2. Paywall triggers: chapter 1 cliffhanger to trial, locked tap, success, restore.
3. Sign-in at trial start (Apple, Google, phone OTP). Never before chapter 1.
4. Next chapter not out: cliffhanger variant, push primer at "Remind", the push itself.
5. Player chrome: pause, scrub, captions, mid-chapter language switch.
6. Offline, error and buffering, with fallback to downloaded audio.
7. Empty and first-run states: home with nothing to continue, empty Saved.
8. Report-a-mistake flow and its scholar-queue view.
9. Subscription management and cancel (a store requirement).

**Before Navratri or Diwali**
10. Festival drop page (s04 promises 11 Oct) and gift redemption.
11. Family profiles: picker, per-profile language, kid profile with content notes.

**Later**
12. Search, full graph explorer, Mythik comparison in Studio.
