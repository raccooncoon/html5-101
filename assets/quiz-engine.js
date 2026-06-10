/* ============================================================
   공용 퀴즈 엔진 — 문항 배열을 받아 렌더·채점·리셋을 처리한다.
   문항 형식: { q, options[], answer(정답 인덱스), explain, code? }
   code(선택): 문제에 딸린 코드 블록(문자열) — <pre>로 표시
   사용: initQuiz({ form, gradeBtn, resetBtn, result, questions, scrollTo? })
   ============================================================ */
(function () {
  "use strict";

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  window.initQuiz = function (cfg) {
    const form = cfg.form;
    const result = cfg.result;
    const questions = cfg.questions;

    function render() {
      form.innerHTML = "";
      questions.forEach(function (item, i) {
        const fs = document.createElement("fieldset");
        fs.className = "q-item";
        fs.id = "q" + i;

        const legend = document.createElement("legend");
        legend.className = "q-text";
        legend.innerHTML = '<span class="qn">Q' + (i + 1) + '</span>' + escapeHtml(item.q);
        fs.appendChild(legend);

        if (item.code) {
          const pre = document.createElement("pre");
          pre.className = "q-code";
          const codeEl = document.createElement("code");
          codeEl.textContent = item.code;
          pre.appendChild(codeEl);
          fs.appendChild(pre);
        }

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

    function grade() {
      let score = 0, unanswered = 0;
      questions.forEach(function (item, i) {
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

      const pct = Math.round((score / questions.length) * 100);
      let msg;
      if (pct === 100) msg = "완벽합니다! 시험 준비 끝 🎉";
      else if (pct >= 75) msg = "훌륭해요. 오답 해설만 다시 보면 됩니다.";
      else if (pct >= 50) msg = "절반은 넘었어요. 시험 정리 섹션을 복습하세요.";
      else msg = "강의 정리부터 다시 한 번 — 충분히 따라잡을 수 있습니다.";

      result.hidden = false;
      result.innerHTML = '<div class="score">' + score + " / " + questions.length + " (" + pct + "%)</div>" +
        '<p class="msg">' + msg + (unanswered ? " · 미응답 " + unanswered + "개" : "") + "</p>";
      result.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    cfg.gradeBtn.addEventListener("click", grade);
    cfg.resetBtn.addEventListener("click", function () {
      render();
      result.hidden = true;
      if (cfg.scrollTo) cfg.scrollTo.scrollIntoView({ behavior: "smooth" });
    });

    render();
  };
})();
