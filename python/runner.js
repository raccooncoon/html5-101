/* ============================================================
   파이썬 실행기 — Pyodide 지연 로드 + 코드 블록 실행 + 놀이터
   - 모든 .py-run 블록에 ▶ 실행 / ↺ 처음 코드 버튼을 붙인다
   - 첫 실행 클릭 시에만 Pyodide(CDN)를 내려받는다 (지연 로드)
   - input()은 브라우저 prompt 창으로 동작한다
   ============================================================ */
(function () {
  "use strict";

  initPage();

  const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
  let pyodideReady = null; // Promise 캐시

  const loading = document.getElementById("pyLoading");

  function loadPyodideOnce() {
    if (pyodideReady) return pyodideReady;
    loading.classList.add("show");
    pyodideReady = new Promise(function (resolve, reject) {
      const s = document.createElement("script");
      s.src = PYODIDE_URL;
      s.onload = function () {
        loadPyodide().then(function (py) {
          // input()을 브라우저 prompt로 연결
          py.globals.set("__js_prompt", function (msg) {
            const v = window.prompt(msg || "입력:");
            return v === null ? "" : v;
          });
          return py.runPythonAsync(
            "import builtins\n" +
            "builtins.input = lambda prompt='': __js_prompt(str(prompt))\n"
          ).then(function () { resolve(py); });
        }).catch(reject);
      };
      s.onerror = function () { reject(new Error("Pyodide 로드 실패 — 네트워크를 확인하세요.")); };
      document.head.appendChild(s);
    }).finally(function () {
      loading.classList.remove("show");
    });
    return pyodideReady;
  }

  /* 실행 직렬화 큐 — setStdout이 전역 상태라 동시 실행 시 출력이 섞이는 것을 방지 */
  let runQueue = Promise.resolve();
  function runCode(code, outEl) {
    outEl.className = "py-out show";
    outEl.innerHTML = '<span class="out-label">실행 대기 중…</span>';
    const job = runQueue.then(function () { return doRun(code, outEl); });
    runQueue = job.catch(function () {});
    return job;
  }

  function doRun(code, outEl) {
    outEl.innerHTML = '<span class="out-label">실행 중…</span>';
    return loadPyodideOnce().then(function (py) {
      let buf = "";
      py.setStdout({ batched: function (s) { buf += s + "\n"; } });
      py.setStderr({ batched: function (s) { buf += s + "\n"; } });
      return py.runPythonAsync(code).then(function (ret) {
        let text = buf;
        if (ret !== undefined && ret !== null && String(ret) !== "undefined") {
          const r = String(ret);
          if (r && r !== "None") text += r + "\n";
        }
        outEl.innerHTML = '<span class="out-label">▼ 출력</span>' +
          (text.trim() ? escapeText(text) : "(출력 없음)");
      }).catch(function (err) {
        outEl.className = "py-out show error";
        outEl.innerHTML = '<span class="out-label">⚠ 오류</span>' + escapeText(shortError(err));
      });
    }).catch(function (err) {
      outEl.className = "py-out show error";
      outEl.innerHTML = '<span class="out-label">⚠ 오류</span>' + escapeText(String(err.message || err));
    });
  }

  function escapeText(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function shortError(err) {
    // PythonError의 마지막 의미 있는 줄들만 추출
    const lines = String(err.message || err).trim().split("\n");
    const idx = lines.findIndex(function (l) { return l.indexOf("Error") >= 0 && l.indexOf("Traceback") < 0; });
    return lines.slice(Math.max(0, idx >= 0 ? idx - 2 : lines.length - 3)).join("\n");
  }

  function autoHeight(ta) {
    ta.style.height = "auto";
    ta.style.height = (ta.scrollHeight + 2) + "px";
  }

  /* ----- 모든 .py-run 블록을 실행기로 변환 ----- */
  document.querySelectorAll(".py-run").forEach(function (block, i) {
    const pre = block.querySelector("pre");
    const original = (pre ? pre.textContent : "").replace(/^\n+|\s+$/g, "");
    block.innerHTML = "";

    const head = document.createElement("div");
    head.className = "py-head";
    const title = document.createElement("span");
    title.className = "py-title";
    title.textContent = block.dataset.title || "예제 " + (i + 1) + " · 코드를 고쳐도 됩니다";
    const actions = document.createElement("div");
    actions.className = "py-actions";
    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "py-btn secondary";
    resetBtn.textContent = "↺ 처음 코드";
    const runBtn = document.createElement("button");
    runBtn.type = "button";
    runBtn.className = "py-btn";
    runBtn.textContent = "▶ 실행";
    actions.appendChild(resetBtn);
    actions.appendChild(runBtn);
    head.appendChild(title);
    head.appendChild(actions);

    const ta = document.createElement("textarea");
    ta.className = "py-code";
    ta.spellcheck = false;
    ta.value = original;
    ta.setAttribute("aria-label", "파이썬 코드 편집기");
    ta.addEventListener("input", function () { autoHeight(ta); });

    const out = document.createElement("div");
    out.className = "py-out";

    block.appendChild(head);
    block.appendChild(ta);
    block.appendChild(out);
    requestAnimationFrame(function () { autoHeight(ta); });

    runBtn.addEventListener("click", function () {
      runBtn.disabled = true;
      runBtn.textContent = "… 실행 중";
      runCode(ta.value, out).finally(function () {
        runBtn.disabled = false;
        runBtn.textContent = "▶ 실행";
      });
    });
    resetBtn.addEventListener("click", function () {
      ta.value = original;
      autoHeight(ta);
      out.className = "py-out";
      out.innerHTML = "";
    });
  });

  /* ----- 자유 놀이터 ----- */
  const pgCode = document.getElementById("pgCode");
  const pgOut = document.getElementById("pgOut");
  const pgRun = document.getElementById("pgRun");
  if (pgCode && pgOut && pgRun) {
    const PRESETS = {
      hello:
'# 자유롭게 고쳐서 실행해 보세요!\nname = "파이썬"\nprint("안녕,", name)\nprint(name, "공부 시작!")',
      gugudan:
'# 구구단 출력\ndan = 7\nfor i in range(1, 10):\n    print(dan, "x", i, "=", dan * i)',
      grade:
'# 점수 → 학점 변환\nscore = 85\nif score >= 90:\n    print("A학점")\nelif score >= 80:\n    print("B학점")\nelif score >= 70:\n    print("C학점")\nelse:\n    print("F학점")',
      lotto:
'# 로또 번호 추첨 (random 모듈)\nimport random\nnumbers = random.sample(range(1, 46), 6)\nnumbers.sort()\nprint("이번 주 번호:", numbers)'
    };
    document.querySelectorAll(".chip[data-preset]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        pgCode.value = PRESETS[btn.dataset.preset] || "";
        pgOut.textContent = "▶ 실행을 누르면 결과가 여기 나옵니다.";
      });
    });
    pgCode.value = PRESETS.hello;
    pgOut.textContent = "▶ 실행을 누르면 결과가 여기 나옵니다.";

    const fakeOut = document.createElement("div"); // runCode 재사용을 위한 어댑터
    pgRun.addEventListener("click", function () {
      pgRun.disabled = true;
      pgRun.textContent = "… 실행 중";
      runCode(pgCode.value, fakeOut).finally(function () {
        pgOut.textContent = fakeOut.textContent.replace(/^▼ 출력|^⚠ 오류/, "").trim() || "(출력 없음)";
        pgOut.style.color = fakeOut.className.indexOf("error") >= 0 ? "#fda4a4" : "";
        pgRun.disabled = false;
        pgRun.textContent = "▶ 실행";
      });
    });
  }

  /* ----- 퀴즈 ----- */
  if (typeof QUIZ !== "undefined" && document.getElementById("quizForm")) {
    initQuiz({
      form: document.getElementById("quizForm"),
      gradeBtn: document.getElementById("gradeBtn"),
      resetBtn: document.getElementById("resetBtn"),
      result: document.getElementById("quizResult"),
      questions: QUIZ,
      scrollTo: document.getElementById("quiz")
    });
  }
})();
