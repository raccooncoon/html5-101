/* 퀴즈 문항 데이터 — answer는 정답 보기의 인덱스(0부터) */
const QUIZ = [
  {
    q: "한 HTML 페이지에서 <h1>은 몇 개까지 쓰는 것이 표준인가?",
    options: ["제한 없음", "1개", "최대 6개", "각 section마다 1개씩 자유롭게"],
    answer: 1,
    explain: "h1은 페이지당 1개. 헤딩 숫자도 건너뛰지 않고 순차적으로 써야 SEO·스크린 리더에 유리합니다."
  },
  {
    q: "<main> 요소에 대한 설명으로 옳은 것은?",
    options: ["문서에 여러 개 둘 수 있다", "문서에 단 하나만 존재해야 한다", "header 안에 위치해야 한다", "레이아웃 전용 태그다"],
    answer: 1,
    explain: "main은 페이지 본문으로 문서에 단 하나만 존재해야 합니다."
  },
  {
    q: "target=\"_blank\"로 새 창을 열 때 보안상 함께 써야 하는 속성은?",
    options: ["rel=\"nofollow\"", "rel=\"noopener noreferrer\"", "download", "referrerpolicy=\"origin\""],
    answer: 1,
    explain: "rel=\"noopener noreferrer\"를 함께 써서 새 창이 원본 window 객체에 접근하는 보안 위험을 막습니다."
  },
  {
    q: "장식용(의미 없는) 이미지의 alt 속성은 어떻게 처리하는가?",
    options: ["생략한다", "alt=\"이미지\"라고 쓴다", "alt=\"\" 로 비운다", "title로 대체한다"],
    answer: 2,
    explain: "장식용 이미지는 alt=\"\"로 비워 스크린 리더가 무시하도록 합니다. alt 자체를 생략하면 안 됩니다."
  },
  {
    q: "CSS 명시도(우선순위)가 높은 순서로 올바른 것은?",
    options: [
      "태그 > .class > #id > 인라인",
      "인라인 > #id > .class > 태그",
      ".class > #id > 인라인 > 태그",
      "#id > 인라인 > 태그 > .class"
    ],
    answer: 1,
    explain: "!important > 인라인(1000) > #id(100) > .class·가상클래스(10) > 태그(1) > *(0) 순서입니다."
  },
  {
    q: "label과 입력 요소를 명시적으로 연결하는 방법은?",
    options: ["class를 동일하게", "label의 for와 input의 id를 일치", "name 속성 일치", "둘을 인접 배치만 하면 됨"],
    answer: 1,
    explain: "label의 for 값과 input의 id를 일치시켜야 글씨 클릭 시 입력창이 활성화되고 스크린 리더가 연결을 인식합니다."
  },
  {
    q: "line-height 값을 지정하는 권장 방식은?",
    options: ["px 단위로", "% 단위로", "단위 없는 숫자(예: 1.5)", "em 단위 필수"],
    answer: 2,
    explain: "단위 없는 숫자를 쓰면 상속 시 폰트 크기에 비례해 계산되어 상속 꼬임을 방지합니다."
  },
  {
    q: "한 줄 말줄임표(…)를 만드는 CSS 3종 세트가 아닌 것은?",
    options: ["white-space: nowrap", "overflow: hidden", "text-overflow: ellipsis", "word-break: keep-all"],
    answer: 3,
    explain: "말줄임표는 nowrap + overflow:hidden + text-overflow:ellipsis 조합. keep-all은 한글 줄바꿈 방지용입니다."
  },
  {
    q: "Flexbox와 Grid의 가장 큰 차이는?",
    options: ["Flex=2차원, Grid=1차원", "Flex=1차원, Grid=2차원", "둘 다 1차원", "둘 다 동일하다"],
    answer: 1,
    explain: "Flex는 1차원(한 방향) 배치, Grid는 2차원(행+열) 배치에 적합합니다."
  },
  {
    q: "position: absolute는 무엇을 기준으로 배치되는가?",
    options: ["항상 화면(viewport)", "가장 가까운 position이 지정된 조상(보통 relative)", "직계 부모만", "body만"],
    answer: 1,
    explain: "absolute는 가장 가까운 positioned 조상(주로 relative) 기준으로 배치됩니다. 그래서 부모에 relative를 줍니다."
  },
  {
    q: "표의 제목 셀 <th> 접근성을 위해 명시하는 속성은?",
    options: ["align", "scope=\"col\" 또는 \"row\"", "role=\"header\"", "headers-only"],
    answer: 1,
    explain: "th에 scope=\"col\"/\"row\"를 지정해 헤더가 열/행 중 무엇을 설명하는지 스크린 리더에 알립니다."
  },
  {
    q: "다단(multi-column) 레이아웃에서 카드가 단 경계에서 잘리는 것을 막는 속성은?",
    options: ["overflow: hidden", "break-inside: avoid", "page-break: always", "column-fill: balance"],
    answer: 1,
    explain: "자식 요소에 break-inside: avoid;를 주면 단 경계에서 분리되지 않습니다."
  },
  {
    q: "주소창에 URL을 입력했을 때, 그 주소가 어느 서버인지 찾아주는 단계는?",
    options: ["렌더링", "DNS 조회", "파싱", "캐싱"],
    answer: 1,
    explain: "URL → DNS 조회(주소 찾기) → 서버 요청 → HTML/CSS/JS 응답 → 브라우저 파싱·렌더링 순서로 동작합니다."
  },
  {
    q: "요소를 화면에서 숨기면서 '차지하던 공간까지' 없애려면?",
    options: ["visibility: hidden", "opacity: 0", "display: none", "overflow: hidden"],
    answer: 2,
    explain: "display:none은 공간까지 완전히 제거합니다. visibility:hidden/opacity:0은 안 보여도 자리는 그대로 남습니다."
  },
  {
    q: "웹폰트를 불러올 때 용량·성능을 위해 권장되는 형식과 규칙은?",
    options: ["@import 로 .ttf", "@font-face 로 .woff2", "<font> 태그", "src 로 .psd"],
    answer: 1,
    explain: "@font-face 규칙으로 글꼴을 등록하며, 압축률이 좋은 .woff2 형식을 권장합니다."
  },
  {
    q: "카드 뒤집기(3D rotateY) 애니메이션에서 반대 면이 비쳐 보이지 않게 하는 속성은?",
    options: ["overflow: hidden", "backface-visibility: hidden", "opacity: 0", "z-index: -1"],
    answer: 1,
    explain: "backface-visibility: hidden은 회전된 면의 뒷모습을 가려, 뒤집을 때 반대 면이 비치지 않게 합니다."
  }
];
