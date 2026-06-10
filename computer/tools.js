/* ============================================================
   컴퓨터의 이해 — 체험 도구
   ① 진법 변환기  ② 논리 게이트 시뮬레이터  ③ 2의 보수 계산기
   공용 초기화(initPage)와 퀴즈(initQuiz)도 여기서 호출한다.
   ============================================================ */
(function () {
  "use strict";

  initPage();

  /* ---------- ① 진법 변환기 ---------- */
  (function baseConverter() {
    const input = document.getElementById("baseInput");
    const select = document.getElementById("baseSelect");
    if (!input || !select) return;
    const outs = {
      2: document.getElementById("out2"),
      8: document.getElementById("out8"),
      10: document.getElementById("out10"),
      16: document.getElementById("out16")
    };
    const steps = document.getElementById("baseSteps");
    const error = document.getElementById("baseError");

    const VALID = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^[0-9]+$/, 16: /^[0-9a-fA-F]+$/ };

    function divisionSteps(n, base) {
      // 10진수 n을 base진수로 바꾸는 나눗셈 과정 문자열
      if (n === 0) return "0 → 그대로 0";
      const lines = [];
      let q = n;
      const rems = [];
      while (q > 0) {
        const r = q % base;
        const digit = r.toString(base).toUpperCase();
        lines.push(q + " ÷ " + base + " = " + Math.floor(q / base) + " … 나머지 <b>" + digit + "</b>");
        rems.push(digit);
        q = Math.floor(q / base);
      }
      lines.push("나머지를 거꾸로 읽으면 → <b>" + rems.reverse().join("") + "</b>");
      return lines.join("<br>");
    }

    function update() {
      const raw = input.value.trim();
      const base = Number(select.value);
      error.textContent = "";
      if (!raw) {
        Object.values(outs).forEach(function (o) { o.textContent = "—"; });
        steps.innerHTML = "숫자를 입력하면 변환 과정이 여기 표시됩니다.";
        return;
      }
      if (!VALID[base].test(raw)) {
        error.textContent = "⚠️ " + base + "진법에 쓸 수 없는 글자가 있어요.";
        return;
      }
      const dec = parseInt(raw, base);
      if (!Number.isSafeInteger(dec)) {
        error.textContent = "⚠️ 숫자가 너무 큽니다.";
        return;
      }
      outs[2].textContent = dec.toString(2);
      outs[8].textContent = dec.toString(8);
      outs[10].textContent = dec.toString(10);
      outs[16].textContent = dec.toString(16).toUpperCase();

      let html = "";
      if (base !== 10) {
        // 자릿값 전개로 10진수 만들기
        const digits = raw.toUpperCase().split("");
        const terms = digits.map(function (d, i) {
          const p = digits.length - 1 - i;
          return parseInt(d, base) + "×" + base + "^" + p;
        });
        html += "<b>① " + base + "진수 → 10진수</b><br>" +
          "(" + raw.toUpperCase() + ")" + base + " = " + terms.join(" + ") + " = <b>" + dec + "</b><br><br>";
      }
      html += "<b>" + (base !== 10 ? "② " : "") + "10진수 " + dec + " → 2진수 (나눗셈법)</b><br>" + divisionSteps(dec, 2);
      steps.innerHTML = html;
    }

    input.addEventListener("input", update);
    select.addEventListener("change", update);
    input.value = "13";
    update();
  })();

  /* ---------- ② 논리 게이트 시뮬레이터 ---------- */
  (function gateSim() {
    const btnA = document.getElementById("swA");
    const btnB = document.getElementById("swB");
    const gateSel = document.getElementById("gateSelect");
    if (!btnA || !btnB || !gateSel) return;
    const stateA = document.getElementById("stA");
    const stateB = document.getElementById("stB");
    const lamp = document.getElementById("gateLamp");
    const table = document.getElementById("truthTable");
    const rowB = document.getElementById("swRowB");

    const GATES = {
      AND: function (a, b) { return a && b; },
      OR: function (a, b) { return a || b; },
      XOR: function (a, b) { return a !== b; },
      NAND: function (a, b) { return !(a && b); },
      NOR: function (a, b) { return !(a || b); },
      NOT: function (a) { return !a; }
    };

    let a = false, b = false;

    function render() {
      const gate = gateSel.value;
      const unary = gate === "NOT";
      rowB.style.display = unary ? "none" : "flex";

      btnA.classList.toggle("on", a);
      btnB.classList.toggle("on", b);
      stateA.textContent = a ? "1" : "0";
      stateB.textContent = b ? "1" : "0";

      const out = unary ? GATES.NOT(a) : GATES[gate](a, b);
      lamp.classList.toggle("on", out);
      lamp.textContent = out ? "1" : "0";

      // 진리표 갱신
      let html = "";
      if (unary) {
        html = "<tr><th>A</th><th>출력</th></tr>";
        [false, true].forEach(function (va) {
          const o = GATES.NOT(va);
          html += '<tr class="' + (va === a ? "hl" : "") + '"><td>' + (va ? 1 : 0) + "</td><td>" + (o ? 1 : 0) + "</td></tr>";
        });
      } else {
        html = "<tr><th>A</th><th>B</th><th>출력</th></tr>";
        [[false, false], [false, true], [true, false], [true, true]].forEach(function (pair) {
          const o = GATES[gate](pair[0], pair[1]);
          const hl = pair[0] === a && pair[1] === b;
          html += '<tr class="' + (hl ? "hl" : "") + '"><td>' + (pair[0] ? 1 : 0) + "</td><td>" + (pair[1] ? 1 : 0) + "</td><td>" + (o ? 1 : 0) + "</td></tr>";
        });
      }
      table.innerHTML = html;
    }

    btnA.addEventListener("click", function () { a = !a; render(); });
    btnB.addEventListener("click", function () { b = !b; render(); });
    gateSel.addEventListener("change", render);
    render();
  })();

  /* ---------- ③ 2의 보수 계산기 ---------- */
  (function twosComplement() {
    const input = document.getElementById("compInput");
    if (!input) return;
    const stepOrig = document.getElementById("compOrig");
    const stepOnes = document.getElementById("compOnes");
    const stepTwos = document.getElementById("compTwos");
    const note = document.getElementById("compNote");

    function bitsHtml(str) {
      return str.split("").map(function (ch) { return "<span>" + ch + "</span>"; }).join("");
    }

    function update() {
      const v = Number(input.value);
      if (!Number.isInteger(v) || v < -128 || v > 127) {
        note.textContent = "⚠️ -128 ~ 127 사이의 정수를 입력하세요 (8비트 기준).";
        return;
      }
      const abs = Math.abs(v);
      const origBits = abs.toString(2).padStart(8, "0");
      stepOrig.innerHTML = bitsHtml(origBits);

      if (v >= 0) {
        stepOnes.innerHTML = bitsHtml(origBits);
        stepTwos.innerHTML = bitsHtml(origBits);
        note.textContent = "양수는 그대로 저장합니다. 보수 변환은 음수를 표현할 때 사용해요.";
        return;
      }
      const ones = origBits.split("").map(function (ch) { return ch === "0" ? "1" : "0"; }).join("");
      const twos = ((parseInt(ones, 2) + 1) & 0xFF).toString(2).padStart(8, "0");
      stepOnes.innerHTML = bitsHtml(ones);
      stepTwos.innerHTML = bitsHtml(twos);
      note.textContent = "검산: " + twos + " = " + ((parseInt(twos, 2) << 24) >> 24) + " ✓ (최상위 비트 1 = 음수)";
    }

    input.addEventListener("input", update);
    input.value = "-5";
    update();
  })();

  /* ---------- 퀴즈 ---------- */
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
