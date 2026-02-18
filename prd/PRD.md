# Code Skeleton — PRD (상세 기획서)

## 프로젝트 개요

- **한 줄 요약**: TSX/JSX 파일을 업로드하면 뼈대만 추출해서 원본과 나란히 비교해주는 웹앱
- **문제 정의**: 1500줄짜리 코드를 처음 보면 "이 컴포넌트가 뭘 하려는 건지" 파악이 어려움. import, 스타일, 에러 처리, 조건 분기 등 부수적 코드가 핵심 구조를 가림
- **해결 방법**: 코드에서 뼈대(컴포넌트 선언, state, 핵심 로직, JSX 구조)만 추출하고, 원본에서 뼈대 외 부분을 dimming 처리하여 좌우 비교
- **대상 사용자**: 남의 코드를 분석해야 하는 개발자, 코드 리뷰어, 코드 학습자
- **참고 소스**: nextlens 프로젝트 소스를 1번 테스트 파일로 활용

---

## 기술 스택

| 기술 | 버전 | 선택 이유 |
|------|------|-----------|
| Next.js | 15 (App Router) | React 기반 풀스택 프레임워크, App Router로 최신 패턴 사용 |
| TypeScript | strict 모드 | 타입 안정성, 파서 로직의 정확성 보장 |
| Tailwind CSS | 4.x | 유틸리티 기반 빠른 스타일링, 다크모드 내장 지원 |
| Prism.js | 최신 | 가볍고 클라이언트에서 바로 동작, 줄 번호 플러그인 지원, TSX/JSX 문법 지원 |

---

## 기능 목록 + 상세 설명

### 기능 1: 파일 입력

**화면 구성:**
- 파일 미업로드 상태 (빈 상태):
  - 화면 중앙에 큰 드래그앤드롭 영역
  - 점선 테두리 + 아이콘 + "TSX/JSX 파일을 여기에 드래그하세요" 텍스트
  - 아래에 "또는 파일 선택" 버튼
  - 지원 형식 안내: ".tsx, .jsx 파일만 가능"
- 파일 업로드 후:
  - 드래그앤드롭 영역 축소 → 헤더 영역의 파일명 표시 + "다른 파일" 버튼으로 전환

**사용자 흐름:**
1. 파일을 드래그앤드롭 or 버튼 클릭으로 선택
2. 확장자 검증 (.tsx, .jsx만 허용)
3. 파일 크기 검증 (500KB 이하, 10,000줄 이하)
4. 통과하면 즉시 파싱 시작 → 결과 화면으로 전환
5. 실패하면 에러 메시지 표시 (드래그앤드롭 영역 유지)

**입력 검증 규칙:**
- 확장자: .tsx, .jsx만 허용
- 파일 크기: 최대 500KB
- 라인 수: 최대 10,000줄
- 파일 개수: 1개만 (여러 개 드롭 시 첫 번째만 처리하고 안내)
- 빈 파일: "파일이 비어있습니다" 안내

---

### 기능 2: 좌우 비교 뷰 (메인 화면)

**화면 구성:**
```
┌──────────────────────────────────────────────────────┐
│  🦴 Code Skeleton     파일명.tsx  [다른 파일] [🌙/☀️] │
├──────────────────────────────────────────────────────┤
│  📄 1500줄 → 48줄 (97% 압축)                         │
│  💾 State 8개  ⚡ Effect 3개  ⚙️ 함수 7개             │
├──────────────────────────┬───────────────────────────┤
│   원본 소스               │   🦴 뼈대                 │
│   (라인 넘버 + 코드)      │   (추출된 뼈대 코드)       │
│   dimming 처리된 부분 →   │                           │
│   밝은 부분 = 뼈대        │                           │
├──────────────────────────┴───────────────────────────┤
│              ↕ 스크롤 동기화                           │
└──────────────────────────────────────────────────────┘
```

**왼쪽 패널 (원본 소스):**
- 원본 코드 전체 표시
- 라인 넘버 표시
- Prism.js로 신택스 하이라이팅
- 뼈대에 포함된 줄: 정상 밝기 (opacity 1.0)
- 뼈대에서 빠진 줄: dimming 처리 (opacity 0.25)
- dimming은 줄 단위로 적용 (한 줄 전체가 밝거나 흐리거나)

**오른쪽 패널 (뼈대):**
- 추출된 뼈대 코드만 표시
- Prism.js로 신택스 하이라이팅
- 라인 넘버 없음 (뼈대는 새로 조립된 코드이므로)
- 카테고리별 주석 구분:
  ```
  // === State ===
  // === Effects ===
  // === 함수 ===
  // === 렌더링 구조 ===
  ```

**패널 분할:**
- 50:50 고정 분할
- PC 전용 (최소 너비 1024px)
- 1024px 미만: "PC에서 사용해주세요" 안내

---

### 기능 3: 스크롤 동기화

**동작 규칙:**
- 왼쪽 스크롤 → 오른쪽 따라감
- 오른쪽 스크롤 → 왼쪽 따라감
- 비율 기반 동기화: 왼쪽이 30% 스크롤 → 오른쪽도 30% 위치로
  - 이유: 왼쪽(원본)이 오른쪽(뼈대)보다 항상 길기 때문에 절대 픽셀 동기화는 안 맞음
- 무한 루프 방지: 스크롤 이벤트 발생 시 상대 패널의 스크롤은 프로그래밍 방식으로 설정하되, 그로 인한 이벤트는 무시

---

### 기능 4: 다크모드

**동작 규칙:**
- 기본값: 시스템 설정 따라감 (prefers-color-scheme)
- 토글 버튼: 헤더 우측에 🌙/☀️ 아이콘
- 전환 시 Prism.js 테마도 같이 변경
  - 다크: prism-tomorrow 또는 prism-vsc-dark-plus
  - 라이트: prism-one-light 또는 prism 기본
- 선택값은 localStorage에 저장 (재방문 시 유지)

---

### 기능 5: 통계 요약 바

**표시 항목:**
- 원본 라인 수 → 뼈대 라인 수 (압축률 %)
- State 개수 (useState 호출 수)
- Effect 개수 (useEffect 호출 수)
- 함수 개수 (컴포넌트 내부 함수 선언 수)

**위치:** 좌우 비교 뷰 상단, 한 줄 바 형태

---

## 뼈대 추출 규칙 (상세)

### 남기는 것 (라면+물+스프)

| 카테고리 | 추출 대상 | 형태 |
|----------|-----------|------|
| 컴포넌트 선언 | function/const 컴포넌트명, props | `function UserPage({ userId }: Props) {` |
| State | useState 호출 | `const [users, setUsers] = useState<User[]>([])` — 한 줄 그대로 |
| useEffect | 의존성 배열 + 첫 번째 함수 호출 | `useEffect(() => { loadUsers() }, [query])` |
| useMemo | 변수명 + 의존성 배열 | `const filtered = useMemo(() => ..., [users, filter])` |
| useCallback | 변수명 + 의존성 배열 | `const handleClick = useCallback(() => ..., [id])` |
| 커스텀 Hook | 호출부 전체 | `const { user, isLoading } = useAuth()` |
| 함수 시그니처 | 이름 + 파라미터 (본문 제거) | `const handleSearch = (query: string) => { ... }` → `const handleSearch = (query: string) => { /* ... */ }` |
| JSX 구조 | return 직계 자식 (depth 1) | `<Header />`, `<SearchBar />`, `<DataTable />` |

### 잘라내는 것 (고추가루+파+계란)

| 카테고리 | 제거 대상 |
|----------|-----------|
| import | 전체 제거 |
| 타입/인터페이스 | interface, type 정의 블록 전체 |
| 에러 처리 | try-catch의 catch 블록 내용 |
| 스타일링 | className, style, CSS-in-JS |
| 조건 분기 상세 | if/else 내부, 삼항연산자 분기 내용 |
| 디버깅 | console.log, console.error 등 |
| 주석 | 모든 주석 (// 및 /* */) |
| 함수 본문 | 시그니처만 남기고 body 제거 |
| JSX 속성 | onClick, onChange, data-*, aria-* 등 |
| 조건부 렌더링 | loading/error 상태 분기 상세 |
| 상수/변수 | 단순 값 할당 (const MAX_COUNT = 10 등) |

### JSX 구조 추출 depth 규칙

```tsx
// 원본
return (
  <div className="container">          // depth 0 — 래퍼는 남김
    <Header title="관리자" />           // depth 1 — 남김
    <main>                              // depth 1 — 남김
      <SearchBar onSearch={fn} />       // depth 2 — 제거
      <DataTable data={users} />        // depth 2 — 제거
    </main>
    <Footer />                          // depth 1 — 남김
  </div>
)

// 뼈대
return (
  <div>
    <Header />
    <main>...</main>
    <Footer />
  </div>
)
```

- depth 0: 최외곽 래퍼 → 태그만 남기고 속성 제거
- depth 1: 직계 자식 → 태그명만 남기고 props 제거
- depth 2+: 제거하고 부모에 `...` 표시

---

## 파싱 전략

### 1차: 정규식 기반

```
패턴 목록:
- useState: /const\s+\[(\w+),\s*\w+\]\s*=\s*useState/
- useEffect: /useEffect\s*\(\s*\(\)\s*=>\s*\{/
- useMemo: /const\s+(\w+)\s*=\s*useMemo\s*\(/
- useCallback: /const\s+(\w+)\s*=\s*useCallback\s*\(/
- 커스텀 Hook: /const\s+.*=\s*use\w+\(/
- 함수 선언: /(?:const|function)\s+(\w+)\s*=?\s*(?:\(|async\s*\()/
- 컴포넌트 선언: /(?:export\s+)?(?:default\s+)?function\s+([A-Z]\w+)/
- return JSX: /return\s*\(/
```

### 알려진 한계 (정규식 기반)

1. **중첩 괄호**: 함수 안의 함수가 있으면 본문 끝 지점 오판 가능
2. **템플릿 리터럴**: 백틱 안에 함수 패턴이 있으면 오탐
3. **문자열 안의 코드**: 문자열로 된 코드 패턴 오탐
4. **멀티라인 구조분해**: useState의 구조분해가 여러 줄이면 놓칠 수 있음
5. **HOC 패턴**: `export default withAuth(Component)` 같은 래핑 패턴

→ UI에 "정규식 기반 분석으로, 복잡한 패턴은 정확하지 않을 수 있습니다" 안내 문구 포함

### 향후 확장 (2차)
- @typescript-eslint/parser 또는 babel parser로 AST 기반 정확한 파싱
- 여러 파일 동시 분석
- 프로젝트 단위 구조 파악

---

## 에러/예외 처리 시나리오

| # | 상황 | 처리 |
|---|------|------|
| 1 | 지원하지 않는 확장자 업로드 | "TSX/JSX 파일만 지원합니다" 토스트 메시지, 업로드 영역 유지 |
| 2 | 500KB 초과 파일 | "파일이 너무 큽니다 (최대 500KB)" 토스트, 업로드 영역 유지 |
| 3 | 10,000줄 초과 | "10,000줄 이하 파일만 분석 가능합니다" 토스트 |
| 4 | 빈 파일 업로드 | "파일이 비어있습니다" 토스트 |
| 5 | 파싱 실패 (뼈대 추출 0줄) | "뼈대를 추출하지 못했습니다. React 컴포넌트 파일인지 확인해주세요" 안내 |
| 6 | 여러 파일 동시 드롭 | 첫 번째 파일만 처리 + "파일 1개만 분석 가능합니다" 안내 |
| 7 | 브라우저 너비 1024px 미만 | "PC 환경에서 사용해주세요" 전체 화면 안내 |

---

## 디자인 방향

- **플랫폼**: PC 전용 (최소 1024px)
- **기본 테마**: 시스템 설정 따라감 (다크/라이트)
- **코드 폰트**: `'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace`
- **dimming**: opacity 0.25 (다크 모드), opacity 0.3 (라이트 모드)
- **색상 톤**: 코드 에디터 느낌 — VS Code 스타일
- **뼈대 쪽**: 여백 넉넉하게, 카테고리 구분 주석은 약간 강조색
- **전환 애니메이션**: 다크↔라이트 전환 시 0.2s transition
- **토스트 메시지**: 우측 상단, 3초 후 자동 사라짐

---

## 파일 구조

```
code-skeleton/
├── app/
│   ├── layout.tsx          # 기본 레이아웃 + 다크모드 provider
│   ├── page.tsx            # 메인 페이지 (업로드 + 결과)
│   └── globals.css         # Tailwind + Prism 커스텀 + dimming 스타일
├── components/
│   ├── FileUploader.tsx    # 드래그앤드롭 파일 업로드
│   ├── CodeViewer.tsx      # 코드 표시 (Prism.js 신택스 하이라이팅)
│   ├── SplitView.tsx       # 좌우 분할 + 스크롤 동기화
│   ├── StatsBar.tsx        # 상단 통계 요약
│   ├── ThemeToggle.tsx     # 다크모드 토글 버튼
│   └── Toast.tsx           # 에러/안내 토스트 메시지
├── lib/
│   ├── parser.ts           # 코드 파싱 (정규식 기반)
│   ├── extractor.ts        # 뼈대 추출 로직
│   ├── differ.ts           # 원본 dimming 영역 계산 (줄 매핑)
│   └── constants.ts        # 매직 넘버, 설정값 상수
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```
