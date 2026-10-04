package app.dheevara.ui

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.luminance
import app.dheevara.ui.theme.DheevaraColors
import kotlin.test.Test
import kotlin.test.assertTrue

/** Every text colour on every surface it is used on meets WCAG 4.5:1 (handoff, section 2). */
class ContrastTest {
    private val c = DheevaraColors()

    private fun ratio(a: Color, b: Color): Double {
        val (hi, lo) = listOf(a.luminance().toDouble(), b.luminance().toDouble()).sortedDescending()
        return (hi + 0.05) / (lo + 0.05)
    }

    @Test
    fun interfaceTextOnDarkSurfaces() {
        val surfaces = mapOf("bg" to c.bg, "raise" to c.raise, "raise2" to c.raise2, "raise3" to c.raise3)
        val texts = mapOf("fg" to c.fg, "fg2" to c.fg2, "fg3" to c.fg3, "amber" to c.amber, "live" to c.live)
        texts.forEach { (tn, text) ->
            surfaces.forEach { (sn, surface) ->
                val r = ratio(text, surface)
                assertTrue(r >= 4.5, "$tn on $sn is $r:1")
            }
        }
    }

    @Test
    fun textOnTheLeaf() {
        listOf("ink" to c.ink, "ink2" to c.ink2, "leafRed" to c.leafRed).forEach { (tn, text) ->
            listOf("leaf" to c.leaf, "leaf2" to c.leaf2).forEach { (sn, surface) ->
                val r = ratio(text, surface)
                assertTrue(r >= 4.5, "$tn on $sn is $r:1")
            }
        }
    }

    @Test
    fun buttonLabels() {
        assertTrue(ratio(c.bg, c.fg) >= 4.5, "primary button")
        assertTrue(ratio(c.leaf, c.ink) >= 4.5, "ink button")
    }

    /** The amber source chip: amber text on amber-dim over the page. */
    @Test
    fun sourceChip() {
        val chip = c.amberDim.compositeOver(c.bg)
        assertTrue(ratio(c.amber, chip) >= 4.5, "amber on amberDim is ${ratio(c.amber, chip)}:1")
    }

    private fun Color.compositeOver(background: Color): Color {
        val a = alpha
        return Color(red * a + background.red * (1 - a), green * a + background.green * (1 - a), blue * a + background.blue * (1 - a), 1f)
    }
}
