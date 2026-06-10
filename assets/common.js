/* ============================================================
   공용 인터랙션 — 테마 토글 · 읽기 진행률 · 목차 강조 · 맨위로
   각 기능은 해당 요소가 페이지에 있을 때만 활성화된다.
   사용: <script src=".../assets/common.js"></script> 후 initPage()
   ============================================================ */
(function () {
  "use strict";

  function initTheme() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    const saved = localStorage.getItem("theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    btn.addEventListener("click", function () {
      const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  function initScrollUi() {
    const bar = document.getElementById("progressBar");
    const toTop = document.getElementById("toTop");
    if (!bar && !toTop) return;
    function onScroll() {
      const h = document.documentElement;
      if (bar) {
        const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
        bar.style.width = (scrolled * 100).toFixed(1) + "%";
      }
      if (toTop) toTop.classList.toggle("show", h.scrollTop > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initToc() {
    const links = Array.from(document.querySelectorAll(".toc-link"));
    if (!links.length) return;
    const map = new Map();
    links.forEach(function (a) {
      const el = document.getElementById(a.getAttribute("href").slice(1));
      if (el) map.set(el, a);
    });
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          const link = map.get(e.target);
          if (link) link.classList.add("active");
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    map.forEach(function (_l, el) { obs.observe(el); });
  }

  window.initPage = function () {
    initTheme();
    initScrollUi();
    initToc();
  };
})();
