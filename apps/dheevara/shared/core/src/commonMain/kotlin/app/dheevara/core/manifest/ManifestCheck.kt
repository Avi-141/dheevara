package app.dheevara.core.manifest

/** Something in a manifest that would let the app show an uncited claim or a broken timeline. */
sealed interface ManifestProblem {
    /** A claim id used at [where] has no entry in the manifest's `claims` map. */
    data class UnresolvedClaim(val where: String, val claim: String) : ManifestProblem

    /** Captions and the text tier of a reveal must each cite at least one claim. */
    data class Uncited(val where: String) : ManifestProblem

    /** Beats must run from 0 to `durationMs`, in order, with no gap or overlap. */
    data class BrokenTimeline(val detail: String) : ManifestProblem

    /** A caption that starts after it ends or falls outside the chapter. */
    data class CaptionOutOfRange(val index: Int) : ManifestProblem

    /** A verse beat without its verse, or a reveal beat whose reveal does not exist. */
    data class DanglingBeat(val index: Int, val detail: String) : ManifestProblem

    /** A people edge pointing at someone not in `people`. */
    data class UnknownPerson(val from: String, val to: String) : ManifestProblem
}

object ManifestCheck {
    fun problems(m: ChapterManifest): List<ManifestProblem> = buildList {
        fun cite(where: String, ids: List<String>, required: Boolean) {
            if (required && ids.isEmpty()) add(ManifestProblem.Uncited(where))
            ids.filter { it !in m.claims }.forEach { add(ManifestProblem.UnresolvedClaim(where, it)) }
        }

        checkTimeline(m)

        m.beats.forEachIndexed { i, beat ->
            when (beat.kind) {
                BeatKind.Verse ->
                    if (beat.verse == null) add(ManifestProblem.DanglingBeat(i, "verse beat without a verse"))
                    else cite("beats[$i].verse", listOf(beat.verse), required = true)
                BeatKind.Reveal ->
                    if (beat.reveal == null || m.reveal(beat.reveal) == null) {
                        add(ManifestProblem.DanglingBeat(i, "reveal beat points at '${beat.reveal}'"))
                    }
                else -> Unit
            }
        }

        m.captions.forEachIndexed { i, c ->
            if (c.startMs < 0 || c.endMs <= c.startMs || c.endMs > m.durationMs) add(ManifestProblem.CaptionOutOfRange(i))
            cite("captions[$i]", c.claims, required = true)
        }

        m.reveals.forEach { r -> cite("reveals.${r.id}.text", r.text.claims, required = true) }

        val personIds = m.people.mapTo(HashSet()) { it.id }
        m.people.forEach { p ->
            p.edges.forEach { e ->
                if (e.to !in personIds) add(ManifestProblem.UnknownPerson(p.id, e.to))
                cite("people.${p.id}->${e.to}", e.claims, required = false)
            }
        }
    }

    private fun MutableList<ManifestProblem>.checkTimeline(m: ChapterManifest) {
        if (m.beats.isEmpty()) {
            add(ManifestProblem.BrokenTimeline("no beats"))
            return
        }
        if (m.beats.first().startMs != 0L) add(ManifestProblem.BrokenTimeline("first beat starts at ${m.beats.first().startMs}, not 0"))
        m.beats.forEachIndexed { i, beat ->
            if (beat.endMs <= beat.startMs) add(ManifestProblem.BrokenTimeline("beat $i ends before it starts"))
            if (i > 0 && beat.startMs != m.beats[i - 1].endMs) {
                add(ManifestProblem.BrokenTimeline("beat $i starts at ${beat.startMs}, previous ends at ${m.beats[i - 1].endMs}"))
            }
        }
        if (m.beats.last().endMs != m.durationMs) {
            add(ManifestProblem.BrokenTimeline("last beat ends at ${m.beats.last().endMs}, chapter at ${m.durationMs}"))
        }
    }
}
