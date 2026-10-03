# Art director review: product-surface mockups

**Verdict: the direction is right. Night, parchment, gold and sindoor read as respectful, and s06, s08 and s16 are already on-brand. Not ready to sign off: the shots were rendered without the real fonts, and three screens have visible collisions. Re-shoot after fixing items 1–4.**

1. [blocker] **All screens: wrong fonts in the shots.** Google Fonts did not load in the headless run. Figtree fell back to DejaVu Sans (wide and heavy), Tiro fell back to Liberation Serif or FreeSerif, Devanagari to FreeSans, and Telugu shapes incorrectly (s02, s18 chips). We can't judge weight or pairing from these shots. Fix: vendor woff2 files in `design/mockups/fonts/`, add `@font-face` with `font-display:block`, and in `shoot.mjs` await `document.fonts.load('16px Figtree')` and the same for each Tiro family before shooting.
2. [blocker] **s07-scene, s08-reveal, s11-cliffhanger: the AI label covers the beat bar.** `.beats{top:56px}` and `.ai{top:58px}` overlap, so the pill hides the first two segments. Fix: `.ai{top:70px}`, and move the s07 witness line to `top:104px`. Better still, put the AI label and the witness line in one row: `● AI-made · seen as Sañjaya`.
3. [blocker] **s10-lineage: edges run through labels and the centre node.** The centre fill `rgba(227,176,75,.14)` is see-through, so the lines cross "अभि". Fix: use an opaque fill `#2A2416`, draw the edges before the nodes and end them at the circle radius, and give the labels a halo with `paint-order:stroke;stroke:#0D0E0B;stroke-width:4px`.
4. [blocker] **s17-shots: the header breaks.** The eyebrow wraps to "PASS", the stats line wraps, and both buttons wrap onto two lines. Fix: `.btn{white-space:nowrap}`, a header of `display:grid;grid-template-columns:1fr auto`, and the stats line moved under the title.
5. [major] **No motion spec anywhere (0 transitions or keyframes).** The beats need to read as one object changing state. Proposal:
   - **Page to scene:** the leaf lifts (scale .96, 300ms), the verse ink fades out while the scene fades in through the leaf's grain, and the gold rule becomes the horizon. 900ms, `cubic-bezier(.2,.7,.2,1)`.
   - **Scene to reveal:** the scene dims to `brightness(.45)`, the leaf rises from the bottom as a sheet (450ms), and a crossfade replaces any page-turn.
   - **Reveal to lineage:** the person named in the sheet becomes the centre node (shared element).
   - **Cliffhanger:** the wheel slowly closes, the type lands last, and the next card rises 600ms after the line.
   - **Reduced motion:** opacity changes only.

   Write this up as a `motion.md` table.
6. [major] **s06-bookpage: the "now chanting" highlight reads as a strikethrough.** The sindoor bar sits across the u-mātrā of तु and ्. Fix: drop the bar and do karaoke ink instead. The current line gets `color:var(--leafred)` and the other lines `opacity:.55`. Also fix the empty lower third of the leaf: set `height:auto` and centre it vertically, or anchor the play control inside the leaf.
7. [major] **s08-reveal: the sheet hides the scene completely.** The reveal should sit beside the scene, not replace it. Fix: `max-height:72%`, with the blurred scene and beat bar visible above. Use serif italic for the placeholder in the dashed box, not sans oblique.
8. [major] **s07-scene: the iconography is off-language.** The citation icon (`.cite::before`, an empty box) reads as a missing-glyph tofu. The button's ellipse icon reads as "no entry". The double white reticle on the gate looks like a game HUD. Fix: use one palm-leaf glyph (an SVG leaf with two binding holes) for the citation, the button and s03's "tap the leaf". Make the hotspot a single 1px gold ring with a 2s pulse.
9. [major] **s04, s09, s10, s11, s17: header patterns differ.** s04 uses sans-bold section titles, s14 a serif h1, s09 a left sans title with subtitle, s10 a centred title. Fix: screen titles use `.h1` serif and section titles `.eyebrow`, on every screen.
10. [major] **Text wraps leave widows and stray chips.** s05: "king" and the "5 languages" chip. s08: "2026". s09: the "IIIF" chip. s14: "video". s15: "frame". s16: "2 / min". Fix: `p,div{text-wrap:pretty}`, use `&nbsp;` in "2 min" and dates, and set chip rows to `flex-wrap:nowrap;overflow-x:auto`. Rename "IIIF" to "Zoomable scan".
11. [major] **s11-cliffhanger: four actions compete.** The countdown ring next to Play is autoplay pressure, which is off-brand for "trust, not a slot machine". Fix: remove the ring, keep Play as primary, and merge Send and Watch again into one row of text buttons.
12. [minor] **s10 sheet buttons have no side padding.** Fix: shorten to "Full graph" and "His chapters", with `padding:0 20px`.
13. [minor] **s13-paywall: the gift icon "दी" in sindoor is cryptic.** Use the splash diya in gold.
14. [minor] **s12-audio: mixed marker glyphs.** The markers use text glyphs ✓ ● ○. Use the SVG dots from the s10 timeline. Also, iOS doesn't allow a custom card under Now Playing, so show the markers as chapter titles instead.
15. [minor] **Source frames carry burned-in text.** `frames/ride.png` shows a ghost "Sañjaya" behind the s07 graph button, and the s14 row-2 thumbnail is a title card. Re-capture with captions hidden by adding a `#clean` hook to chakravyuha.html.
16. [minor] **Two colour pairs fall short of 4.5:1.** `--ash2` #7C7564 on night is 4.23:1, too low for the 11px tab labels; raise it to `#8F8775`. `--ink2` on `--leaf3` is 4.05:1 at the leaf foot; darken the leaf gradient's end stop to `#C49C5B`.
17. [minor] **Script fonts are mixed.** Marathi uses the Sanskrit face; use `Tiro Devanagari Marathi` with `lang="mr"` so ल and श take Marathi forms. Hindi should use `Tiro Devanagari Hindi`. Set Noto Serif Gujarati, Malayalam and Oriya to weight 400 to match Tiro's colour, not 500.
18. [minor] **s18-retention: chart labels.** The "Book page" label collides with the curve; move the beat labels above the plot at `y=-8`. The SVG text falls back to Times; this is solved by item 1.
19. [minor] **s04-home: the Navarātri drop is hidden.** It sits under the tab bar, and its red border reads as an error. Cut the hero to 360px tall so the drop shows on the first screen, and use a gold border.

## The look: temple relief, lit by lamp

**Decision: temple relief.** Carved stone and bronze, lit by one warm lamp, with a sindoor or gold accent only on the object the claim is about. Each epic gets its stone: Ellora basalt for the Mahābhārata, Hampi granite for the Rāmāyaṇa (Hazāra Rāma's panels).

Why:
- It is how the audience already sees these figures in worship, so it reads as darśan, not cartoon. That is the plan's "respectful, not cheap" test.
- A monochrome material hides AI drift in faces and costume, which is our biggest QC cost, and makes the "no deity close-up" rule natural.
- Lamplight on stone is already the app's palette (#0D0E0B, gold), and chakravyuha.html's carved wheel already points this way.
- Raking light and 2.5D camera moves give Kling and Wan depth to work with.

The alternatives fall short:
- **Amar Chitra Katha:** it is a living trade dress, which carries legal and endorsement risk. Flat line art also shows AI line-boil, and it reads as "for kids".
- **Painted miniature:** its flat perspective fights camera moves, and AI video blurs it into generic painterly.

**Use miniature as a secondary register:** borders and palette on the parchment leaf and share cards (s06, s08, s16), where stillness suits it.

How the chrome supports it:
- The chrome stays quiet: no carved frames, mandalas or textures in the UI.
- Stone is the scene, parchment is the text. Gold means "tap for the source", sindoor means "now", and nothing else gets those colours.
- Serif italic for captions, sans for controls.
- One scrim gradient, `rgba(13,14,11,.92)`, so captions always sit on shadow, never on stone detail.
