# Code Skeleton — Chunk 로드맵

---

## Chunk 0: 사람이 직접 할 것 ⚠️

> Claude Code가 아니라 **사람**이 직접 합니다.

- [ ] GitHub 저장소 생성 (빈 저장소, README 없이)
- [ ] CLAUDE.md의 `여기에_GitHub_저장소_URL_입력` 부분에 실제 URL 채워넣기
- [ ] 프로젝트 폴더에 문서 파일 배치:
  ```
  code-skeleton/
  ├── CLAUDE.md          ← 루트
  └── prd/
      ├── PRD.md
      ├── chunk_roadmap.md
      ├── HANDOFF.md
      └── run-chunks.bat
  ```
- [ ] 완료 확인 후 Chunk 1 진행

---

## Chunk 1: 프로젝트 초기 세팅

**목표:** Next.js 15 프로젝트 생성 + 기본 구조 + 필수 패키지 설치

**선행조건:** Chunk 0 완료 (저장소, 문서 배치)

**상세 작업:**
- [x] package.json 있으면 프로젝트 생성 스킵, 없으면 Next.js 15 프로젝트 생성 (TypeScript, Tailwind, App Router)
- [x] 필수 패키지 설치:
  - `prismjs` — 신택스 하이라이팅
  - `@types/prismjs` — Prism 타입
  - `prism-themes` — 다크/라이트 테마
- [x] 폴더 구조 생성:
  - `components/` — 컴포넌트 폴더
  - `lib/` — 유틸리티 폴더
- [x] `lib/constants.ts` 생성:
  - MAX_FILE_SIZE = 500 * 1024 (500KB)
  - MAX_LINE_COUNT = 10000
  - ALLOWED_EXTENSIONS = ['.tsx', '.jsx']
  - DIMMING_OPACITY_DARK = 0.25
  - DIMMING_OPACITY_LIGHT = 0.3
- [x] `app/globals.css`에 기본 스타일 설정:
  - Tailwind 기본
  - 코드 폰트 (Fira Code, JetBrains Mono fallback)
  - dimming 클래스 (.line-dimmed)
  - Prism 테마 커스텀 (다크/라이트)
- [x] `app/layout.tsx` 다크모드 기본 구조:
  - html에 class="dark" 토글 방식
  - 시스템 설정 감지 초기값
- [x] `app/page.tsx` 기본 껍데기 (빈 상태 UI placeholder)

**완료조건:**
- [x] `npm run dev` 실행 시 에러 없이 localhost:3000 접속 가능
- [x] 빈 페이지에 "Code Skeleton" 텍스트 + 다크모드 배경 확인
- [x] constants.ts에 상수값 정의 확인

---

## Chunk 2: 파일 업로드 + 파싱 엔진

**목표:** 파일 드래그앤드롭 업로드 + 정규식 기반 코드 파싱 + 뼈대 추출

**선행조건:** Chunk 1의 프로젝트 구조, constants.ts, globals.css

**상세 작업:**
- [x] `components/FileUploader.tsx` 생성:
  - 드래그앤드롭 영역 (점선 테두리, 아이콘, 안내 텍스트)
  - 파일 선택 버튼
  - 드래그 오버 시 시각적 피드백 (테두리 색 변경)
  - 확장자 검증 (.tsx, .jsx)
  - 파일 크기 검증 (500KB)
  - 라인 수 검증 (10,000줄)
  - 빈 파일 검증
  - 여러 파일 드롭 시 첫 번째만 처리 + 안내
- [x] `components/Toast.tsx` 생성:
  - 우측 상단 토스트 메시지
  - 에러(빨강), 안내(노랑) 구분
  - 3초 후 자동 사라짐 (fadeout 애니메이션)
- [x] `lib/parser.ts` 생성:
  - parseTSXFile(code: string) → ParseResult
  - 정규식 패턴으로 추출:
    - 컴포넌트 선언부 (function/const + PascalCase)
    - useState 호출 (변수명, 초기값)
    - useEffect (의존성 배열, 첫 줄)
    - useMemo, useCallback (변수명, 의존성)
    - 커스텀 Hook 호출부
    - 함수 시그니처 (이름, 파라미터)
    - return JSX 구조 (depth 1)
  - 각 추출 항목에 원본 라인 번호 매핑
- [x] `lib/extractor.ts` 생성:
  - extractSkeleton(parseResult) → SkeletonResult
  - 카테고리별 조립: State → Effects → 함수 → 렌더링 구조
  - 카테고리 구분 주석 삽입
  - 뼈대 코드 문자열 생성
- [x] `lib/differ.ts` 생성:
  - calculateDimming(code, parseResult) → Set<number>
  - 원본 코드의 각 줄이 뼈대에 포함되는지 여부 (줄 번호 Set)
  - 뼈대에 포함된 줄 번호 → 밝게, 나머지 → dimming

**완료조건:**
- [x] 파일 드래그앤드롭 동작 확인
- [x] 잘못된 파일 업로드 시 토스트 에러 메시지 표시
- [x] 유효한 TSX 파일 업로드 시 console.log로 파싱 결과 출력 (임시)
- [x] 뼈대 추출 결과 + dimming 줄 번호 Set 확인

---

## Chunk 3: 좌우 비교 뷰 + 신택스 하이라이팅

**목표:** 원본/뼈대 좌우 분할 뷰 + Prism.js 신택스 하이라이팅 + dimming 적용

**선행조건:** Chunk 2의 FileUploader, parser, extractor, differ 완성

**상세 작업:**
- [x] `components/CodeViewer.tsx` 생성:
  - Prism.js로 TSX/JSX 신택스 하이라이팅
  - 라인 넘버 표시 옵션 (왼쪽 패널용)
  - 줄 단위 dimming 클래스 적용 (dimmingLines Set 받아서)
  - 모노스페이스 폰트 적용
  - 코드 영역 스크롤 가능 (overflow-auto)
- [x] `components/SplitView.tsx` 생성:
  - 50:50 좌우 분할 레이아웃
  - 왼쪽: 원본 CodeViewer (라인 넘버 O, dimming O)
  - 오른쪽: 뼈대 CodeViewer (라인 넘버 X, dimming X)
  - 패널 헤더: "원본 소스" / "🦴 뼈대"
- [x] `app/page.tsx` 통합:
  - 파일 미업로드: FileUploader 표시
  - 파일 업로드 후: SplitView 표시
  - 헤더에 파일명 + "다른 파일" 버튼
  - "다른 파일" 클릭 시 초기화 → FileUploader로 복귀

**완료조건:**
- [x] 파일 업로드 → 좌우 비교 뷰 표시
- [x] 왼쪽 패널: 원본 코드 + 라인 넘버 + dimming 적용
- [x] 오른쪽 패널: 뼈대 코드 + 신택스 하이라이팅
- [x] "다른 파일" 버튼으로 초기 화면 복귀

---

## Chunk 4: 스크롤 동기화 + 통계 바 + 다크모드

**목표:** 스크롤 동기화, 통계 요약 바, 다크모드 토글 완성

**선행조건:** Chunk 3의 SplitView, CodeViewer 완성

**상세 작업:**
- [x] `components/SplitView.tsx` 스크롤 동기화 추가:
  - 비율 기반 동기화 (왼쪽 30% → 오른쪽 30%)
  - 무한 루프 방지 (isSyncing 플래그)
  - 양방향: 왼쪽→오른쪽, 오른쪽→왼쪽
- [x] `components/StatsBar.tsx` 생성:
  - 원본 라인 수 → 뼈대 라인 수 (압축률 %)
  - State 개수, Effect 개수, 함수 개수
  - 한 줄 바 형태, 비교 뷰 상단에 배치
- [x] `components/ThemeToggle.tsx` 생성:
  - 🌙/☀️ 토글 버튼
  - 시스템 설정 감지 (초기값)
  - localStorage에 선택값 저장
  - html class="dark" 토글
  - Prism 테마 동적 전환 (다크/라이트)
- [x] `app/page.tsx` 헤더 업데이트:
  - 로고 + 파일명 + "다른 파일" + ThemeToggle 배치
  - StatsBar 통합

**완료조건:**
- [x] 좌우 스크롤이 동기화되는지 확인 (양방향)
- [x] 통계 바에 정확한 수치 표시
- [x] 다크/라이트 토글 동작 + Prism 테마 전환
- [x] 새로고침 후 테마 유지 (localStorage)

---

## Chunk 5: 마무리

**목표:** 에러 UI 완성, 반응형 안내, 전체 점검, README

**선행조건:** Chunk 1~4 전체 완성

**상세 작업:**
- [x] 1024px 미만 반응형 안내:
  - "PC 환경에서 사용해주세요" 전체 화면 메시지
  - 비교 뷰 숨기고 안내만 표시
- [x] 파싱 안내 문구 추가:
  - 뼈대 패널 하단 또는 StatsBar에 "정규식 기반 분석으로, 복잡한 패턴은 정확하지 않을 수 있습니다" 표시
- [x] 에러 시나리오 전체 점검:
  - 지원하지 않는 확장자
  - 파일 크기/라인 수 초과
  - 빈 파일
  - 파싱 실패 (뼈대 0줄)
  - 여러 파일 동시 드롭
- [x] README.md 생성:
  - 프로젝트 소개
  - 실행 방법 (npm install → npm run dev)
  - 사용법 (파일 업로드 → 비교)
  - 기술 스택
  - 추출 규칙 요약
- [x] 전체 UI 점검:
  - 다크/라이트 모드 전환 깨짐 없는지
  - 코드 하이라이팅 정상 동작
  - 스크롤 동기화 매끄러운지

**완료조건:**
- [x] 모든 에러 시나리오 토스트 메시지 정상 표시
- [x] 1024px 미만에서 안내 메시지 표시
- [x] README.md 존재 + 내용 적절
- [x] 전체 플로우 정상 동작 (업로드 → 분석 → 비교 → 다른 파일)
