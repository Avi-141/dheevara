/* Dheevara reveal sheet: the shared module both tracks use (DHE-27).
 * It renders one reveal in the chapter-manifest shape (schema/chapter-manifest.schema.json:
 * reveals[] plus the claims map) as a palm-leaf sheet with three tiers in fixed order:
 * what many heard, what the text says, from our collection. Every claim shows its source line
 * with the same ids as the video. Inlined into each experience by scripts/build-web.mjs; the app's
 * WebView can load it too.
 *
 *   DheevaraReveal.open({ reveal, claims, lang = 'en', title, onClose })   -> close()
 *   DheevaraReveal.claimLine(id, claims)                                     -> "Mahābhārata 7.34.19"
 *
 * Accessible: role=dialog, aria-modal, labelled by its title, focus moves in and is trapped,
 * Escape and the close button return focus to the opener, reduced motion respected. */
(function (global) {
  'use strict';
  var TEXTS = { mbh: 'Mahābhārata', ram: 'Rāmāyaṇa' };
  var CSS = [
    '.dh-reveal{position:fixed;inset:0;z-index:50;display:flex;align-items:flex-end;justify-content:center;background:rgba(6,6,5,.62);padding:16px;padding-bottom:calc(16px + env(safe-area-inset-bottom,0px))}',
    '@media (min-width:720px){.dh-reveal{align-items:center}}',
    '.dh-leaf{--leaf:#EFE6D2;--leaf2:#E5D7B9;--ink:#1E160C;--ink2:#4A3A25;--leafred:#7A2410;background:linear-gradient(180deg,var(--leaf),var(--leaf2));color:var(--ink);width:100%;max-width:620px;max-height:calc(100% - 8px);overflow:auto;border-radius:22px;padding:28px 26px 22px;box-shadow:0 18px 60px rgba(0,0,0,.5);font:400 16px/1.55 "Geist","Noto Sans Devanagari",system-ui,sans-serif;animation:dh-up .28s ease-out}',
    '@media (prefers-reduced-motion:reduce){.dh-leaf{animation:none}}',
    '@keyframes dh-up{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}}',
    '.dh-leaf h2{margin:0;font:400 30px/1.15 "Tiro Devanagari Sanskrit","Noto Serif Devanagari",Georgia,serif;color:var(--leafred);text-wrap:balance}',
    '.dh-leaf .dh-sub{margin:4px 0 18px;font:italic 400 17px/1.3 "Tiro Devanagari Sanskrit",Georgia,serif;color:var(--leafred)}',
    '.dh-tier{display:grid;gap:6px;padding:14px 0;border-top:1px solid rgba(74,58,37,.22)}',
    '.dh-k{font:600 12px/1 "Geist",system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--ink2)}',
    '.dh-tier p{margin:0}',
    '.dh-src{font:500 13px/1.4 "Geist",system-ui,sans-serif;color:var(--leafred);font-variant-numeric:tabular-nums}',
    '.dh-verse{margin:6px 0 0;padding:10px 12px;border-radius:10px;background:rgba(122,36,16,.06);display:grid;gap:4px}',
    '.dh-verse .dv{font:400 18px/1.5 "Tiro Devanagari Sanskrit","Noto Serif Devanagari",serif}',
    '.dh-verse .ia{font:italic 400 14px/1.45 Georgia,serif;color:var(--ink2)}',
    '.dh-verse .tr{font-size:15px}',
    '.dh-none{color:var(--ink2);font-style:italic}',
    '.dh-close{margin-top:16px;width:100%;min-height:48px;border:0;border-radius:999px;background:var(--ink);color:var(--leaf);font:600 15px "Geist",system-ui,sans-serif;cursor:pointer}',
    '.dh-close:focus-visible{outline:3px solid #F2B04A;outline-offset:2px}'
  ].join('\n');

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function pick(map, lang) {
    if (!map) return '';
    return map[lang] || map.en || '';
  }

  /** "Mahābhārata 7.34.19" or "Rāmāyaṇa 5.1.89–93" for a claim id. */
  function claimLine(id) {
    var m = /^([a-z]+)\.(.+?)(?:-(\d+))?$/.exec(id);
    if (!m) return id;
    return (TEXTS[m[1]] || m[1]) + ' ' + m[2] + (m[3] ? '–' + m[3] : '');
  }

  function injectCss() {
    if (document.getElementById('dh-reveal-css')) return;
    var s = el('style');
    s.id = 'dh-reveal-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function verseBlock(id, claim, lang) {
    var box = el('div', 'dh-verse');
    if (claim.devanagari) { var dv = el('p', 'dv', claim.devanagari); dv.lang = 'sa'; box.appendChild(dv); }
    if (claim.iast) { var ia = el('p', 'ia', claim.iast); ia.lang = 'sa-Latn'; box.appendChild(ia); }
    var tr = pick(claim.translation, lang) || pick(claim.summary, lang);
    if (tr) box.appendChild(el('p', 'tr', tr));
    box.appendChild(el('p', 'dh-src', claimLine(id) + ' · ' + (claim.edition || 'critical edition')));
    return box;
  }

  function open(opts) {
    injectCss();
    var reveal = opts.reveal, claims = opts.claims || {}, lang = opts.lang || 'en';
    var opener = document.activeElement;
    var wrap = el('div', 'dh-reveal');
    var leaf = el('div', 'dh-leaf');
    leaf.setAttribute('role', 'dialog');
    leaf.setAttribute('aria-modal', 'true');
    var hid = 'dh-title-' + reveal.id;
    leaf.setAttribute('aria-labelledby', hid);

    var h = el('h2', null, opts.devanagariTitle || pick(reveal.title, lang));
    h.id = hid;
    if (opts.devanagariTitle) h.lang = 'sa';
    leaf.appendChild(h);
    if (opts.devanagariTitle) leaf.appendChild(el('p', 'dh-sub', pick(reveal.title, lang)));

    var t1 = el('section', 'dh-tier');
    t1.appendChild(el('span', 'dh-k', 'What many heard'));
    var pop = pick(reveal.popular && reveal.popular.text, lang);
    t1.appendChild(el('p', pop ? null : 'dh-none', pop || 'No popular telling recorded for this detail.'));
    if (reveal.popular && reveal.popular.source && reveal.popular.source.label) t1.appendChild(el('p', 'dh-src', reveal.popular.source.label));
    leaf.appendChild(t1);

    var t2 = el('section', 'dh-tier');
    t2.appendChild(el('span', 'dh-k', 'What the text says'));
    t2.appendChild(el('p', null, pick(reveal.text.text, lang)));
    reveal.text.claims.forEach(function (id) {
      var c = claims[id];
      if (!c) throw new Error('reveal ' + reveal.id + ' cites ' + id + ', which is missing from the claims map');
      t2.appendChild(verseBlock(id, c, lang));
    });
    leaf.appendChild(t2);

    var t3 = el('section', 'dh-tier');
    t3.appendChild(el('span', 'dh-k', 'From our collection'));
    var col = reveal.collection || { status: 'none' };
    t3.appendChild(el('p', col.status === 'ready' ? null : 'dh-none',
      col.status === 'ready' ? pick(col.text, lang) : col.status === 'proofing' ? 'Being proofed by our scholar.' : 'Nothing from our collection on this detail yet.'));
    leaf.appendChild(t3);

    var close = el('button', 'dh-close', opts.closeLabel || 'Back to the scene');
    close.type = 'button';
    leaf.appendChild(close);
    wrap.appendChild(leaf);
    document.body.appendChild(wrap);

    function done() {
      document.removeEventListener('keydown', onKey, true);
      wrap.remove();
      if (opener && opener.focus) opener.focus();
      if (opts.onClose) opts.onClose();
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(); return; }
      if (e.key === 'Tab') {
        var f = leaf.querySelectorAll('button,[href],[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      e.stopPropagation();
    }
    close.addEventListener('click', done);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) done(); });
    document.addEventListener('keydown', onKey, true);
    close.focus();
    return { close: done, element: wrap };
  }

  global.DheevaraReveal = { open: open, claimLine: claimLine };
})(typeof window !== 'undefined' ? window : globalThis);
