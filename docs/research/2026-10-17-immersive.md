# Immersive Dheevara: glasses, AR/VR and holograms

Written 17 Oct 2026, in answer to the founder's comment on the positioning canvas: "Our positioning will also be interactive experiences … Meta glasses, or AR/VR or holograms." It synthesises three sets of notes in `docs/research/notes-2026-10-17-immersive/`:
- `devices_platforms.md`
- `precedents_market.md`
- `stack_carryover_concepts.md`

Figures marked *est.* are the researchers' own estimates; their sources and gaps are in the notes.

## Summary

- **Nobody offers sourced, witness-view immersive mythology.** Indian immersive work today is deity-centred spectacle or temple-run virtual darśan, with no sources:
  - Ayodhya's Ram Katha Museum hologram court
  - Kurukshetra's Jyotisar museum
  - ISKCON Delhi's ₹14 cr VR wing
  - Mahakal and Shamlaji light shows

  A curator's on-record criticism of Ayodhya ("Spectacle doesn't replace … proper research") is our positioning, said by someone else.
- **Smart glasses are rising and headsets are falling.** IDC reports smart glasses up 167% year on year in Q1 2026, while headsets fell 8% in Q4 2025. EssilorLuxottica sold more than 7M Meta AI glasses in 2025. **Ray-Ban Meta is the only immersive device officially sold in India** (Gen 3 from ₹44,300). Quest, Vision Pro and Galaxy XR are not sold there, so headsets reach the diaspora, not India.
- **The money in India is B2B.** State tourism and temple tenders for projection shows run ₹5.24–18.5 cr including maintenance. Tickets are about ₹50–100. International venue economics are fragile:
  - Illuminarium Las Vegas closed in March 2026.
  - The Immersive Van Gogh company went bankrupt in 2023.
  - ABBA Voyage made £4.2M profit on £104M revenue.

  **License the cited, witness-view story layer to firms that win tenders; don't build venues.**
- **Our stack carries over unusually well.** The three.js/Spark splat worlds already planned for the web become WebXR scenes with little new code. Chant and narration become spatial audio. Our Blender relief scenes render straight to Looking Glass holographic displays. Our Compose UI maps onto Android XR's Compose for XR panels (still alpha).
- **The real risk is rule 1 in six degrees of freedom.** In a headset a viewer can walk up to any face. It is solvable and testable in code:
  - fixed or node-based vantages, as in *Wolves in the Walls* and *Gloomy Eyes*
  - a keep-out capsule around every revered figure's head
  - revered figures shipped as silhouettes with no modelled face
  - a CI test that samples head poses at each vantage

  Indian buyers will also ask for deity holograms. The pitch must decline those and offer a witness view instead.

## Positioning

Immersive extends the trust position; it doesn't replace it. The umbrella stays "The epics, as the text tells them." The witness line becomes the immersive brand:

> **Stand beside the story — on your phone, in your glasses, in the temple courtyard.**

Other lines to test, from the precedents notes: "Every immersive epic, sourced." and "Hear it where it happened."

## Surfaces, in order

| Order | Surface | Why now or later | Reach |
|---|---|---|---|
| 1 | **WebXR on the existing web chapters** (Quest Browser, Vision Pro Safari, Android XR Chrome) | Almost no new code; reuses Marble/Spark worlds. Quest standalone budget is about 150K splats with flat colour (community reports) | Diaspora; Quest has 20M+ lifetime headsets (date of that figure unclear) |
| 2 | **Audio-first glasses chapters** via Meta's Device Access Toolkit (Kotlin/Swift SDK) | The only device sold in India. Audio-only can't break the witness rule. Chant plays straight from Vāgdhenu | India and diaspora |
| 3 | Ray-Ban Display web apps (600×600 monocular HUD) | Verse text and cite cards at a glance. Preview only: US/UK/CA/EU, password URLs, 100 testers. "Hey Meta" isn't open to apps, so press-to-talk | Small |
| 4 | Looking Glass holographic displays for temples, Bala Vihar and homes | Our Blender scenes render to its 11×6 view grid directly. Go is listed at $299; larger units cost $2k–20k | B2B and gifting |
| Wait | Native visionOS 27 (`GaussianSplatComponent`, about 200K-splat cap per one forum post); native Android XR apps; Snap Specs; Xreal Aura; Apple glasses (reported late 2027) | Low volume, or SDKs still alpha | — |
| B2B only | Proto hologram boxes and Pepper's-ghost stages | Used at Isha for Mahashivratri 2026 ($29k–65k per unit, or about $2,500 a month to lease). Life-size deity figures conflict with rule 1 | Venues |

Phone AR needs a new base: 8th Wall closed to new work in Feb 2026 and its hosting ends 28 Feb 2027. Use `<model-viewer>`, MindAR or plain three.js.

## Concepts, ranked

| # | Concept | Platform | Reuses | Effort *est.* |
|---|---|---|---|---|
| 1 | **Sañjaya's Table**: the chakravyūha as a table-top diorama you lean into, seen from Sañjaya's divine-sight vantage; tap a chariot for its verse | WebXR (phone, Quest, Android XR, Vision Pro) | Marble world, GLB props, claims | 4–5 person-weeks, under $30 to generate |
| 2 | **Witness Walk**: face the Halebidu chakravyūha frieze; hear its verse chanted and the cited story | Phone first, then Ray-Ban or Android XR glasses | Chant audio, claims, panel-to-verse map (scholar time) | 5–6 person-weeks |
| 3 | **Relief in a Box**: lamp-lit relief plates | Looking Glass Go | Blender relief scenes | 2–3 person-weeks |
| 4 | **On the Chariot Platform**: a native fixed-vantage chapter | visionOS 27, Android XR | Shot contracts plus a `vantage` block | 8–12 person-weeks per platform |
| 5 | **The Family Telling** on a home holographic display | Looking Glass Go | Family-telling audio | 3–4 person-weeks on top of #3 |
| 6 | **Ask the Text** by voice, press-to-talk | Glasses with the phone app | Verified claims, retrieval only | About 3 person-weeks |

**First step:** prototype Sañjaya's Table in the browser. It extends the one-week Marble chakravyūha plan in `docs/research/2026-10-15-api-first-tooling.md` §6. Then put a Witness Walk on the phone at one frieze.

## Rules in immersive form

- **Rule 1, made checkable:**
  - Add a `vantage` block to the shot contract.
  - Give every figure on the revered list a head keep-out capsule.
  - Ship revered figures as silhouettes with no face mesh.
  - Never attach a vantage to a revered figure.
  - Run a CI test that samples head poses at each vantage.
  - Use teleport and snap turn by default, for comfort.
- **Rule 2:** cites are anchored "leaf" labels. The reveal sheet becomes a spatial panel. Captions follow the W3C XR Accessibility User Requirements.
- **Rule 5:** glasses features run through our phone app. Unreleased text never goes to Meta AI.
- **Temples:** many restrict photography. Witness Walk captures one frame on tap, uploads nothing, and offers a no-camera mode using panel numbers.
- **Sensitivity:** devotees accept virtual darśan that the temple runs itself. Outsiders who sell or alter sacred imagery draw probes and FIRs: the Roblox Tirumala game (Jun 2025), Puri Jagannath AI images (97 removed, Jan 2026), eight FIRs in Varanasi, and a Doraemon AI video at Mahakal. B2B work only goes ahead with the institution's consent.

## Decisions for the founder

1. **Adopt the immersive brand line:** "Stand beside the story — on your phone, in your glasses, in the temple courtyard."
2. **Surface order:** WebXR first, audio-first glasses second.
3. **B2B model:** license the story layer to tender winners; don't run venues.
4. **"Ask the Text" generative answers:** these need a model key in the shipped product. Start retrieval-only.

## Gaps

These were not found or not verified:
- **Devices and SDKs:**
  - 2026 Quest usage and Vision Pro sales.
  - Whether WebXR is on by default in visionOS Safari.
  - India plans for Ray-Ban Display and Android XR glasses.
  - Spark benchmarks on Quest and Vision Pro.
  - Meta toolkit v1.0 status (one FAQ seen via search says 30 Sep 2026; a June guide says preview).
- **Not covered:**
  - Rokid, Even Realities, Pico, Valve, Hypervsn.
  - Ramoji and Chhota Bheem parks.
  - Lightroom and Sphere finances.
  - A museum guide on Meta glasses (none found).
  - Any survey of devotee attitudes.
