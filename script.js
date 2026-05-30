/* ============================================================
   인터랙션: 테마 토글 · 읽기 진행률 · 목차 활성화 ·
   맨위로 버튼 · 퀴즈 렌더/채점
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 테마 토글 (localStorage 기억) ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  themeToggle.addEventListener("click", function () {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  /* ---------- 읽기 진행률 + 맨위로 버튼 ---------- */
  const bar = document.getElementById("progressBar");
  const toTop = document.getElementById("toTop");
  function onScroll() {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    bar.style.width = (scrolled * 100).toFixed(1) + "%";
    toTop.classList.toggle("show", h.scrollTop > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 목차 현재 위치 강조 (IntersectionObserver) ---------- */
  const links = Array.from(document.querySelectorAll(".toc-link"));
  const map = new Map();
  links.forEach(function (a) {
    const id = a.getAttribute("href").slice(1);
    const el = document.getElementById(id);
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
  map.forEach(function (_link, el) { obs.observe(el); });

  /* ---------- 퀴즈 렌더링 ---------- */
  const form = document.getElementById("quizForm");
  function renderQuiz() {
    form.innerHTML = "";
    QUIZ.forEach(function (item, i) {
      const fs = document.createElement("fieldset");
      fs.className = "q-item";
      fs.id = "q" + i;

      const legend = document.createElement("legend");
      legend.className = "q-text";
      legend.innerHTML = '<span class="qn">Q' + (i + 1) + '</span>' + escapeHtml(item.q);
      fs.appendChild(legend);

      const opts = document.createElement("div");
      opts.className = "q-options";
      item.options.forEach(function (opt, j) {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "q" + i;
        input.value = String(j);
        const span = document.createElement("span");
        span.textContent = opt;
        label.appendChild(input);
        label.appendChild(span);
        opts.appendChild(label);
      });
      fs.appendChild(opts);

      const exp = document.createElement("p");
      exp.className = "q-explain hide";
      exp.id = "exp" + i;
      fs.appendChild(exp);

      form.appendChild(fs);
    });
  }

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------- 채점 ---------- */
  const result = document.getElementById("quizResult");
  document.getElementById("gradeBtn").addEventListener("click", function () {
    let score = 0;
    let unanswered = 0;
    QUIZ.forEach(function (item, i) {
      const picked = form.querySelector('input[name="q' + i + '"]:checked');
      const fs = document.getElementById("q" + i);
      const exp = document.getElementById("exp" + i);
      fs.classList.remove("correct", "wrong");
      if (!picked) {
        unanswered++;
        exp.className = "q-explain";
        exp.innerHTML = "⚠️ 미응답 · 정답: <b>" + escapeHtml(item.options[item.answer]) + "</b><br>" + escapeHtml(item.explain);
        return;
      }
      const isCorrect = Number(picked.value) === item.answer;
      if (isCorrect) { score++; fs.classList.add("correct"); }
      else { fs.classList.add("wrong"); }
      exp.className = "q-explain";
      exp.innerHTML = (isCorrect ? "✅ 정답" : "❌ 오답 · 정답: <b>" + escapeHtml(item.options[item.answer]) + "</b>") +
        "<br>" + escapeHtml(item.explain);
    });

    const pct = Math.round((score / QUIZ.length) * 100);
    let msg;
    if (pct === 100) msg = "완벽합니다! 시험 준비 끝 🎉";
    else if (pct >= 75) msg = "훌륭해요. 오답 해설만 다시 보면 됩니다.";
    else if (pct >= 50) msg = "절반은 넘었어요. 시험 정리 섹션을 복습하세요.";
    else msg = "강의록부터 다시 한 번 — 충분히 따라잡을 수 있습니다.";

    result.hidden = false;
    result.innerHTML =
      '<div class="score">' + score + " / " + QUIZ.length + " (" + pct + "%)</div>" +
      '<p class="msg">' + msg + (unanswered ? " · 미응답 " + unanswered + "개" : "") + "</p>";
    result.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.getElementById("resetBtn").addEventListener("click", function () {
    renderQuiz();
    result.hidden = true;
    document.getElementById("quiz").scrollIntoView({ behavior: "smooth" });
  });

  renderQuiz();
})();
