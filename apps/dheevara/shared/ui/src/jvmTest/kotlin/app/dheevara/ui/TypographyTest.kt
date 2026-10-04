package app.dheevara.ui

import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.intl.LocaleList
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import app.dheevara.ui.theme.DheevaraFonts
import app.dheevara.ui.theme.Script
import app.dheevara.ui.theme.bindDandas
import app.dheevara.ui.theme.forLang
import app.dheevara.ui.theme.scriptOf
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertSame

class TypographyTest {
    private val families = Script.entries.associateWith { FontFamily.Default }.toMutableMap().apply {
        put(Script.Latin, FontFamily.SansSerif)
        put(Script.Sanskrit, FontFamily.Serif)
        put(Script.Tamil, FontFamily.Monospace)
    }
    private val fonts = DheevaraFonts(families)
    private val display = TextStyle(fontFamily = FontFamily.SansSerif, fontSize = 32.sp, lineHeight = 1.12.em, letterSpacing = (-0.028).em)
    private val micro = TextStyle(fontFamily = FontFamily.SansSerif, fontSize = 12.5.sp, lineHeight = 1.4.em)

    @Test
    fun everyAppLanguageMapsToItsScript() {
        val expected = mapOf(
            "en" to Script.Latin, "sa" to Script.Sanskrit, "hi" to Script.Devanagari, "mr" to Script.Devanagari,
            "ta" to Script.Tamil, "te" to Script.Telugu, "kn" to Script.Kannada, "bn" to Script.Bengali,
            "gu" to Script.Gujarati, "pa" to Script.Gurmukhi, "ml" to Script.Malayalam, "or" to Script.Odia,
            "ta-IN" to Script.Tamil, "EN-in" to Script.Latin,
        )
        expected.forEach { (lang, script) -> assertEquals(script, scriptOf(lang), lang) }
    }

    @Test
    fun latinTextKeepsItsTrackingAndGetsItsTag() {
        val en = display.forLang("en", fonts)
        assertEquals((-0.028).em, en.letterSpacing)
        assertEquals(LocaleList("en"), en.localeList)
        assertSame(FontFamily.SansSerif, en.fontFamily)
    }

    @Test
    fun indicTextDropsTrackingAndOpensUpLineHeight() {
        val ta = display.forLang("ta", fonts)
        assertSame(FontFamily.Monospace, ta.fontFamily)
        assertEquals(0.em, ta.letterSpacing)
        assertEquals(1.45.em, ta.lineHeight)
        assertEquals(32.sp, ta.fontSize)
        assertEquals(LocaleList("ta"), ta.localeList)
    }

    @Test
    fun indicTextIsNeverSmallerThan13() {
        assertEquals(13.sp, micro.forLang("hi", fonts).fontSize)
        assertEquals(12.5.sp, micro.forLang("en", fonts).fontSize)
    }

    @Test
    fun aLooserLineHeightIsKept() {
        assertEquals(1.7.em, micro.copy(lineHeight = 1.7.em).forLang("kn", fonts).lineHeight)
        assertEquals(1.45.em, micro.copy(lineHeight = androidx.compose.ui.unit.TextUnit.Unspecified).forLang("kn", fonts).lineHeight)
    }

    @Test
    fun sanskritUsesTheVerseFace() {
        assertSame(FontFamily.Serif, display.forLang("sa", fonts).fontFamily)
    }

    @Test
    fun dandasStayWithTheirWord() {
        assertEquals("योगोऽनीकस्य भेदने । नोत्सहे ॥", bindDandas("योगोऽनीकस्य भेदने । नोत्सहे ॥"))
        assertEquals("no danda here", bindDandas("no danda here"))
    }
}
