# Accessibility & mobile-UX review: product surface s01–s18

**Verdict: not shippable as drawn.** The dark palette is sound. The failures are an unstoppable auto-advance, a scene with no exit, gesture-only controls, sub-4.5:1 palm-leaf text, Indic typography and absolute layouts that collide at 360×740.

## Contrast (WCAG 1.4.3 / 1.4.11, computed from the tokens; overlays are worst case over a white video frame)

| Pair (where) | Ratio | Result | Fix |
|---|---|---|---|
| ash / night, ash / s1 (muted, tiny) | 7.0 / 6.7 | pass | n/a |
| ash2 / night (tab labels 11px, s04/14/15) | 4.23 | **fail** | `#948D7A` (5.85) |
| ash2 / s1 (studio KPI, axis 11px) | 4.03 | **fail** | `#948D7A` (5.58) |
| sindoor / night (९, दी) | 5.13 | pass | n/a |
| ink / leaf3 | 5.79 | pass | n/a |
| ink2 / leaf3 (s08 “Checked by”, s14/s16 cite) | 4.05–4.49 | **fail** | `--ink2:#3A2A12` (4.89) |
| leafred / leaf3 (s06 cite 12px, at 68%) | 3.98 | **fail** | `--leafred:#5A1C0A` (4.63 at worst) |
| leafred / leaf2-3 (s08 “own” body, 62%) | 4.07 | **fail** | `#5A1C0A` |
| #6b5a3e / leaf (s08 “Popular telling” 11px) | 3.37 | **fail** | use `--ink2` (5.8) |
| #54452c / leaf (s08 popular body) | 4.51 | borderline | `#4A3B24` (5.26) |
| AI label parch / 62% night (s07/08/11) | 4.38 | **fail** | bg `rgba(13,14,11,.80)` (8.66) |
| leaf1 button text / 60% night (s07) | 2.72 | **fail** | bg `.85` (6.86) |
| flame witness tag / scrim-t 35% (s07) | 1.82 | **fail** | pill, bg `.80` (8.51) |
| caption parch / scrim-b 83% (s07) | 9.51 | pass | n/a |
| hotspot ring / bright frame (non-text) | 1.18 | **fail** | dark halo (3.07+) |

The current stills are dark; real renders with fire and sky will not be.

## Findings

1. **[blocker] s11: 2.2.1 Timing.** The 5 s auto-advance ring has no pause or cancel, and there is no setting for it. Fix: make the ring a button ("Stop autoplay", `aria-live="polite"`), add an "Autoplay next chapter" setting, and disable autoplay when `isVoiceOverRunning`/`isTouchExplorationEnabled`. Default to 10 s.
2. **[blocker] s07, s11: no visible exit.** The AI label takes the top-left slot that holds the dismiss chevron on s06, and iOS has no system back. Fix: keep `.ibtn` dismiss at `top:44px;left:10px` and move `.ai` to `top:100px`.
3. **[blocker] s06: "Tap the page to turn" is gesture-only (2.5.1, 4.1.2).** Fix: add a visible `Next ›` button (44×44) beside pause and keep page-tap as a shortcut. Expose `.beats` as `role="progressbar" aria-valuetext="Part 1 of 5"`.
4. **[blocker] 360×740 collisions.** Absolute positioning overlaps content on s02 (grid ends at 670, CTA starts at 654), s08 (actions cover "From our collection"), s09 (metadata at `top:600px` runs off screen), s11 (card at `top:470px`), s13 (checklist under CTA) and s10 (`width:390px` SVG clips "Droṇa · drew the wheel"; card covers the Parīkṣit node). Fix: `.screen{display:flex;flex-direction:column;height:100dvh} .scroll{flex:1;overflow:auto} .footer{position:sticky;bottom:0}`. For s10 use `svg{width:100%;height:auto}`.
5. **[major] Palm-leaf tokens (s06, s08, s14, s16).** Apply `--ink2:#3A2A12; --leafred:#5A1C0A`; replace `#6b5a3e` with `--ink2`.
6. **[major] Scene overlays (s07, s08, s11).** Set `.ai{background:rgba(13,14,11,.8);font-size:12px;height:28px}` and localise its text, because `text-transform:uppercase` does nothing in Indic scripts. Put the witness tag in the same pill. Use `.btn` leaf `background:rgba(13,14,11,.85)`. On the hotspot add `box-shadow:0 0 0 2px rgba(13,14,11,.6)`. `.beats` also overlaps `.ai`.
7. **[major] Indic typography.** `.eyebrow` and `.tl` use 0.12–0.14em tracking, which breaks conjunct shaping, and uppercase is meaningless in these scripts. 11–11.5px is below Indic legibility. Fix: `:lang(hi,mr,ta,te,kn,ml,bn,gu,pa,or) .eyebrow{letter-spacing:0;text-transform:none;font-size:13px} :lang(...) .tiny{font-size:13px} :lang(...) .h1,.h2,.h3{line-height:1.45} :lang(...) body{line-height:1.7}`. Drop faux italic on non-Latin text.
8. **[major] s02, s18: Telugu renders unshaped.** It appears as a bitmap fallback ("తెలుగు" in disconnected glyphs), and the webfonts did not load in the render. Bundle subsetted fonts in the APK (no ten-family fetch on a ₹15k phone) and test shaping in all eleven scripts.
9. **[major] Text expansion and Dynamic Type (1.4.4).** Fixed heights clip at 200% font scale and with long Tamil/Malayalam words: `.btn` 52, `.chip` 30, `.lang` 62, `.plan` 68, `.ai` 24, `.tab` width 72. Fix: `min-height` in place of `height`, sizes in `rem`, `overflow-wrap:anywhere`. Let the s11 button pairs wrap with `flex-wrap:wrap; .btn{flex:1 1 150px}`.
10. **[major] s09: "Pinch to zoom" (2.5.1).** Add +/- buttons and double-tap to zoom.
11. **[major] s15: Reduce motion defaults off.** Default it to the OS setting (`UIAccessibility.isReduceMotionEnabled`, `ANIMATOR_DURATION_SCALE==0`). When on: crossfade the page turn, freeze the waveform and hotspot pulse, serve stills over audio.
12. **[major] Captions (s07).** The italic pull-quote is not a caption track. Provide synchronised captions (1.2.2) in the chosen caption language that respect the system caption style (`MACaptionAppearance`/`CaptioningManager`), `font-style:normal` for Indic, and `max-width:34ch` that grows upward.
13. **[major] s12: screen off.** Lock screens cannot show a custom marker list. Map skip to the next/previous marker via `MPRemoteCommandCenter`/MediaSession, put the marker name in the title, label the chevrons, and localise metadata (narration is Tamil, labels are English).
14. **[major] Screen-reader semantics.** On s02, make the cards `role="radiogroup"`, give each native name a `lang` attribute (`lang="ta"`) so TalkBack picks the right voice, and add a checkmark to the selected card. On s06, set `lang="sa"` on the verse and hide the IAST transliteration from TTS. Give s10 a list fallback and s07 a "People in this scene" list.
15. **[minor] Colour-only state (1.4.1).** s05 marks watched chapters by gold numbers only, so add a ✓. s10 marks an adversary with a sindoor ring only, so add the word.
16. **[minor] Targets under 44pt.** `.chip` filters (30), the s04 "Remind" and "EN" chips (32), the s04 "All" text link, the s08 inline "see the page" link, and the s12 skip glyphs (28) are all too small. Use `min-height:44px`.
17. **[minor] No focus styles** for Switch Access. Add `outline:2px solid var(--gold);outline-offset:2px`.
18. **[minor] s16.** The claim lives only in the image; repeat it in the message text.
