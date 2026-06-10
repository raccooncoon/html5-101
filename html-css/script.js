/* ============================================================
   HTML/CSS 과목 전용 로직 — 라이브 예시 렌더링 · 코드 놀이터
   공용 기능(테마·진행률·목차·퀴즈)은 ../assets/common.js,
   ../assets/quiz-engine.js 사용.
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

  /* ---------- 공용 초기화 (테마·진행률·목차) ---------- */
  initPage();

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

  /* ---------- 퀴즈 (공용 엔진) ---------- */
  initQuiz({
    form: document.getElementById("quizForm"),
    gradeBtn: document.getElementById("gradeBtn"),
    resetBtn: document.getElementById("resetBtn"),
    result: document.getElementById("quizResult"),
    questions: QUIZ,
    scrollTo: document.getElementById("quiz")
  });
})();
