# 멀티 과목 학습 허브 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (inline) — 사용자가 "시작해줘"로 인라인 실행을 지시함. 추출 단계만 병렬 서브에이전트 사용.

**Goal:** html5-101을 3과목(HTML/CSS·컴퓨터의이해·파이썬) 학습 허브로 확장하고 Phase별 배포한다.

**Architecture:** 빌드 없는 정적 사이트 유지. 공용 자산(assets/)으로 디자인 토큰·퀴즈 엔진·공통 인터랙션을 분리하고, 과목별 디렉터리가 이를 소비한다. 콘텐츠는 PDF → 병렬 에이전트 구조화 노트(.extraction/, gitignore) → 본문 직접 작성 파이프라인.

**Tech Stack:** HTML/CSS/JS(현행), Pyodide v0.26 CDN(파이썬 실행), poppler(pdftotext/pdftoppm, 설치됨), GitHub Actions Pages 배포(현행 유지).

---

## 최종 파일 구조

```
html5-101/
├─ index.html                  # 신규: 허브
├─ assets/
│  ├─ base.css                 # 신규: 토큰+공용 컴포넌트(헤더·카드·퀴즈·콜아웃·표·반응형)
│  ├─ common.js                # 신규: 테마·진행률·목차강조·맨위로 (initPage())
│  └─ quiz-engine.js           # 신규: initQuiz({mount, questions, storageKey?})
├─ html-css/                   # 기존 5개 파일 이동(git mv), script.js만 공용 모듈 사용으로 수정
│  ├─ index.html  styles.css  demos.js  quiz-data.js  script.js
├─ computer/
│  ├─ index.html  computer.css  tools.js  quiz-data.js
├─ python/
│  ├─ index.html  python.css  runner.js  quiz-data.js
├─ .extraction/                # gitignore — 에이전트 구조화 노트(원문 비공개)
└─ .github/workflows/deploy.yml  # 무변경
```

## Stage 0: 병렬 추출 (백그라운드 에이전트 8개, Phase 1과 동시 진행)

모든 에이전트 공통 지침: Read 도구로 PDF 직접 읽기 금지(렌더러 미연결). 반드시
`/opt/homebrew/bin/pdftotext -layout`(텍스트) / `/opt/homebrew/bin/pdftoppm -png -r <dpi>`(이미지) → PNG를 Read.
산출물은 `/Users/raccoon/Claude_work/html5-101/.extraction/<이름>.md` (Write).

| # | 에이전트 | 입력 | 출력 | 방법 |
|---|---|---|---|---|
| C1 | computer-01-05 | 컴퓨터의이해_01~05.pdf | computer-01-05.md | pdftotext 우선, 모호하면 페이지 렌더 |
| C2 | computer-06-10 | _06~10 | computer-06-10.md | 〃 |
| C3 | computer-11-15 | _11~15 | computer-11-15.md | 〃 |
| C4 | computer-exams | 기출 17/18/19-1 | computer-exams.md | 150dpi 전체 시각 판독, 105문항 전사+주제태깅+정답추정(신뢰도) |
| P1 | python-01-05 | 파이썬_01~05.pdf | python-01-05.md | 100dpi 전 페이지 시각 판독(텍스트 빈약) |
| P2 | python-06-10 | _06~10 | python-06-10.md | 〃 + 코드 예제 정확 전사 |
| P3 | python-11-15 | _11~15 | python-11-15.md | 〃 |
| P4 | python-checkpoint | 강의체크포인트.pdf | python-checkpoint.md | 100dpi 46p 판독, 문항 전사+강 매핑+정답추정 |

노트 형식(강별): `## N강 <제목>` / 핵심 개념(정의·분류·예시·수치) / 용어집 / 코드 예제(파이썬만) / 시험 포인트.

## Phase 1: 허브 개편 (인라인)

### Task 1.1 기존 페이지 이동
- [ ] `mkdir html-css && git mv index.html styles.css demos.js quiz-data.js script.js html-css/`
- [ ] `.gitignore`에 `.extraction/` 추가
- [ ] 커밋 `refactor: 기존 HTML/CSS 페이지를 /html-css/로 이동`

### Task 1.2 공용 자산 분리
- [ ] `assets/common.js`: html-css/script.js에서 테마토글·진행률·TOC강조·맨위로 추출.
      API: `initPage()` — `#themeToggle #progressBar #toTop .toc-link` 존재 시에만 각 기능 활성(요소 없으면 건너뜀).
- [ ] `assets/quiz-engine.js`: 퀴즈 렌더/채점/리셋 추출.
      API: `initQuiz({form, gradeBtn, resetBtn, result, questions})` — 현행 q-item/correct/wrong/해설 마크업·클래스 동일 유지.
- [ ] `html-css/index.html`에 `../assets/common.js`,`../assets/quiz-engine.js` 스크립트 추가, `html-css/script.js`에서 중복 로직 제거 후 호출로 대체(데모·놀이터 로직은 잔존).
- [ ] 프리뷰 검증: /html-css/ 테마·진행률·TOC·퀴즈(채점/리셋)·데모29·놀이터 전부 동작, 콘솔 0
- [ ] 커밋 `refactor: 공용 quiz-engine/common 분리`

### Task 1.3 허브 페이지
- [ ] `assets/base.css`: 기존 styles.css에서 토큰(:root/[data-theme])+헤더+버튼+카드+푸터+퀴즈+콜아웃+표+반응형 공용화. 과목 액센트: `--accent` 기본 주황, computer=`#0d9488`, python=`#3b82f6` (서브 CSS에서 오버라이드)
- [ ] 루트 `index.html` 허브: 브랜드 "학습 노트 101", 과목 카드 3개(HTML/CSS=활성, 나머지 "준비 중" 배지+비활성), 테마 토글(`assets/common.js`)
- [ ] 프리뷰 검증: 허브 렌더·카드 링크·테마, 콘솔 0
- [ ] 커밋 `feat: 멀티 과목 허브 루트 페이지`

### Task 1.4 배포
- [ ] README 갱신(허브 구조) → 커밋 → `git push origin main`
- [ ] Actions success + 라이브: `curl https://raccooncoon.github.io/html5-101/` 허브 확인, `/html-css/` 정상

## Phase 2: 컴퓨터의이해 (.extraction/computer-*.md 도착 후)

### Task 2.1 본문
- [ ] `computer/index.html`: 5파트(①1~3 ②4~5 ③6~7 ④8~12 ⑤13~15) 15강 전체, lead-easy 톤, 표/카드/플로우, base.css+computer.css
### Task 2.2 도구 (`computer/tools.js`)
- [ ] 진법 변환기: 10↔2/8/16 상호 변환+나눗셈 과정 표시. API `initBaseConverter('#tool-base')`
- [ ] 논리 게이트: AND/OR/NOT/XOR 입력 토글→출력. API `initGateSim('#tool-gate')`
- [ ] (여유) 2의 보수 계산기
### Task 2.3 기출 분석 + 퀴즈
- [ ] computer-exams.md 105문항 → 주제별 빈출 집계표(섹션) + **변형** 문항 30+ → `computer/quiz-data.js`
### Task 2.4 검증·배포
- [ ] 프리뷰: 도구 입출력 정확성(샘플: 13→1101₂, 0b1010 XOR 0b0110), 퀴즈 채점, 콘솔 0 → 허브 카드 활성화 → push → 라이브 확인

## Phase 3: 파이썬 (.extraction/python-*.md 도착 후)

### Task 3.1 본문
- [ ] `python/index.html`: 15강(기초1→문법2~12→프로젝트13~15), 예제 25+ 코드블록
### Task 3.2 실행기 (`python/runner.js`)
- [ ] Pyodide 지연 로드(jsDelivr v0.26.x, 첫 ▶클릭 시), 각 `.runnable` 블록에 ▶실행/출력영역, stdout/에러 캡처, 자유 입력 놀이터 1개
- [ ] API: `initRunners()` — `<div class="py-run" data-code>` 변환
### Task 3.3 퀴즈
- [ ] python-checkpoint.md 46문항 기반 재구성+보강 30+ → `python/quiz-data.js`
### Task 3.4 검증·배포
- [ ] 프리뷰: 실행기(print/입력오류/반복문 출력), 놀이터, 퀴즈, 콘솔 0 → 허브 카드 활성화 → push → 라이브 + DoD 전체 체크

## 검증 명령 (각 Phase 공통)
- 프리뷰: `preview_start(html5-101)` → preview_console_logs(all)=0건 → 기능별 preview_click/eval → 스크린샷
- 라이브: Actions `conclusion=success` && `curl -s <url> | grep <신규 마커>`

## DoD (스펙 §9 동일)
허브 3과목 진입·콘솔0 / 컴이해 15강+도구2+퀴즈30+ / 파이썬 15강+예제25+(실행가능)+퀴즈30+ / html-css 무손상 / 모바일 / Actions success
