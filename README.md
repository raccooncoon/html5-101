# 학습 노트 101 — 쉽게 배우는 학습 허브

강의록을 쉬운 말로 풀어 쓰고, 개념마다 바로 확인하는 예시·체험 도구·시험 정리·퀴즈를 제공하는 학습 사이트입니다.

🔗 **배포 주소**: https://raccooncoon.github.io/html5-101/

## 과목

| 과목 | 경로 | 구성 | 상태 |
|---|---|---|---|
| HTML5 & CSS | [/html-css/](https://raccooncoon.github.io/html5-101/html-css/) | 9강 · 라이브 데모 29 · 코드 놀이터 · 퀴즈 16문항 | ✅ |
| 컴퓨터의 이해 | /computer/ | 15강 · 진법 변환기 · 논리 게이트 · 기출 변형 퀴즈 | 🚧 준비 중 |
| 파이썬 프로그래밍 기초 | /python/ | 15강 · 브라우저 실행기(Pyodide) · 파이썬 놀이터 · 퀴즈 | 🚧 준비 중 |

## 특징

- **쉬운 설명**: 어려운 용어를 비유와 함께 풀어 씁니다.
- **바로 확인하는 예시**: HTML/CSS는 코드+실제 렌더링 결과를 나란히, 파이썬은 브라우저에서 코드 실행, 컴퓨터의이해는 체험형 도구.
- **시험 정리 + 퀴즈**: 과목마다 핵심 정리표와 즉시 채점 퀴즈(오답 해설 포함).
- 의존성 없는 순수 HTML/CSS/JS — 빌드 불필요.

## 구조

```
├─ index.html              # 허브
├─ assets/
│  ├─ base.css             # 공용 디자인 시스템(토큰+컴포넌트)
│  ├─ common.js            # 테마·진행률·목차 강조 (initPage)
│  └─ quiz-engine.js       # 공용 퀴즈 엔진 (initQuiz)
├─ html-css/               # HTML5 & CSS 과목
├─ computer/               # 컴퓨터의 이해 과목 (준비 중)
├─ python/                 # 파이썬 기초 과목 (준비 중)
└─ .github/workflows/deploy.yml  # GitHub Pages 자동 배포
```

## 로컬에서 보기

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## 배포

`main` 브랜치에 푸시하면 GitHub Actions가 자동으로 GitHub Pages에 배포합니다.
