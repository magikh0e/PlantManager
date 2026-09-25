/**
 * Tropical Roots Maui — Shared Site Components
 * Self-contained: injects nav, footer AND their CSS in one file.
 * Edit NAV_LINKS, SHOP_HREF, LOGO_HREF, FOOTER_TEXT to update all pages at once.
 *
 * USAGE — every page needs these two divs and this one script tag:
 *   <div id="trm-nav"></div>
 *   <div id="trm-footer"></div>
 *   <script src="/site-components.js"></script>   ← always use this root-relative path
 *
 * Works both on the live server and when opened as a local file.
 */
(function () {

  /* ── LOGO IMAGE ── resolve path whether served live or opened locally ── */
  function resolveLogoSrc() {
    // On the live server, use the clean root-relative path
    if (window.location.hostname.indexOf('tropicalrootsmaui.com') !== -1) {
      return '/img/tropicalrootslogosmall.jpeg';
    }
    // Local file: derive the base path from wherever this script was loaded from,
    // then walk up to the site root (where /img/ lives).
    var scripts = document.querySelectorAll('script[src]');
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute('src') || '';
      if (src.indexOf('site-components') !== -1) {
        // Strip the filename (and any subdirectory if loaded from KnowledgeBase/ etc.)
        // to get back to the root, then append the image path.
        var base = new URL(src, document.baseURI).href;
        base = base.replace(/\/[^/]*$/, '');           // remove filename
        base = base.replace(/\/KnowledgeBase$/, '');   // step up from KnowledgeBase/ if needed
        base = base.replace(/\/[^/]*_files$/, '');     // strip browser-saved _files folders
        return base + '/img/tropicalrootslogosmall.jpeg';
      }
    }
    return '/img/tropicalrootslogosmall.jpeg'; // fallback
  }

  /* ── EDIT THESE ── */
  var NAV_LINKS = [
    { label: 'History & Heritage', href: '/#knowledge' },
    { label: 'Kānehiwa',     href: '/#kanehiwa' },
    { label: 'Cannabis Recipes',   href: '/RecipesCollection.html' },
    { label: 'Grow Guides',   href: '/GrowGuides.html' },
    { label: 'Plant Manager',   href: 'https://tracker.tropicalrootsmaui.com', external: true },
    { label: 'About',     href: '/#about' },
    { label: 'Contact',   href: 'https://www.instagram.com/tropicalrootsmaui/', external: true },
  ];
  var SHOP_HREF   = '/SacredGrove.html';
  var LOGO_HREF   = '/';
  var FOOTER_TEXT = '© 2025 Tropical Roots Maui — Seeds sold as souvenirs only.';

  /* ── CSS injected into <head> once ── */
  var CSS = [
    ':root { --trm-nav-h: 68px; --nav-h: 68px; }',

    'nav {',
    '  position: fixed; top: 0; left: 0; right: 0; z-index: 300;',
    '  height: var(--trm-nav-h);',
    '  display: flex; align-items: center; justify-content: space-between;',
    '  padding: 0 2rem; box-sizing: border-box;',
    '  background: rgba(10,12,10,0.95);',
    '  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);',
    '  border-bottom: 1px solid rgba(0,200,192,0.18);',
    '}',
    '.nav-logo { display: flex; align-items: center; gap: 0.85rem; text-decoration: none; flex-shrink: 0; }',
    '.nav-logo-icon {',
    '  width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;',
    '  background: linear-gradient(135deg, #1b3a1e, #2d6e35);',
    '  border: 2px solid #00c8c0;',
    '  display: flex; align-items: center; justify-content: center;',
    '  font-size: 1.3rem; box-shadow: 0 0 14px rgba(0,200,192,0.3);',
    '}',
    '.nav-logo-text .line1 {',
    '  font-family: "Cinzel Decorative", serif; font-size: 0.92rem;',
    '  color: #00c8c0; letter-spacing: 0.1em; display: block; line-height: 1.3;',
    '}',
    '.nav-logo-text .line2 {',
    '  font-family: "Cinzel", serif; font-size: 0.75rem;',
    '  color: #e0ceaa; letter-spacing: 0.22em; text-transform: uppercase; display: block;',
    '}',
    '.nav-links { display: flex; align-items: center; gap: 2rem; list-style: none; margin: 0; padding: 0; }',
    '.nav-links a {',
    '  font-family: "Cinzel", serif; font-size: 0.78rem;',
    '  letter-spacing: 0.16em; text-transform: uppercase;',
    '  color: #e0ceaa; text-decoration: none; opacity: 0.75;',
    '  transition: opacity 0.2s, color 0.2s;',
    '}',
    '.nav-links a:hover { opacity: 1; color: #00c8c0; }',
    '.nav-links a.active { opacity: 1; color: #00c8c0; }',
    '.nav-shop {',
    '  font-family: "Cinzel", serif; font-size: 0.75rem;',
    '  letter-spacing: 0.16em; text-transform: uppercase;',
    '  text-decoration: none; color: #00c8c0;',
    '  border: 1.5px solid #00c8c0; padding: 0.45rem 1.2rem;',
    '  transition: background 0.2s, color 0.2s; white-space: nowrap;',
    '}',
    '.nav-shop:hover { background: #00c8c0; color: #0a0c0a; }',

    '.hamburger {',
    '  display: none; flex-direction: column; gap: 5px;',
    '  cursor: pointer; background: none; border: none; padding: 4px;',
    '  -webkit-tap-highlight-color: transparent;',
    '}',
    '.hamburger span { display: block; width: 24px; height: 2px; background: #00c8c0; transition: 0.25s; }',
    '.hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px,5px); }',
    '.hamburger.open span:nth-child(2) { opacity: 0; }',
    '.hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px,-5px); }',

    '.mobile-menu {',
    '  display: none; position: fixed; top: var(--trm-nav-h); left: 0; right: 0; z-index: 290;',
    '  background: rgba(10,12,10,0.98);',
    '  flex-direction: column; padding: 1.4rem 1.5rem 1.8rem; gap: 1.2rem;',
    '  border-bottom: 2px solid #00c8c0;',
    '}',
    '.mobile-menu.open { display: flex; }',
    '.mobile-menu a {',
    '  font-family: "Cinzel", serif; font-size: 1.05rem;',
    '  letter-spacing: 0.14em; text-transform: uppercase;',
    '  color: #e0ceaa; text-decoration: none;',
    '  border-bottom: 1px solid rgba(255,255,255,0.07); padding-bottom: 1rem;',
    '}',
    '.mobile-menu a:last-child { border-bottom: none; color: #00c8c0; padding-bottom: 0; }',

    'footer {',
    '  background: #070908;',
    '  border-top: 1px solid rgba(0,200,192,0.12);',
    '  padding: 4rem 2.5rem 2rem;',
    '  position: relative; z-index: 1;',
    '}',
    '.footer-grid {',
    '  max-width: 1200px; margin: 0 auto;',
    '  display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem;',
    '  padding-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,0.06);',
    '}',
    '.footer-brand .nav-logo-icon { width: 48px; height: 48px; font-size: 1.4rem; }',
    '.footer-brand .brand-name {',
    '  font-family: "Cinzel Decorative", serif;',
    '  font-size: 1rem; color: #00c8c0; margin: 1rem 0 0.8rem; display: block;',
    '}',
    '.footer-brand p { font-size: 0.92rem; color: rgba(240,234,216,0.62); line-height: 1.7; max-width: 260px; }',
    '.footer-col .footer-heading {',
    '  font-family: "Cinzel", serif; font-size: 0.72rem; letter-spacing: 0.2em;',
    '  text-transform: uppercase; color: #f0b429; margin-bottom: 1.4rem;',
    '}',
    '.footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 0.8rem; padding: 0; margin: 0; }',
    '.footer-col ul a {',
    '  font-size: 0.92rem; color: rgba(240,234,216,0.62); text-decoration: none;',
    '  transition: color 0.2s;',
    '}',
    '.footer-col ul a:hover { color: #00c8c0; }',
    '.footer-bottom {',
    '  max-width: 1200px; margin: 0 auto;',
    '  display: flex; justify-content: space-between; align-items: center;',
    '  flex-wrap: wrap; gap: 1rem; padding-top: 2rem;',
    '}',
    '.footer-bottom p { font-family: "Lora", serif; font-size: 0.82rem; color: rgba(240,234,216,0.25); }',
    '.socials { display: flex; gap: 0.8rem; }',
    '.socials a {',
    '  width: 36px; height: 36px; border: 1px solid rgba(255,255,255,0.1);',
    '  display: flex; align-items: center; justify-content: center;',
    '  font-size: 1rem; text-decoration: none;',
    '  transition: border-color 0.2s, background 0.2s;',
    '}',
    '.socials a:hover { border-color: #00c8c0; background: rgba(0,200,192,0.1); }',

    '@media (max-width: 1000px) {',
    '  .footer-grid { grid-template-columns: 1fr 1fr; }',
    '  .footer-brand { grid-column: 1 / -1; }',
    '}',
    '@media (max-width: 640px) {',
    '  .footer-grid { grid-template-columns: 1fr; }',
    '}',

    '@media (max-width: 760px) {',
    '  .nav-links, .nav-shop { display: none; }',
    '  .hamburger { display: flex; }',
    '}',
  ].join('\n');

  /* ── helpers ── */
  function getActivePage() {
    var path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  }

  function injectCSS() {
    if (document.getElementById('trm-styles')) return;
    /* Skip if external site-components.css already loaded */
    try { var ss=document.styleSheets; for(var i=0;i<ss.length;i++) if((ss[i].href||'').indexOf('site-components.css')!==-1) return; } catch(e){}
    var s = document.createElement('style');
    s.id = 'trm-styles';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function buildNav() {
    var active = getActivePage();
    var links = NAV_LINKS.map(function (link) {
      var isActive = link.href === active || (active.length > 1 && link.href.indexOf(active) !== -1);
      var ext = link.external ? ' target="_blank" rel="noopener"' : '';
      var cls = isActive ? ' class="active"' : '';
      return '<li><a href="' + link.href + '"' + ext + cls + '>' + link.label + '</a></li>';
    }).join('');
    var mobile = NAV_LINKS.map(function (link) {
      var ext = link.external ? ' target="_blank" rel="noopener"' : '';
      return '<a href="' + link.href + '"' + ext + ' onclick="TRM.closeNav()">' + link.label + '</a>';
    }).join('');

    var logoSrc = resolveLogoSrc();
    return '<nav>'
      + '<a href="' + LOGO_HREF + '" class="nav-logo">'
      +   '<div class="nav-logo-icon" style="padding:0;overflow:hidden;"><img src="' + logoSrc + '" alt="Tropical Roots Maui logo" title="Tropical Roots Maui - Alchemist\u2019s Small Logo" width="44" height="44" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"></div>'
      +   '<div class="nav-logo-text">'
      +     '<span class="line1">Tropical Roots</span>'
      +     '<span class="line2">Maui</span>'
      +   '</div>'
      + '</a>'
      + '<ul class="nav-links">' + links + '</ul>'
      + '<a href="' + SHOP_HREF + '" class="nav-shop">The Sacred Grove</a>'
      + '<button class="hamburger" id="trm-burger" onclick="TRM.toggleNav()" aria-label="Toggle menu">'
      +   '<span></span><span></span><span></span>'
      + '</button>'
      + '</nav>'
      + '<div class="mobile-menu" id="trm-mobile-nav">'
      +   mobile
      +   '<a href="' + SHOP_HREF + '" onclick="TRM.closeNav()">The Sacred Grove &#x2192;</a>'
      + '</div>';
  }

  function buildFooter() {
    var logoSrc = resolveLogoSrc();
    return '<footer>'
      + '<div class="footer-grid">'
      +   '<div class="footer-brand">'
      +     '<div class="nav-logo-icon" style="width:48px;height:48px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;overflow:hidden;border:2px solid #00c8c0;box-shadow:0 0 16px rgba(0,200,192,0.3);padding:0;">'
      +       '<img src="' + logoSrc + '" alt="Tropical Roots Maui logo" title="Tropical Roots Maui - Alchemist\u2019s Small Logo" width="48" height="48" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">'
      +     '</div>'
      +     '<span class="brand-name">Tropical Roots Maui</span>'
      +     '<p>Celebrating Maui\'s botanical heritage through premium collectible novelties. Rooted in aloha, shipped with care.</p>'
      +   '</div>'
      +   '<div class="footer-col">'
      +     '<p class="footer-heading">The Sacred Grove</p>'
      +     '<ul>'
      +       '<li><a href="/SacredGrove.html">All Products</a></li>'
      +       '<li><a href="/SacredGrove.html">New Arrivals</a></li>'
      +       '<li><a href="/SacredGrove.html">Grove Offerings</a></li>'
      +       '<li><a href="/SacredGrove.html">Limited Edition</a></li>'
      +     '</ul>'
      +   '</div>'
      +   '<div class="footer-col">'
      +     '<p class="footer-heading">Learn</p>'
      +     '<ul>'
      +       '<li><a href="/#knowledge">Pakalolo History</a></li>'
      +       '<li><a href="/#">Island Strains</a></li>'
      +       '<li><a href="/GrowGuides.html">Growing Guides</a></li>'
      +       '<li><a href="https://tracker.tropicalrootsmaui.com" target="_blank">Plant Manager</a></li>'
      +     '</ul>'
      +   '</div>'
      +   '<div class="footer-col">'
      +     '<p class="footer-heading">Info</p>'
      +     '<ul>'
      +       '<li><a href="/#about">About Us</a></li>'
      +       '<li><a href="/#">Shipping Policy</a></li>'
      +       '<li><a href="/#">FAQ</a></li>'
      +       '<li><a href="/#contact">Contact</a></li>'
      +     '</ul>'
      +   '</div>'
      + '</div>'
      + '<div class="footer-bottom">'
      +   '<p>© 2025 Tropical Roots Maui — All seeds sold as novelty/souvenir items only. 0% THC.</p>'
      +   '<div class="socials">'
      +     '<a href="https://www.instagram.com/tropicalrootsmaui/" target="_blank">📸</a>'
      +     '<a href="/#contact">✉️</a>'
      +   '</div>'
      + '</div>'
      + '</footer>';
  }

  function inject() {
    injectCSS();
    var navEl    = document.getElementById('trm-nav');
    var footerEl = document.getElementById('trm-footer');
    if (navEl)    navEl.outerHTML    = buildNav();
    if (footerEl) footerEl.outerHTML = buildFooter();

    document.addEventListener('click', function (e) {
      var menu   = document.getElementById('trm-mobile-nav');
      var burger = document.getElementById('trm-burger');
      if (!menu || !burger) return;
      if (menu.classList.contains('open') && !menu.contains(e.target) && !burger.contains(e.target)) {
        TRM.closeNav();
      }
    });
  }

  window.TRM = {
    toggleNav: function () {
      var b = document.getElementById('trm-burger');
      var m = document.getElementById('trm-mobile-nav');
      if (b) b.classList.toggle('open');
      if (m) m.classList.toggle('open');
    },
    closeNav: function () {
      var b = document.getElementById('trm-burger');
      var m = document.getElementById('trm-mobile-nav');
      if (b) b.classList.remove('open');
      if (m) m.classList.remove('open');
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
