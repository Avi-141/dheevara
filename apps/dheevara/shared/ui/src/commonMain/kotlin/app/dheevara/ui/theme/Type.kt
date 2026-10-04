package app.dheevara.ui.theme

import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.intl.LocaleList
import androidx.compose.ui.text.style.LineHeightStyle
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import app.dheevara.ui.res.Res
import app.dheevara.ui.res.geist_400
import app.dheevara.ui.res.geist_500
import app.dheevara.ui.res.geist_600
import app.dheevara.ui.res.noto_sans_bengali_400
import app.dheevara.ui.res.noto_sans_bengali_500
import app.dheevara.ui.res.noto_sans_bengali_600
import app.dheevara.ui.res.noto_sans_devanagari_400
import app.dheevara.ui.res.noto_sans_devanagari_500
import app.dheevara.ui.res.noto_sans_devanagari_600
import app.dheevara.ui.res.noto_sans_gujarati_400
import app.dheevara.ui.res.noto_sans_gujarati_500
import app.dheevara.ui.res.noto_sans_gujarati_600
import app.dheevara.ui.res.noto_sans_gurmukhi_400
import app.dheevara.ui.res.noto_sans_gurmukhi_500
import app.dheevara.ui.res.noto_sans_gurmukhi_600
import app.dheevara.ui.res.noto_sans_kannada_400
import app.dheevara.ui.res.noto_sans_kannada_500
import app.dheevara.ui.res.noto_sans_kannada_600
import app.dheevara.ui.res.noto_sans_malayalam_400
import app.dheevara.ui.res.noto_sans_malayalam_500
import app.dheevara.ui.res.noto_sans_malayalam_600
import app.dheevara.ui.res.noto_sans_oriya_400
import app.dheevara.ui.res.noto_sans_oriya_500
import app.dheevara.ui.res.noto_sans_oriya_600
import app.dheevara.ui.res.noto_sans_tamil_400
import app.dheevara.ui.res.noto_sans_tamil_500
import app.dheevara.ui.res.noto_sans_tamil_600
import app.dheevara.ui.res.noto_sans_telugu_400
import app.dheevara.ui.res.noto_sans_telugu_500
import app.dheevara.ui.res.noto_sans_telugu_600
import app.dheevara.ui.res.tiro_devanagari_sanskrit_400
import org.jetbrains.compose.resources.Font
import org.jetbrains.compose.resources.FontResource

/** The script a language tag is written in, which decides its font. */
enum class Script { Latin, Sanskrit, Devanagari, Tamil, Telugu, Kannada, Bengali, Gujarati, Gurmukhi, Malayalam, Odia }

fun scriptOf(lang: String): Script = when (lang.substringBefore('-').lowercase()) {
    "sa" -> Script.Sanskrit
    "hi", "mr" -> Script.Devanagari
    "ta" -> Script.Tamil
    "te" -> Script.Telugu
    "kn" -> Script.Kannada
    "bn" -> Script.Bengali
    "gu" -> Script.Gujarati
    "pa" -> Script.Gurmukhi
    "ml" -> Script.Malayalam
    "or" -> Script.Odia
    else -> Script.Latin
}

/** Geist for interface text, Tiro Devanagari Sanskrit for verse and Sanskrit, Noto Sans for every other Indic script. */
@Immutable
class DheevaraFonts(private val families: Map<Script, FontFamily>) {
    val sans: FontFamily get() = families.getValue(Script.Latin)
    val verse: FontFamily get() = families.getValue(Script.Sanskrit)

    fun forScript(script: Script): FontFamily = families.getValue(script)
}

@Composable
internal fun loadFonts(): DheevaraFonts {
    @Composable
    fun family(w400: FontResource, w500: FontResource, w600: FontResource) = FontFamily(
        Font(w400, FontWeight.Normal),
        Font(w500, FontWeight.Medium),
        Font(w600, FontWeight.SemiBold),
    )
    return DheevaraFonts(
        mapOf(
            Script.Latin to family(Res.font.geist_400, Res.font.geist_500, Res.font.geist_600),
            Script.Sanskrit to FontFamily(Font(Res.font.tiro_devanagari_sanskrit_400, FontWeight.Normal)),
            Script.Devanagari to family(Res.font.noto_sans_devanagari_400, Res.font.noto_sans_devanagari_500, Res.font.noto_sans_devanagari_600),
            Script.Tamil to family(Res.font.noto_sans_tamil_400, Res.font.noto_sans_tamil_500, Res.font.noto_sans_tamil_600),
            Script.Telugu to family(Res.font.noto_sans_telugu_400, Res.font.noto_sans_telugu_500, Res.font.noto_sans_telugu_600),
            Script.Kannada to family(Res.font.noto_sans_kannada_400, Res.font.noto_sans_kannada_500, Res.font.noto_sans_kannada_600),
            Script.Bengali to family(Res.font.noto_sans_bengali_400, Res.font.noto_sans_bengali_500, Res.font.noto_sans_bengali_600),
            Script.Gujarati to family(Res.font.noto_sans_gujarati_400, Res.font.noto_sans_gujarati_500, Res.font.noto_sans_gujarati_600),
            Script.Gurmukhi to family(Res.font.noto_sans_gurmukhi_400, Res.font.noto_sans_gurmukhi_500, Res.font.noto_sans_gurmukhi_600),
            Script.Malayalam to family(Res.font.noto_sans_malayalam_400, Res.font.noto_sans_malayalam_500, Res.font.noto_sans_malayalam_600),
            Script.Odia to family(Res.font.noto_sans_oriya_400, Res.font.noto_sans_oriya_500, Res.font.noto_sans_oriya_600),
        ),
    )
}

/** The type scale from the mockups: 32/22/17/15/12.5 at 600/600/600/400/500, tight tracking on the large sizes. */
@Immutable
class DheevaraType(fonts: DheevaraFonts) {
    private val sans = TextStyle(fontFamily = fonts.sans)

    val display = sans.copy(fontSize = 32.sp, lineHeight = 1.12.em, fontWeight = FontWeight.SemiBold, letterSpacing = (-0.028).em)
    val title = sans.copy(fontSize = 22.sp, lineHeight = 1.25.em, fontWeight = FontWeight.SemiBold, letterSpacing = (-0.018).em)
    val head = sans.copy(fontSize = 17.sp, lineHeight = 1.3.em, fontWeight = FontWeight.SemiBold, letterSpacing = (-0.01).em)
    val body = sans.copy(fontSize = 15.sp, lineHeight = 1.45.em, fontWeight = FontWeight.Normal)
    val sub = sans.copy(fontSize = 14.sp, lineHeight = 1.45.em, fontWeight = FontWeight.Normal)
    val micro = sans.copy(fontSize = 12.5.sp, lineHeight = 1.4.em, fontWeight = FontWeight.Medium)
    val label = sans.copy(fontSize = 13.sp, lineHeight = 1.4.em, fontWeight = FontWeight.Medium)
    val button = sans.copy(fontSize = 16.sp, lineHeight = 1.25.em, fontWeight = FontWeight.SemiBold, letterSpacing = (-0.005).em)
    val buttonSmall = button.copy(fontSize = 14.5.sp)
    val chip = sans.copy(fontSize = 13.5.sp, lineHeight = 1.3.em, fontWeight = FontWeight.Medium)
    val rowTitle = sans.copy(fontSize = 15.5.sp, lineHeight = 1.35.em, fontWeight = FontWeight.Medium)
    val rowValue = sans.copy(fontSize = 14.5.sp, lineHeight = 1.35.em, fontWeight = FontWeight.Normal)
    val tab = sans.copy(fontSize = 12.sp, lineHeight = 1.3.em, fontWeight = FontWeight.Medium)

    /** Verse ids and other figures that should line up. */
    val cite = sans.copy(fontSize = 13.sp, lineHeight = 1.4.em, fontWeight = FontWeight.Medium, fontFeatureSettings = "tnum")

    val verse = TextStyle(fontFamily = fonts.verse, fontSize = 20.sp, lineHeight = 1.6.em)
}

private val minIndicSize = 13.sp
private val minIndicLineHeight = 1.45.em

/**
 * The same style set for text in [lang]: the script's font and the tag itself (so screen readers
 * pick the right voice). Indic scripts get no letter-spacing (it breaks conjunct shaping), a line
 * height of at least 1.45 and a size of at least 13 (accessibility review, finding 7).
 */
fun TextStyle.forLang(lang: String, fonts: DheevaraFonts): TextStyle {
    val script = scriptOf(lang)
    val tagged = copy(localeList = LocaleList(lang))
    if (script == Script.Latin) return tagged
    return tagged.copy(
        fontFamily = fonts.forScript(script),
        letterSpacing = 0.em,
        lineHeight = lineHeight.atLeast(minIndicLineHeight),
        lineHeightStyle = LineHeightStyle(LineHeightStyle.Alignment.Center, LineHeightStyle.Trim.None),
        fontSize = fontSize.atLeast(minIndicSize),
    )
}

/** Keeps a daṇḍa (।) or double daṇḍa (॥) on the line of the word before it, so a wrap never strands it. */
fun bindDandas(text: String): String = text.replace(" ।", "\u00A0।").replace(" ॥", "\u00A0॥")

private fun TextUnit.atLeast(min: TextUnit): TextUnit =
    if (this == TextUnit.Unspecified || (type == min.type && value < min.value)) min else this
