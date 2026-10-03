# Decisions

Newest last. Each entry: date, decision, reason.

- **2026-10-03 — No local fallbacks for providers.** Avi's call. Every voice, render and search step calls the real service; when it cannot, it fails. Reason: fallbacks would hide the real cost, latency and quality we are trying to measure.
- **2026-10-03 — Planner and QC run in chat, not via the Anthropic API.** Claude in the build session writes beat maps, shot contracts and QC verdicts as committed files. Reason: no API key needed, and every verdict is reviewable in git.
- **2026-10-03 — Drive output folder.** The Drive connector only sees files it creates, so output goes to "Dheevara — Build Output" (My Drive), which Avi can move into his own folder.
- **2026-10-03 — Mockups before the app.** The full product surface is mocked at 390×844 and reviewed by four reviewer agents (art direction, scholarship, product, accessibility) before any app code.
- **2026-10-03 — Jev is the general decision layer.** The `apikey_…` key belongs to Jev, which Avi wants available for storyline and video-generation decisions and any routing inside the pipeline. Docs: https://docs.typesafe.ai/introduction (typesafe.ai). Read from `JEV_API_KEY`; base URL from `JEV_BASE_URL`. Blocked: `docs.typesafe.ai` and its API host are not on the network allowlist yet.
