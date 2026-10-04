package app.dheevara.core.access

import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalTime
import kotlinx.datetime.TimeZone
import kotlinx.datetime.atTime
import kotlinx.datetime.toInstant
import kotlin.time.Instant

/**
 * When a chapter lands: a calendar date at a local wall-clock time, read in the viewer's own
 * timezone. 7 pm in Chennai and 7 pm in Toronto are different instants on purpose.
 */
data class Release(val date: LocalDate, val localTime: LocalTime = DEFAULT_TIME) {
    fun instantIn(zone: TimeZone): Instant = date.atTime(localTime).toInstant(zone)

    fun isOut(now: Instant, zone: TimeZone): Boolean = now >= instantIn(zone)

    companion object {
        val DEFAULT_TIME = LocalTime(19, 0)
    }
}
