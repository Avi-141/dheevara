package app.dheevara.ui.components

import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import app.dheevara.core.manifest.TaggedText
import app.dheevara.ui.theme.DheevaraTheme
import app.dheevara.ui.theme.LocalContentColor
import app.dheevara.ui.theme.Script
import app.dheevara.ui.theme.bindDandas
import app.dheevara.ui.theme.forLang
import app.dheevara.ui.theme.scriptOf

/**
 * All text goes through here so it always carries its language tag: the tag picks the font,
 * applies the Indic typography rules and tells screen readers which voice to use.
 */
@Composable
fun DText(
    text: String,
    style: TextStyle,
    modifier: Modifier = Modifier,
    lang: String = "en",
    color: Color = LocalContentColor.current,
    align: TextAlign = TextAlign.Unspecified,
    maxLines: Int = Int.MAX_VALUE,
) {
    BasicText(
        text = if (scriptOf(lang) == Script.Latin) text else bindDandas(text),
        modifier = modifier,
        style = style.forLang(lang, DheevaraTheme.fonts).copy(color = color, textAlign = align),
        overflow = TextOverflow.Ellipsis,
        maxLines = maxLines,
    )
}

@Composable
fun DText(
    text: TaggedText,
    style: TextStyle,
    modifier: Modifier = Modifier,
    color: Color = LocalContentColor.current,
    align: TextAlign = TextAlign.Unspecified,
    maxLines: Int = Int.MAX_VALUE,
) = DText(text.text, style, modifier, text.lang, color, align, maxLines)
