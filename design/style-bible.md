# Style bible: how a Dheevara scene looks and sounds

Owner: the art director. Drafted 4 Oct 2026 from the art-direction review and the product rules; it becomes binding once Avi confirms "the look" (decision of 3 Oct). The pipeline reads it: the prompt compiler takes its fragments from section 9, and the QC gate checks every clip against section 10.

## 1. The look in one sentence

**A temple relief that has come alive under one oil lamp.** Carved stone figures move inside deep shadow; the only warm light is the lamp; gold appears only where a claim lives, sindoor only where there is danger.

Why this look: it is how the audience already meets these figures in worship, so it reads as darśan, not cartoon. A single material hides the face and costume drift that AI video produces. Raking light gives video models depth to move through. The Chakravyūha experience (`web/chakravyuha.html`) already points this way.

## 2. Stone and place, per epic

| Epic | Stone | Reference walls (style only, never a claim about the epic's own period) |
|---|---|---|
| Mahābhārata | Dark basalt, fine grain, slightly polished where hands have touched | Kailāsa temple, Ellora Cave 16 (epic panels on its walls); Hoysaleśvara temple, Halebidu (friezes include the chakravyūha) |
| Rāmāyaṇa | Warm grey granite, coarser grain, lichen in the recesses | Hazāra Rāma temple, Hampi (Rāmāyaṇa panels) |
| Devī Māhātmya | Red sandstone, soft edges | To choose with the scholar |

The art director assembles a reference board from photographs whose licences allow reuse (for example on Wikimedia Commons), with the source of each image recorded. No reference image of a living artist's work goes into a model.

## 3. Light

- One key light: an oil lamp or the low sun, colour temperature about 2,200–2,700 K. Everything else falls to near-black.
- Raking angle, 20–40° off the relief plane, so carving reads as depth.
- No rim-light glow around figures, no god rays, no lens flares, no bloom on faces.
- Time of day follows the text: day 13 runs from dawn array to sunset; the last shot of s1e3 is sunset.
- The lamp may flicker (±3% intensity), never pulse.

## 4. Palette

| Role | Colour | Use |
|---|---|---|
| Stone | Basalt `#2B2A25` to `#55524A`; granite `#5D5A52` to `#8A857A` | All figures and architecture |
| Lamp | `#F2B04A` to `#FBE3A4` | The light itself and what it touches |
| Source gold | `#E3B04B` | Only the object a claim concerns (a wheel, a bow, a verse inscribed) |
| Sindoor | `#C8391F` | Only danger and blood, and only by suggestion |
| Night | `#0B0B0A` | Everything the lamp does not reach |

No saturated blues, purples or greens. Sky, where seen, is the colour of smoke.

## 5. Camera grammar per beat

| Beat | Length | Camera | Purpose |
|---|---|---|---|
| Cold open | 5–8 s | High, wide, slow push in. One subject, one line of narration | State the stakes before anything else |
| The verse | 12–18 s | No video. The leaf page in the app; in the MP4, the leaf on night with the chant | The source, chanted |
| Witness scene | 40–60 s, 6–10 shots | From the witness's vantage (section 6). Shots of 4–8 s; every cut motivated by a narration line | The event |
| Hidden detail | 15–20 s | Macro on carved detail: a hand, a bowstring, a wheel. Static or a 5% push | The reveal, on one object |
| The question | 10–16 s | Slow pull back to wide, then hold 2 s on near-black | The question the next chapter answers |

Lenses: 24–35 mm equivalent for wides, 50 mm for mediums, a macro look for details. Never a fisheye, never a drone swoop, never handheld shake except at the moment of a breach (≤0.5 s). Motion is slower than feels natural: a push of 5–10% of the frame over a whole shot.

## 6. Witness rules

The viewer never stands inside a revered figure. Every chapter names its witness, and the camera keeps that witness's vantage.

| Witness | Where they stand | Camera consequence |
|---|---|---|
| Sañjaya, with divya dṛṣṭi | Far away, at Hastināpura, given sight of the field | Elevated and distant; sight can travel and close in, but stops at medium-wide on any person |
| A charioteer | On the chariot platform | Eye level, beside the warrior, looking where he looks, never at his face |
| A vānara on Mahendra | On the mountain, looking up and out | Low angle, wide sky, the leap seen from below |
| Suratha and Samādhi, hearing Medhas | In the sage's hermitage | The telling frames the scene; we cut from the hermitage lamp into the told event and back |

## 7. Figures and faces

- Figures move like carving released: weight and gesture, not facial acting. No lip-sync; narration carries every line.
- Medium-wide is the closest framing for any human principal. No close-up of any deity's face, ever. Deities appear in full figure, at a distance, or through an attribute (a conch, a weapon, light), as temple sculpture shows them.
- Death and violence by suggestion only: a fallen bow, a wheel lying still, a lamp going out. Never a wound, never a killing blow on screen.
- Proportions follow classical Indian sculpture: broad shoulders, narrow waist, calm faces.

## 8. Period, costume, arms (to be checked by the scholar per chapter)

The epics are depicted through the conventions of classical Indian sculpture and painting, not as a historical reconstruction. Within that register:

- **Dress:** draped garments (antarīya, uttarīya), crowns and jewellery as carved; bare torsos for warriors are common in the reliefs.
- **Arms:** the bow (dhanus) and arrows, the mace (gadā), sword, spear, discus as an attribute; chariots (ratha) drawn by horses, with banners.
- **Never (anachronisms the QC gate rejects):** visored or plate helmets, plate armour, chain mail of medieval European form, stirrups and modern saddles, firearms and gunpowder, metal horseshoes shown in close-up, glass windows, modern furniture (tables, chairs of modern form), printed text in the frame, zips, buttons, wristwatches, any modern object.
- **Banners and emblems:** only when sourced; otherwise plain cloth.

## 9. Prompt fragments for the compiler

The compiler assembles prompts from the shot contract plus these fragments. Model-specific syntax belongs in `src/compile/`; this is the shared vocabulary.

```
style.base      = "living temple relief carved in {stone}, figures in classical Indian sculptural proportions, shallow relief depth, fine stone grain"
style.light     = "single oil-lamp key light from {side}, warm 2400K, deep falloff to black, raking angle, no rim light"
style.motion    = "slow deliberate motion, weighty gestures, no facial acting, camera {move} over the whole shot"
style.palette   = "monochrome stone, warm lamp light, no saturated colour except {accent} on {object}"
witness.sanjaya = "seen from far above and at a distance, as if by divine sight, never closer than medium-wide on any person"
negative        = "close-up of a face, deity face, lip movement, text, logo, watermark, helmet with visor, plate armour, chain mail, stirrups, saddle, firearm, modern object, table, chair, glass, lens flare, god rays, bloom, photorealistic skin, cartoon, anime"
```

`{stone}` comes from the epic (section 2), `{accent}` and `{object}` from the contract's claim, `{side}` and `{move}` from its camera field.

## 10. What QC checks on every clip

The QC gate samples three frames per clip (start, middle, end) and checks, in this order:

1. No face closer than medium-wide; no deity face at any size larger than full figure.
2. Nothing on the section 8 never-list.
3. One key light; no rim glow, flares or god rays.
4. Stone material holds across frames (no drift to painted, photoreal or cartoon).
5. Blocking and references match the contract (who is where, which object carries the accent).
6. Violence only by suggestion.

A failure writes a `fix_hint` in the vocabulary of section 9 (for example "remove visor; conical bronze helmet").

## 11. Sound

- Bed: tanpura drone tuned to the narration's key, very low.
- Percussion: pakhawaj or mṛdaṅga for movement; silence before a reveal.
- Conch (śaṅkha) only where the text has one.
- The chant (Vāgdhenu or a reciter) sits alone under the verse beat: nothing else plays.
- No orchestral trailer music, no risers, no "braams".
- Loudness: −16 LUFS integrated for the phone mix, narration 6 dB above the bed.

## 12. Type in the video

Burned-in captions use Geist 600 at about 4.5% of frame height, `#F4F2EE` on an 80% night band, two lines at most, 34 characters per line for English (fewer for Indic scripts). Verse ids appear under the line in amber (`#F2B04A`) at 70% of caption size. The AI label is always visible, top left, in the same band style. Fonts are in `design/fonts/`.

## 13. AI disclosure (India's synthetic-content rules, in force since 20 Feb 2026)

- The visible AI label is burned into the frames of every cut that leaves the app (Shorts, Reels, WhatsApp clips), not only drawn by the player.
- A spoken disclosure, about two seconds, plays before AI narration and before the chant, in the narration language, including in audio-only mode.
- Every asset carries permanent provenance metadata with a unique id (C2PA); the assembler writes it and nothing downstream strips it.
- A lawyer confirms the reading before anything is public; until then, follow the strictest one.
