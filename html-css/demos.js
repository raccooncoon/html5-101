/* ============================================================
   라이브 예시 데이터
   각 데모는 { title, note, code } — code는 실제로 iframe 안에서
   렌더링되며, 동시에 화면에 코드로도 보여줍니다 (입력=결과 일치).
   ============================================================ */
const DEMOS = {
  /* ---- 01 문서 구조 & 텍스트 ---- */
  headings: {
    title: "헤딩 h1~h6",
    note: "숫자가 커질수록 글자가 작아져요. 하지만 '크기'가 아니라 '목차 단계' 때문에 고릅니다.",
    code:
`<h1>h1 · 책 제목</h1>
<h2>h2 · 챕터</h2>
<h3>h3 · 소제목</h3>
<h4>h4</h4>
<h5>h5</h5>
<h6>h6 · 가장 작음</h6>`
  },
  emphasis: {
    title: "strong/em vs b/i",
    note: "겉보기엔 굵게·기울임으로 똑같지만, strong·em은 '의미상 강조'라 스크린리더가 다르게 읽어줍니다.",
    code:
`<p>오늘은 <strong>정말 중요한</strong> 날이고,
이 단어는 <em>강조</em>하고 싶어요.</p>
<p>비교: <b>그냥 굵게</b> · <i>그냥 기울임</i></p>`
  },
  blockinline: {
    title: "블록 vs 인라인",
    note: "블록(div·p)은 한 줄을 통째로 차지해 세로로 쌓이고, 인라인(span·a)은 내용만큼만 차지해 옆으로 붙어요.",
    code:
`<style>
  .b{background:#ffe1d6;padding:6px;margin:3px 0}
  .i{background:#d6f5f0;padding:6px}
</style>
<div class="b">블록 1 (한 줄 전체)</div>
<div class="b">블록 2 → 아래로 쌓임</div>
<span class="i">인라인 A</span>
<span class="i">인라인 B → 옆으로 붙음</span>`
  },

  /* ---- 02 리스트·표 ---- */
  lists: {
    title: "ul · ol · dl",
    note: "순서 없으면 ul(점), 순서 있으면 ol(숫자), '용어:설명' 짝은 dl을 씁니다.",
    code:
`<ul>
  <li>사과 — 순서 없음 (ul)</li>
  <li>바나나</li>
</ul>
<ol>
  <li>물 끓이기 — 순서 있음 (ol)</li>
  <li>면 넣기</li>
</ol>
<dl>
  <dt>CPU</dt><dd>인텔 i7 — 용어:설명 (dl)</dd>
</dl>`
  },
  table: {
    title: "표 구조(thead/tbody/tfoot) + 칸 합치기",
    note: "표는 머리글 thead · 본문 tbody · 바닥글 tfoot으로 나눕니다. colspan=가로, rowspan=세로 병합, th엔 scope.",
    code:
`<style>
  table{border-collapse:collapse}
  th,td{border:1px solid #bbb;padding:6px 12px}
  thead th{background:#0d9488;color:#fff}
  tfoot td{background:#f3f4f6;font-weight:700}
</style>
<table>
  <thead>
    <tr><th scope="col">이름</th><th scope="col">국어</th><th scope="col">영어</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">홍길동</th><td>90</td><td>85</td></tr>
    <tr><th scope="row">김영희</th><td>95</td><td>80</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="3">평균 87.5점 (colspan=3 → 세 칸 합침)</td></tr>
  </tfoot>
</table>`
  },

  /* ---- 03 미디어·시멘틱 ---- */
  semantic: {
    title: "시멘틱 레이아웃",
    note: "div 대신 역할이 드러나는 이름표를 붙이는 것. 검색엔진·스크린리더가 구조를 이해합니다. main은 딱 하나!",
    code:
`<style>
  body{margin:0}
  header,nav,main,aside,footer{
    color:#fff;font-weight:700;text-align:center;
    padding:10px;margin:3px;border-radius:6px}
  header{background:#e8552f} nav{background:#0d9488}
  main{background:#6b7adb} aside{background:#8a7ad6}
  footer{background:#555}
</style>
<header>header · 머리말</header>
<nav>nav · 메뉴</nav>
<main>main · 본문 (딱 하나)</main>
<aside>aside · 보조</aside>
<footer>footer · 꼬리말</footer>`
  },
  uiElements: {
    title: "details · progress · meter",
    note: "자바스크립트 없이도 동작하는 기본 UI들. summary를 클릭해보세요.",
    code:
`<details>
  <summary>클릭해서 펼치기 (details)</summary>
  <p>JS 한 줄 없이 열리는 아코디언!</p>
</details>
<p>진행률: <progress value="70" max="100"></progress> 70%</p>
<p>용량: <meter value="0.8">80%</meter> 80%</p>`
  },

  /* ---- 04 폼 ---- */
  formLabel: {
    title: "label 글씨 클릭 = 입력칸 활성화",
    note: "label의 글씨를 클릭해보세요. 커서가 입력칸으로 들어갑니다 (for ↔ id 연결 덕분).",
    code:
`<p>
  <label for="nm">이름 (이 글씨를 클릭!)</label><br>
  <input id="nm" type="text" placeholder="여기에 포커스가 와요">
</p>
<p>이메일 입력칸(모바일서 @키보드): <input type="email"></p>
<p>날짜 선택기: <input type="date"></p>`
  },
  fieldset: {
    title: "fieldset + legend",
    note: "라디오·체크박스 묶음을 박스로 묶고 그룹 제목(legend)을 달아 '무엇을 고르는지' 알려줍니다.",
    code:
`<fieldset>
  <legend>좋아하는 색</legend>
  <label><input type="radio" name="c"> 빨강</label>
  <label><input type="radio" name="c"> 파랑</label>
  <label><input type="radio" name="c"> 초록</label>
</fieldset>`
  },

  /* ---- 05 선택자·우선순위 ---- */
  specificity: {
    title: "누가 이길까? (명시도)",
    note: "같은 글자에 색을 3번 지정했어요. 점수가 가장 높은 id(100점)가 이깁니다.",
    code:
`<style>
  p     { color: gray; }   /* 태그 = 1점 */
  .blue { color: blue; }   /* class = 10점 */
  #win  { color: red; }    /* id = 100점 → 승! */
</style>
<p id="win" class="blue">나는 무슨 색일까요? → 빨강</p>`
  },
  combinator: {
    title: "> (직계 자식) vs 공백 (모든 자손)",
    note: "'>'는 바로 아래 자식만, 공백은 더 깊은 자손까지 적용됩니다.",
    code:
`<style>
  /* parent의 '직계' child만 주황 */
  .parent > .child { color:#e8552f; font-weight:700 }
</style>
<div class="parent">
  <p class="child">직계 자식 → 주황 ✅</p>
  <div>
    <p class="child">손자 → 안 변함 ❌</p>
  </div>
</div>`
  },
  pseudo: {
    title: ":hover · :required",
    note: "마우스를 버튼에 올려보세요. 필수 입력칸은 빨간 테두리로 표시했어요.",
    code:
`<style>
  .btn{padding:9px 18px;background:#0d9488;color:#fff;
       border:none;border-radius:8px;transition:.25s;cursor:pointer}
  .btn:hover{background:#e8552f}          /* 마우스 올릴 때 */
  input:required{border:2px solid #e8552f;border-radius:6px;padding:6px}
</style>
<button class="btn">마우스 올려보세요</button>
<p><input required placeholder="필수 입력칸"></p>`
  },

  checked: {
    title: ":checked + :not() (JS 없는 토글)",
    note: "체크됐을 때만 적용되는 :checked로 스위치를 만들고, :not()으로 '~가 아닌' 것을 고릅니다.",
    code:
`<style>
  .sw{display:inline-flex;align-items:center;gap:10px;cursor:pointer}
  .sw input{display:none}
  .track{width:52px;height:28px;background:#ccc;border-radius:999px;
         position:relative;transition:.25s}
  .track::after{content:"";position:absolute;top:3px;left:3px;
         width:22px;height:22px;background:#fff;border-radius:50%;transition:.25s}
  .sw input:checked + .track{background:#0d9488}     /* 켜졌을 때 */
  .sw input:checked + .track::after{left:27px}
  li:not(.done){color:#e8552f}                       /* done이 '아닌' 항목 */
</style>
<label class="sw">
  <input type="checkbox"><span class="track"></span>
  <span>클릭해서 켜고 끄기</span>
</label>
<ul>
  <li class="done">완료된 일 (검정)</li>
  <li>아직 안 한 일 → :not(.done)로 주황</li>
</ul>`
  },

  /* ---- 06 텍스트 ---- */
  fontfamily: {
    title: "글꼴(font-family)과 웹폰트",
    note: "글꼴은 쉼표로 '폴백'을 나열해요. 원하는 글꼴이 없으면 다음 글꼴로 넘어갑니다. 웹폰트는 @font-face로 .woff2를 불러옵니다.",
    code:
`<style>
  p{margin:6px 0;font-size:18px}
  .sys  { font-family: system-ui, sans-serif } /* OS 기본 */
  .serif{ font-family: Georgia, serif }        /* 삐침 있음 */
  .mono { font-family: monospace }             /* 고정폭(코드용) */
</style>
<p class="sys">system-ui — 운영체제 기본 글꼴</p>
<p class="serif">Georgia / serif — 획에 삐침</p>
<p class="mono">monospace — 글자폭이 일정</p>`
  },
  letterspacing: {
    title: "letter-spacing (자간)",
    note: "한글은 자간을 살짝(-0.02em) 좁히면 더 단정해 보입니다.",
    code:
`<style>
  p{font-size:19px;margin:6px 0}
  .tight{letter-spacing:-0.02em}
  .wide{letter-spacing:0.15em}
</style>
<p>기본 자간 — 한국어 본문 예시입니다.</p>
<p class="tight">-0.02em — 살짝 좁혀 단정합니다.</p>
<p class="wide">0.15em — 넓혀서 강조 느낌.</p>`
  },
  lineheight: {
    title: "line-height (줄 간격)",
    note: "줄 간격이 좁으면 답답하고, 1.6 정도면 읽기 편해요. 한글 본문은 보통 1.5~1.8.",
    code:
`<style>
  p{background:#f3f4f6;margin:6px 0;padding:6px}
  .tight{line-height:1}
  .loose{line-height:1.8}
</style>
<p class="tight">line-height 1 — 줄이 붙어 답답합니다. 두 줄 이상이면 글자끼리 닿을 듯 좁아요.</p>
<p class="loose">line-height 1.8 — 줄 간격이 넉넉해 한결 읽기 편합니다.</p>`
  },
  wordbreak: {
    title: "word-break: keep-all",
    note: "기본값은 한글을 글자 단위로 어색하게 자릅니다. keep-all을 주면 단어 단위로 깔끔하게 끊겨요.",
    code:
`<style>
  div{width:150px;border:1px solid #bbb;padding:6px;margin:6px 0}
  .keep{word-break:keep-all}
</style>
<div>기본값: 한글이 단어 중간에서 잘려요 정말로요</div>
<div class="keep">keep-all: 단어 단위로 줄바꿈돼요 정말로요</div>`
  },
  ellipsis: {
    title: "말줄임표(…) 3종 세트",
    note: "nowrap(한 줄) + overflow:hidden(숨김) + text-overflow:ellipsis(…) 세 개가 모두 있어야 작동합니다.",
    code:
`<style>
  .cut{
    width:190px;
    white-space:nowrap;      /* 한 줄 고정 */
    overflow:hidden;         /* 넘침 숨김 */
    text-overflow:ellipsis;  /* … 표시 */
    border:1px solid #bbb;padding:6px}
</style>
<div class="cut">이 문장은 칸보다 길어서 끝이 점점점으로 잘립니다 진짜로요</div>`
  },

  /* ---- 07 배경·박스·position ---- */
  boxstyle: {
    title: "둥근 모서리 · 그림자 · 원",
    note: "border-radius로 모서리를 둥글게(50%면 완전한 원), box-shadow로 입체감을 줍니다.",
    code:
`<style>
  .row{display:flex;gap:16px;align-items:center}
  .card{width:90px;height:60px;background:#6b7adb;border-radius:12px;
        box-shadow:0 6px 16px rgba(0,0,0,.25)}
  .circle{width:70px;height:70px;background:#e8552f;border-radius:50%}
</style>
<div class="row">
  <div class="card"></div>
  <div class="circle"></div>
</div>`
  },
  bgoverlay: {
    title: "배경 이미지 + 그라데이션 오버레이",
    note: "밝은 사진 위에 반투명 검은 막(linear-gradient)을 겹치면 흰 글씨가 또렷해져요. background-size:cover로 빈틈없이 채웁니다.",
    code:
`<style>
  .hero{
    height:140px;border-radius:12px;padding:12px;
    display:grid;place-items:center;text-align:center;
    color:#fff;font-weight:800;font-size:19px;
    background:
      /* ① 위에 깔리는 어두운 막 */
      linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.2)),
      /* ② 실제로는 여기에 url('photo.jpg') */
      linear-gradient(135deg,#f6d365,#fda085);
    background-size: cover;   /* 빈틈없이 꽉 채움 */
  }
</style>
<div class="hero">사진 위 어두운 막 덕분에<br>글씨가 잘 보입니다</div>`
  },
  position: {
    title: "position — '품절' 배지",
    note: "부모에 relative, 자식에 absolute를 주면 카드 안에서 자유롭게 배치돼요(예: 우상단 배지).",
    code:
`<style>
  .card{position:relative;width:150px;height:100px;
        background:#0d9488;border-radius:12px}
  .badge{position:absolute;top:8px;right:8px;
         background:#e8552f;color:#fff;
         padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700}
</style>
<div class="card">
  <span class="badge">품절</span>
</div>`
  },
  sticky: {
    title: "sticky — 따라오는 헤더",
    note: "아래 박스 안을 스크롤해보세요. 헤더가 위에 '딱' 붙어 따라옵니다.",
    code:
`<style>
  .scroll{height:130px;overflow:auto;border:1px solid #bbb;border-radius:8px}
  .head{position:sticky;top:0;background:#0d9488;color:#fff;
        padding:8px;font-weight:700}
  .line{padding:10px;border-bottom:1px solid #eee}
</style>
<div class="scroll">
  <div class="head">↓ 스크롤해도 붙어있어요 (sticky)</div>
  <div class="line">내용 1</div><div class="line">내용 2</div>
  <div class="line">내용 3</div><div class="line">내용 4</div>
  <div class="line">내용 5</div><div class="line">내용 6</div>
</div>`
  },

  /* ---- 08 display·Flex·Grid ---- */
  displaynone: {
    title: "display 종류 + none vs visibility",
    note: "block=한 줄 차지, inline=내용만큼. display:none은 공간까지 사라지고, visibility:hidden은 안 보여도 자리는 남아요.",
    code:
`<style>
  .box{background:#0d9488;color:#fff;padding:8px;margin:4px;border-radius:6px}
  .gone{display:none}            /* 공간까지 제거 */
  .invisible{visibility:hidden}  /* 안 보여도 자리 유지 */
</style>
<div class="box">1) 보통 박스 (block)</div>
<div class="box gone">2) display:none</div>
<div class="box">3) ↑ 2번이 통째로 사라져 바로 붙었어요</div>
<div class="box invisible">4) visibility:hidden</div>
<div class="box">5) ↑ 4번은 안 보여도 빈 자리가 남아요</div>`
  },
  /* ---- 08 Flex·Grid ---- */
  flex: {
    title: "Flexbox (1차원 정렬)",
    note: "justify-content는 가로, align-items는 세로 정렬. space-between은 양끝으로 쫙 벌려줍니다.",
    code:
`<style>
  .flex{display:flex;justify-content:space-between;align-items:center;
        height:80px;background:#f3f4f6;padding:10px;border-radius:8px}
  .flex span{background:#0d9488;color:#fff;padding:10px 16px;border-radius:8px}
</style>
<div class="flex">
  <span>왼쪽</span><span>가운데</span><span>오른쪽</span>
</div>`
  },
  grid: {
    title: "Grid (2차원, 이름표 배치)",
    note: "grid-template-areas로 칸에 이름을 붙이면 페이지 뼈대가 코드만 봐도 그려집니다.",
    code:
`<style>
  .grid{display:grid;gap:4px;grid-template-columns:2fr 1fr;
    grid-template-areas:
      'header header'
      'main   aside'
      'footer footer'}
  .grid span{color:#fff;text-align:center;padding:14px 0;border-radius:6px;font-weight:700}
  .h{grid-area:header;background:#e8552f}
  .m{grid-area:main;background:#0d9488}
  .a{grid-area:aside;background:#6b7adb}
  .f{grid-area:footer;background:#8a7ad6}
</style>
<div class="grid">
  <span class="h">header</span>
  <span class="m">main</span>
  <span class="a">aside</span>
  <span class="f">footer</span>
</div>`
  },

  /* ---- 09 애니메이션·다단 ---- */
  transition: {
    title: "transition + transform (hover)",
    note: "마우스를 올리면 부드럽게 커지고 회전해요. transition이 '천천히' 변하게 만듭니다.",
    code:
`<style>
  .box{width:100px;height:100px;background:#0d9488;border-radius:14px;
       color:#fff;display:grid;place-items:center;font-weight:700;
       transition:transform .3s, background .3s}
  .box:hover{transform:scale(1.2) rotate(8deg);background:#e8552f}
</style>
<div class="box">올려봐</div>`
  },
  flip: {
    title: "카드 뒤집기 (backface-visibility)",
    note: "마우스를 올리면 뒤집혀요. backface-visibility:hidden이 '뒷모습'을 가려, 반대 면이 비쳐 보이지 않게 합니다.",
    code:
`<style>
  .scene{width:170px;height:104px;perspective:600px}
  .card{width:100%;height:100%;position:relative;cursor:pointer;
        transition:transform .6s;transform-style:preserve-3d}
  .scene:hover .card{transform:rotateY(180deg)}
  .face{position:absolute;inset:0;border-radius:12px;
        display:grid;place-items:center;color:#fff;font-weight:700;
        backface-visibility:hidden}     /* 뒷면 가리기 */
  .front{background:#0d9488}
  .back{background:#e8552f;transform:rotateY(180deg)}
</style>
<div class="scene">
  <div class="card">
    <div class="face front">앞면 · 올려보세요</div>
    <div class="face back">뒷면!</div>
  </div>
</div>`
  },
  keyframes: {
    title: "@keyframes (무한 애니메이션)",
    note: "0%→100% 변화를 정의하고 infinite로 무한 반복. 흔한 로딩 스피너입니다.",
    code:
`<style>
  @keyframes spin{ to{ transform:rotate(360deg) } }
  .loader{width:54px;height:54px;border:6px solid #e3e7ec;
          border-top-color:#e8552f;border-radius:50%;
          animation:spin 1s linear infinite}
</style>
<div class="loader"></div>`
  },
  multicol: {
    title: "다단 + break-inside",
    note: "신문처럼 여러 단으로. 카드가 단 경계에서 잘리지 않게 break-inside:avoid를 줍니다.",
    code:
`<style>
  .cols{column-count:2;column-gap:14px}
  .cols p{break-inside:avoid;background:#f3f4f6;
          padding:8px;margin:0 0 8px;border-radius:6px}
</style>
<div class="cols">
  <p>카드 A — break-inside:avoid 덕분에 단 경계에서 안 잘려요.</p>
  <p>카드 B — 신문처럼 2단으로 나뉩니다.</p>
  <p>카드 C — 긴 글의 가독성을 높입니다.</p>
  <p>카드 D — 단 수는 column-count로 조절해요.</p>
</div>`
  }
};

/* 코드 놀이터 프리셋 */
const PRESETS = {
  button:
`<style>
  .btn{
    padding:12px 24px;
    background:#0d9488;
    color:#fff;
    border:none;
    border-radius:10px;
    font-size:16px;
    cursor:pointer;
    transition:.2s;
  }
  .btn:hover{ background:#e8552f; transform:translateY(-2px); }
</style>
<button class="btn">눌러보고 싶은 버튼</button>`,
  card:
`<style>
  .card{
    width:200px;
    border:1px solid #e3e7ec;
    border-radius:14px;
    box-shadow:0 8px 24px rgba(0,0,0,.08);
    overflow:hidden;
    font-family:sans-serif;
  }
  .card .top{height:90px;background:linear-gradient(135deg,#0d9488,#6b7adb)}
  .card .body{padding:14px}
  .card h3{margin:0 0 6px}
  .card p{margin:0;color:#5a6672;font-size:14px}
</style>
<div class="card">
  <div class="top"></div>
  <div class="body">
    <h3>카드 제목</h3>
    <p>설명 텍스트가 들어가는 카드입니다.</p>
  </div>
</div>`,
  center:
`<style>
  .wrap{
    display:flex;
    justify-content:center;  /* 가로 가운데 */
    align-items:center;      /* 세로 가운데 */
    height:160px;
    background:#f3f4f6;
    border-radius:12px;
  }
  .ball{width:70px;height:70px;background:#e8552f;border-radius:50%}
</style>
<div class="wrap">
  <div class="ball"></div>
</div>`,
  gradient:
`<style>
  .hero{
    height:160px;
    border-radius:14px;
    background:linear-gradient(135deg,#e8552f,#8a7ad6);
    display:grid;
    place-items:center;
    color:#fff;
    font-size:22px;
    font-weight:800;
  }
</style>
<div class="hero">그라데이션 배경 🎨</div>`
};
