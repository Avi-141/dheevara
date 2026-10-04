package app.dheevara.core.timeline

import app.dheevara.core.ChapterId
import app.dheevara.core.access.Access
import app.dheevara.core.manifest.Beat
import kotlin.time.Instant

/** Anything laid over the scene. Every overlay pauses the scene; closing it resumes at the same moment. */
sealed interface Overlay {
    data class Reveal(val id: String) : Overlay
    data object Controls : Overlay
    data object Page : Overlay
    data object People : Overlay
    data object Share : Overlay
}

/** What the end of a chapter shows. */
sealed interface Ending {
    /** "Up next · plays in 8 s", with Stop. */
    data class Countdown(val next: ChapterId, val remainingMs: Long) : Ending {
        val secondsLeft: Int get() = ((remainingMs + 999) / 1000).toInt()
    }

    /** "Play chapter 4", no countdown: autoplay is off, a screen reader is on, or the viewer pressed Stop. */
    data class UpNext(val next: ChapterId) : Ending

    /** "Chapter 4 at 7 pm your time · Remind me". */
    data class Upcoming(val next: ChapterId, val at: Instant) : Ending

    /** The next chapter needs membership: the paywall, never a countdown into it. */
    data class Locked(val next: ChapterId) : Ending

    data object SeasonEnd : Ending
}

/** What the app knows about the next chapter when this one finishes. */
sealed interface NextUp {
    data object None : NextUp
    data class Chapter(val id: ChapterId, val access: Access) : NextUp
}

/** Autoplay is a setting, is off while a screen reader runs, and counts down from 10 s (accessibility review, finding 1). */
data class Autoplay(val enabled: Boolean = true, val screenReaderOn: Boolean = false, val countdownMs: Long = 10_000) {
    val runs: Boolean get() = enabled && !screenReaderOn
}

data class TimelineState(
    val positionMs: Long = 0,
    /** The viewer's intent; the scene also stops for overlays and at the end. */
    val wantsToPlay: Boolean = true,
    val overlay: Overlay? = null,
    val ending: Ending? = null,
) {
    val isRunning: Boolean get() = wantsToPlay && overlay == null && ending == null
}

sealed interface TimelineEvent {
    /** Position reported by the platform player. */
    data class Progress(val positionMs: Long) : TimelineEvent
    data object Play : TimelineEvent
    data object Pause : TimelineEvent
    data class Open(val overlay: Overlay) : TimelineEvent
    data object Close : TimelineEvent
    data class SeekTo(val positionMs: Long) : TimelineEvent
    data object NextBeat : TimelineEvent
    data object PreviousBeat : TimelineEvent
    data class Finished(val next: NextUp, val autoplay: Autoplay) : TimelineEvent
    /** Wall-clock time passing while the end screen is up. */
    data class Elapsed(val ms: Long) : TimelineEvent
    data object StopAutoplay : TimelineEvent
    data object PlayNext : TimelineEvent
    data object WatchAgain : TimelineEvent
}

/** What the platform player (Media3, AVPlayer) must do. */
sealed interface PlayerCommand {
    data object Play : PlayerCommand
    data object Pause : PlayerCommand
    data class SeekTo(val positionMs: Long) : PlayerCommand
    data class StartChapter(val id: ChapterId) : PlayerCommand
}

data class Step(val state: TimelineState, val commands: List<PlayerCommand>)

/** "Part 2 of 5", for the progress bar's accessible value and the lock screen title. */
data class Part(val number: Int, val of: Int, val beat: Beat)

/**
 * The chapter as a state machine over its beats. Pure: the platform player feeds it events and
 * carries out the commands it returns.
 */
class ChapterTimeline(private val beats: List<Beat>, private val durationMs: Long) {
    init {
        require(beats.isNotEmpty()) { "a chapter needs at least one beat" }
    }

    fun beatIndexAt(positionMs: Long): Int = beats.indexOfLast { it.startMs <= positionMs }.coerceAtLeast(0)

    fun partAt(positionMs: Long): Part {
        val i = beatIndexAt(positionMs)
        return Part(i + 1, beats.size, beats[i])
    }

    fun reduce(state: TimelineState, event: TimelineEvent): Step {
        val commands = mutableListOf<PlayerCommand>()
        fun seek(to: Long): Long = to.coerceIn(0, durationMs).also { commands += PlayerCommand.SeekTo(it) }

        val next: TimelineState = when (event) {
            is TimelineEvent.Progress -> state.copy(positionMs = event.positionMs.coerceIn(0, durationMs))
            TimelineEvent.Play -> if (state.ending == null) state.copy(wantsToPlay = true) else state
            TimelineEvent.Pause -> state.copy(wantsToPlay = false)
            is TimelineEvent.Open -> state.copy(overlay = event.overlay)
            TimelineEvent.Close -> state.copy(overlay = null)
            is TimelineEvent.SeekTo -> state.copy(positionMs = seek(event.positionMs), ending = null)
            TimelineEvent.NextBeat -> {
                val i = beatIndexAt(state.positionMs)
                if (state.ending != null || i == beats.lastIndex) state
                else state.copy(positionMs = seek(beats[i + 1].startMs))
            }
            TimelineEvent.PreviousBeat -> {
                val i = beatIndexAt(state.positionMs)
                // Like any player: a press well into a part restarts it; a press near its start goes back one.
                val target = if (state.positionMs - beats[i].startMs > RESTART_WINDOW_MS) i else (i - 1).coerceAtLeast(0)
                state.copy(positionMs = seek(beats[target].startMs), ending = null)
            }
            is TimelineEvent.Finished -> state.copy(positionMs = durationMs, ending = endingFor(event.next, event.autoplay))
            is TimelineEvent.Elapsed -> {
                val ending = state.ending
                if (ending !is Ending.Countdown || state.overlay != null || ending.remainingMs <= 0) state
                else {
                    val remaining = (ending.remainingMs - event.ms).coerceAtLeast(0)
                    if (remaining == 0L) commands += PlayerCommand.StartChapter(ending.next)
                    state.copy(ending = ending.copy(remainingMs = remaining))
                }
            }
            TimelineEvent.StopAutoplay -> when (val ending = state.ending) {
                is Ending.Countdown -> state.copy(ending = Ending.UpNext(ending.next))
                else -> state
            }
            TimelineEvent.PlayNext -> when (val ending = state.ending) {
                // Settle on UpNext so a countdown still running cannot start the chapter a second time.
                is Ending.Countdown -> state.copy(ending = Ending.UpNext(ending.next)).also { commands += PlayerCommand.StartChapter(ending.next) }
                is Ending.UpNext -> state.also { commands += PlayerCommand.StartChapter(ending.next) }
                else -> state
            }
            TimelineEvent.WatchAgain -> TimelineState(positionMs = seek(0))
        }

        if (state.isRunning != next.isRunning) {
            commands += if (next.isRunning) PlayerCommand.Play else PlayerCommand.Pause
        }
        return Step(next, commands)
    }

    private fun endingFor(next: NextUp, autoplay: Autoplay): Ending = when (next) {
        NextUp.None -> Ending.SeasonEnd
        is NextUp.Chapter -> when (val access = next.access) {
            is Access.NotYetReleased -> Ending.Upcoming(next.id, access.at)
            Access.NeedsMembership -> Ending.Locked(next.id)
            Access.Free, Access.Member ->
                if (autoplay.runs) Ending.Countdown(next.id, autoplay.countdownMs) else Ending.UpNext(next.id)
        }
    }

    companion object {
        const val RESTART_WINDOW_MS = 3_000L
    }
}
