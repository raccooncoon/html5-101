/* ============================================================
   인터랙션: 테마 · 진행률 · 목차 · 맨위로 ·
   라이브 예시 렌더링 · 코드 놀이터 · 퀴즈
   ============================================================ */
(function () {
  "use strict";

  /* iframe 안에 넣을 기본 문서 틀 (깨끗한 흰 캔버스) */
  function frameDoc(code) {
    return '<!doctype html><html lang="ko"><head><meta charset="utf-8">' +
      '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap" rel="stylesheet">' +
      '<style>*{box-sizing:border-box}html,body{margin:0}' +
      'body{font-family:"Noto Sans KR",system-ui,-apple-system,sans-serif;padding:14px;' +
      'line-height:1.6;color:#1a2027;background:#fff;font-size:15px}</style>' +
      '</head><body>' + code + '</body></html>';
  }

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------- 테마 토글 ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  themeToggle.addEventListener("click", function () {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  /* ---------- 진행률 + 맨위로 ---------- */
  const bar = document.getElementById("progressBar");
  const toTop = document.getElementById("toTop");
  function onScroll() {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    bar.style.width = (scrolled * 100).toFixed(1) + "%";
    toTop.classList.toggle("show", h.scrollTop > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 목차 현재 위치 강조 ---------- */
  const links = Array.from(document.querySelectorAll(".toc-link"));
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

  /* ---------- 라이브 예시 렌더링 ---------- */
  function buildDemo(mount, demo) {
    const card = document.createElement("div");
    card.className = "live-demo";

    const head = document.createElement("div");
    head.className = "ld-head";
    head.innerHTML = '<span class="ld-title">👀 ' + escapeHtml(demo.title) + '</span>' +
      '<span class="ld-note">' + escapeHtml(demo.note) + '</span>';
    card.appendChild(head);

    const frame = document.createElement("iframe");
    frame.className = "ld-frame";
    frame.setAttribute("sandbox", "allow-same-origin"); // 스크립트 없음 → 높이 측정만
    frame.title = demo.title + " 예시";
    card.appendChild(frame);

    const codeWrap = document.createElement("div");
    codeWrap.className = "ld-codewrap";
    codeWrap.innerHTML = '<span class="ld-codelabel">&lt;/&gt; 이 코드가 위 결과를 만듭니다</span>' +
      '<pre class="ld-code"><code>' + escapeHtml(demo.code) + '</code></pre>';
    card.appendChild(codeWrap);

    mount.appendChild(card);

    // 내용 높이에 맞춰 iframe 높이 자동 조정
    frame.addEventListener("load", function () {
      try {
        const doc = frame.contentDocument;
        const fit = function () {
          const h = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
          frame.style.height = h + "px";
        };
        fit();
        if (window.ResizeObserver) {
          new ResizeObserver(fit).observe(doc.body);
        }
      } catch (e) { frame.style.height = "180px"; }
    });
    frame.srcdoc = frameDoc(demo.code);
  }

  document.querySelectorAll(".demo-mount").forEach(function (mount) {
    const demo = (typeof DEMOS !== "undefined") && DEMOS[mount.dataset.demo];
    if (demo) buildDemo(mount, demo);
  });

  /* ---------- 코드 놀이터 ---------- */
  const pgCode = document.getElementById("pgCode");
  const pgView = document.getElementById("pgView");
  if (pgCode && pgView) {
    pgView.setAttribute("sandbox", "allow-scripts"); // 실험용 JS 허용, 부모 접근은 차단
    let timer;
    const render = function () { pgView.srcdoc = frameDoc(pgCode.value); };
    pgCode.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(render, 200);
    });
    document.querySelectorAll(".chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const preset = (typeof PRESETS !== "undefined") && PRESETS[btn.dataset.preset];
        if (preset) { pgCode.value = preset; render(); }
      });
    });
    // 처음엔 '버튼' 예제로 시작
    if (typeof PRESETS !== "undefined") pgCode.value = PRESETS.button;
    render();
  }

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

  /* ---------- 채점 ---------- */
  const result = document.getElementById("quizResult");
  document.getElementById("gradeBtn").addEventListener("click", function () {
    let score = 0, unanswered = 0;
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
      const ok = Number(picked.value) === item.answer;
      if (ok) { score++; fs.classList.add("correct"); }
      else { fs.classList.add("wrong"); }
      exp.className = "q-explain";
      exp.innerHTML = (ok ? "✅ 정답" : "❌ 오답 · 정답: <b>" + escapeHtml(item.options[item.answer]) + "</b>") +
        "<br>" + escapeHtml(item.explain);
    });

    const pct = Math.round((score / QUIZ.length) * 100);
    let msg;
    if (pct === 100) msg = "완벽합니다! 시험 준비 끝 🎉";
    else if (pct >= 75) msg = "훌륭해요. 오답 해설만 다시 보면 됩니다.";
    else if (pct >= 50) msg = "절반은 넘었어요. 시험 정리 섹션을 복습하세요.";
    else msg = "강의록부터 다시 한 번 — 충분히 따라잡을 수 있습니다.";

    result.hidden = false;
    result.innerHTML = '<div class="score">' + score + " / " + QUIZ.length + " (" + pct + "%)</div>" +
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
