// "One screen per section" checks, run inside the page (puppeteer or pasted in
// a browser console). Installs window.__fit with:
//   list()      every screen: id, page top, height
//   check(i)    issues for screen i at the CURRENT scroll position (scroll it
//               to the top of the viewport first; the runner does this)
//   page()      page-wide issues (horizontal overflow)
// A screen is `[data-screen]`; on pages without them (the pre-redesign
// homepage) every `main > section` is audited instead. A pinned story
// (`[data-story]`) is a tall track: its checks run on the pinned panel, at
// the middle of each chapter (the runner scrolls to each).
(() => {
  const screens = () => {
    const tagged = [...document.querySelectorAll("[data-screen]")];
    return tagged.length ? tagged : [...document.querySelectorAll("main > section")];
  };

  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  // elements that carry readable content: text-bearing leaves and product UI
  const contentNodes = (root) =>
    [...root.querySelectorAll("*")].filter((el) => {
      if (el.closest("[data-bleed]") || el.closest("[aria-hidden='true']")) return false;
      if (el.matches("[data-ui]")) return true;
      return [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    });

  // the box a screen's checks run on: the pinned panel for a story
  const frame = (s) => (s.matches("[data-story]") ? s.querySelector("[data-story-panel]") || s : s);

  const hit = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

  window.__fit = {
    list() {
      return screens().map((s, i) => {
        const r = s.getBoundingClientRect();
        const head = (s.querySelector("h1,h2")?.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
        const top = Math.round(r.top + scrollY);
        const chapters = s.matches("[data-story]") ? Number(s.style.getPropertyValue("--chapters")) || 1 : 0;
        // a story is checked at the middle of each chapter
        const stops = chapters ? Array.from({ length: chapters }, (_, k) => Math.round(top + ((k + 0.5) / chapters) * Math.max(0, r.height - innerHeight))) : [top];
        return { i, id: s.id || s.dataset.screen || s.className.toString().split(" ")[0] || `screen-${i}`, top, h: Math.round(r.height), head, stops };
      });
    },

    check(i) {
      const s = frame(screens()[i]);
      const vh = innerHeight;
      const r = s.getBoundingClientRect();
      const issues = [];
      if (s.dataset.fit !== "grow" && r.height > vh + 1) issues.push(`taller than the viewport: ${Math.round(r.height)}px > ${vh}px (${(r.height / vh).toFixed(2)} screens)`);

      // nothing may hang outside its own screen
      let straddle = 0;
      for (const el of s.querySelectorAll("*")) {
        if (el.closest("[data-bleed]") || !visible(el)) continue;
        if (getComputedStyle(el).position === "fixed") continue;
        const e = el.getBoundingClientRect();
        if (e.bottom > r.bottom + 1 || e.top < r.top - 1) straddle++;
      }
      if (straddle) issues.push(`${straddle} element(s) extend past the screen edge`);

      // with the screen at the top of the viewport, content must clear the chrome
      // (a section that runs taller than the viewport scrolls under the island by
      // design, so for those only the nav is checked)
      const tall = s.dataset.fit === "grow" && r.height > vh + 1;
      const chrome = [document.querySelector(".nav"), tall ? null : document.querySelector(".island")].filter(Boolean).filter(visible);
      const blocked = new Set();
      for (const el of contentNodes(s)) {
        if (!visible(el)) continue;
        const e = el.getBoundingClientRect();
        if (e.bottom < 0 || e.top > vh) continue;
        for (const c of chrome) if (hit(e, c.getBoundingClientRect())) blocked.add(c.classList.contains("nav") ? "nav" : "island");
      }
      if (blocked.size) issues.push(`content under the ${[...blocked].join(" and ")}`);

      // Aan and its bubble never sit on product UI
      const aan = document.querySelector("[data-aan-traveler]");
      if (aan && visible(aan)) {
        const a = aan.getBoundingClientRect();
        if ([...s.querySelectorAll("[data-ui]")].some((u) => hit(a, u.getBoundingClientRect()))) issues.push("Aan overlaps product UI");
      }
      return issues;
    },

    page() {
      const issues = [];
      const sw = document.documentElement.scrollWidth;
      if (sw > innerWidth + 1) issues.push(`horizontal overflow: ${sw}px > ${innerWidth}px`);
      return issues;
    },
  };
})();
