# Art director review: product-surface mockups

**Verdict: the direction is right. Night, parchment, gold and sindoor read as respectful, and s06, s08 and s16 are on-brand. Not signed off: the shots were rendered without the real fonts, and s07, s10 and s17 show collisions. Fix 1–4, then re-shoot.**

1. [blocker] **All screens: wrong fonts.** Google Fonts did not load in the headless run. Figtree fell back to DejaVu Sans (heavy), Tiro to Liberation Serif or FreeSerif, and Telugu shapes incorrectly (s02, s18). Fix: vendor woff2 files and add `@font-face{font-display:block}`. In `shoot.mjs`, await `document.fonts.load()` for each family before shooting.
2. [blocker] **s07, s08, s11: the AI pill covers the beat bar.** The positions are `.beats{top:56px}` and `.ai{top:58px}`. Fix: `.ai{top:70px}` and witness line `top:104px`.
3. [blocker] **s10-lineage: edges cross labels and the centre node.** The centre fill `rgba(227,176,75,.14)` is see-through. Fix: make it opaque (`#2A2416`), draw edges first and end them at the radius, and give labels `paint-order:stroke;stroke:#0D0E0B;stroke-width:4px`.
4. [blocker] **s17-shots: the header breaks.** The eyebrow orphans "PASS" and both buttons wrap to two lines. Fix: `.btn{white-space:nowrap}`, a header of `grid-template-columns:1fr auto`, and the stats line under the title.
5. [major] **No motion spec (0 transitions or keyframes).** Proposal:
   - **Page to scene:** the leaf scales to .96, the ink fades, and the scene resolves through the leaf grain. 900ms `cubic-bezier(.2,.7,.2,1)`.
   - **Scene to reveal:** the scene dims and the leaf rises as a sheet. 450ms, no page-curl.
   - **Reveal to lineage:** the person named becomes the centre node (shared element).
   - **Cliffhanger:** the type lands last; the next card rises 600ms later.
   - **Reduced motion:** opacity only.
6. [major] **s06-bookpage: the chanting highlight reads as a strikethrough.** It cuts through the mātrās of तु. Fix: karaoke ink, with the current line `color:var(--leafred)` and the others `opacity:.55`. Centre the leaf with `height:auto`.
7. [major] **s08-reveal: the sheet hides the scene completely.** Fix: `max-height:72%`, with the blurred scene and beat bar visible above. Set the placeholder box in serif italic, not sans oblique.
8. [major] **s07-scene: off-language icons.** The `.cite::before` box reads as missing-glyph tofu, the button's ellipse reads as "no entry", and the white double reticle looks like a game HUD. Fix: one palm-leaf SVG (leaf plus two binding holes) for the citation, the button and s03. Make the hotspot one 1px gold ring with a slow pulse.
9. [major] **Header patterns differ.** s04 has sans-bold section titles, s14 a serif h1, s09 a left title, s10 a centred one. Fix: screen title `.h1` serif and section titles `.eyebrow`, everywhere.
10. [major] **Widows and orphaned chips.** s05 ("king" and the "5 languages" chip), s08 ("2026"), s09 (the "IIIF" chip), s14 ("video"), s15 ("frame"), s16 ("2 / min"). Fix: `text-wrap:pretty`, `&nbsp;` in "2 min" and in dates, and chip rows with `flex-wrap:nowrap;overflow-x:auto`.
11. [major] **s11-cliffhanger: four actions compete.** The countdown ring is autoplay pressure, which goes against "trust, not a slot machine". Fix: remove the ring and set Send and Watch again as one row of text buttons.
12. [minor] **s10 sheet buttons have no padding.** Fix: shorten to "Full graph" and "His chapters", with `padding:0 20px`.
13. [minor] **s13-paywall: the "दी" gift icon is cryptic.** Use the splash diya in gold.
14. [minor] **s12-audio: text glyphs for markers.** Use the SVG dots from s10.
15. [minor] **Source frames carry burned-in text.** There is a ghost "Sañjaya" behind the s07 graph button, and the s14 row-2 thumbnail is a title card. Re-capture with a `#clean` hook in chakravyuha.html.
16. [minor] **Contrast.** `--ash2` on night is 4.23:1, which fails for the 11px tab labels; use `#8F8775`. `--ink2` on `--leaf3` is 4.05:1; end the leaf gradient at `#C49C5B`.
17. [minor] **Scripts.** Marathi uses the Sanskrit face; use `Tiro Devanagari Marathi` with `lang="mr"` for Marathi ल and श. Use `Tiro Devanagari Hindi` for Hindi. Set the Noto Serif Indic faces to 400, not 500, to match Tiro.
18. [minor] **s18-retention: the "Book page" label collides with the curve.** Put beat labels above the plot.
19. [minor] **s04-home: the Navarātri drop is hidden under the tab bar.** Its red border reads as an error. Fix: a 360px hero and a gold border.

## The look: temple relief, lit by lamp

**Decision: temple relief.** Carved stone and bronze under one warm lamp, with gold or sindoor only on the object the claim concerns. Each epic gets its stone: Ellora basalt for the Mahābhārata, Hampi granite for the Rāmāyaṇa.

Why:
- It is how the audience already sees these figures in worship, so it reads as darśan, not cartoon.
- A monochrome material hides AI drift in faces and costume, our largest QC cost.
- Raking light gives Kling and Wan depth to move through, and chakravyuha.html's carved wheel already points this way.

The alternatives fall short:
- **Amar Chitra Katha:** a living trade dress, so legal and endorsement risk. Flat line art also shows AI line-boil and reads as "for kids".
- **Painted miniature:** flat perspective fights camera moves, and AI video blurs it into generic painterly.

**Keep miniature as a still register:** borders and palette on the leaf and share cards (s06, s08, s16).

How the chrome supports it:
- Quiet chrome: no carved frames or mandalas.
- Stone is the scene and parchment is the text. Gold means "source" and sindoor means "now", nothing else.
- Serif italic for captions, sans for controls.
- One scrim, `rgba(13,14,11,.92)`, so captions never sit on stone detail.
