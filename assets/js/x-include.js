class XInclude extends HTMLElement {
  async connectedCallback() {
    if (this._loaded) return; this._loaded = true;

    const src = this.getAttribute('src');
    const allow = this.getAttribute('allow') ?? '/partials/'; // whitelist folder
    if (!src || !src.startsWith(allow)) {
      this.innerHTML = `<!-- x-include: blocked or missing src -->`;
      return;
    }
    try {
      const res = await fetch(src, { cache: 'force-cache' });
      if (!res.ok) throw new Error(res.status);
      const html = await res.text();
      this.innerHTML = html;
    } catch (e) {
      console.error('x-include error:', e);
      this.innerHTML = `<!-- x-include: load fail -->`;
    }
  }

  highlightActiveLink() {
    const here = location.pathname.replace(/\/index\.html?$/, '/') || '/';
    this.querySelectorAll('a[href]').forEach(a => {
      let href = a.getAttribute('href');
      if (!href) return;
      // Normalisasi
      href = href.replace(/\/index\.html?$/, '/');
      const isActive = (href === here) || (href !== '/' && here.startsWith(href));
      if (isActive) a.classList.add('text-black','font-semibold'); // Tailwind-friendly
    });
  }
}
customElements.define('x-include', XInclude);
