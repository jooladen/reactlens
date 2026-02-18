# Code Skeleton - 프로젝트 스펙

## 한 줄 요약
TSX/JSX 파일을 업로드하면 뼈대(라면+물+스프)만 추출해서 원본과 나란히 비교해주는 Next.js 웹앱

## 컨셉
- 1500줄짜리 코드 → 뼈대만 뽑으면 50줄
- "아~ 원래 이걸 하려고 만든 거구나, 나머지 1450줄은 이래서 붙었구나"를 한눈에 파악
- 비유: 라면(컴포넌트) + 물(state) + 스프(핵심로직)만 남기고, 고추가루(스타일링) + 파(조건분기) + 계란(에러처리)은 잘라냄

## 기술 스택
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS

## 핵심 기능

### 1. 파일 입력
- .tsx / .jsx 파일 드래그앤드롭 업로드
- 파일 선택 버튼도 제공
- 업로드하면 바로 분석 시작

### 2. 좌우 비교 뷰 (메인 화면)

#### 다크모드
- 다크모드지원
#### 왼쪽 패널: 원본 소스
- 원본 코드 전체 표시 (라인 넘버 포함)
- **뼈대에서 빠진 부분은 dimming 처리** (투명도 낮춤, 흐리게)
- 뼈대에 포함된 부분은 정상 밝기로 하이라이트
- 코드 신택스 하이라이팅 적용

#### 오른쪽 패널: 뼈대 (라면+물+스프)
- 추출된 뼈대만 깔끔하게 표시
- 코드 신택스 하이라이팅 적용

#### 스크롤 동기화
- 양쪽 패널 스크롤이 같이 움직임
- 왼쪽 스크롤하면 오른쪽도 따라감, 반대도 마찬가지

### 3. 뼈대 추출 규칙 (고정)

#### 남기는 것 (라면+물+스프)
- **컴포넌트 선언부**: 함수명, props
- **state 선언**: useState 한 줄씩 (이름, 초기값)
- **핵심 로직 흐름**:
  - useEffect: 의존성 배열과 목적을 알 수 있는 최소한의 코드 (첫 줄 정도)
  - useMemo: 변수명과 의존성
  - 주요 함수: 함수 시그니처 (이름, 파라미터)만. 본문은 잘라냄
- **커스텀 hooks 사용**: useAuth(), useRouter() 등 호출부
- **return JSX 구조**: 최상위 컴포넌트 트리만 (중첩된 조건부 렌더링은 제거)

#### 잘라내는 것 (고추가루+파+계란)
- import 문 전체
- 타입/인터페이스 정의 상세 내용
- 에러 처리 (try-catch 블록의 catch 내용)
- 스타일링 (className, style 속성, CSS)
- 조건 분기 상세 (if문 내부, 삼항연산자의 분기 내용)
- console.log, 디버깅 코드
- 주석
- 함수 본문 (시그니처만 남기고 body는 제거)
- JSX 내부의 속성들 (이벤트 핸들러 바인딩, props 전달 상세)
- loading/error 상태에 따른 조건부 렌더링 상세

### 4. 통계 요약 (상단)
- 원본 라인 수 vs 뼈대 라인 수
- 압축률 (예: "1500줄 → 48줄, 97% 압축")
- state 개수, effect 개수, 함수 개수

## 화면 구성

```
┌──────────────────────────────────────────────────┐
│  🦴 Code Skeleton          [파일 업로드 버튼]     │
├──────────────────────────────────────────────────┤
│  📄 1500줄 → 48줄 (97% 압축)                     │
│  💾 State 8개  ⚡ Effect 3개  ⚙️ 함수 7개         │
├───────────────────────┬──────────────────────────┤
│   원본 소스            │   🦴 뼈대                │
│                       │                          │
│   import React...     │   function UserPage({    │
│   import { Button...  │     // state             │
│   import { useAuth... │     const [users] = ...  │
│                       │     const [loading] = .. │
│   ← dimming 처리 →    │                          │
│                       │     // effects           │
│   function UserPage({ │     useEffect(loadUsers) │
│     const router =... │                          │
│     const [users,...  │     // 함수들             │
│     const [loading,.. │     loadUsers()          │
│     ...               │     handleSearch()       │
│                       │     handleDelete()       │
│     ← 함수 본문은      │                          │
│       dimming →       │     // 렌더링 구조        │
│                       │     return (             │
│     return (          │       <Header />         │
│       <div className= │       <SearchBar />      │
│       ← style dimming │       <DataTable />      │
│                       │       <Pagination />     │
│                       │     )                    │
│                       │   }                      │
├───────────────────────┴──────────────────────────┤
│              ↕ 스크롤 동기화                       │
└──────────────────────────────────────────────────┘
```

## 파일 구조 (제안)

```
code-skeleton/
├── app/
│   ├── layout.tsx          # 기본 레이아웃
│   ├── page.tsx            # 메인 페이지 (업로드 + 결과)
│   └── globals.css         # Tailwind + 커스텀 스타일
├── components/
│   ├── FileUploader.tsx    # 드래그앤드롭 파일 업로드
│   ├── CodeViewer.tsx      # 코드 표시 (신택스 하이라이팅)
│   ├── SplitView.tsx       # 좌우 분할 + 스크롤 동기화
│   └── StatsBar.tsx        # 상단 통계 요약
├── lib/
│   ├── parser.ts           # 코드 파싱 (AST or regex)
│   ├── extractor.ts        # 뼈대 추출 로직
│   └── differ.ts           # 원본 dimming 영역 계산
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 파싱 전략
- 1차: 정규식 기반 파싱 (빠르고 단순하게 시작)
  - useState, useEffect, useMemo, useCallback 패턴 매칭
  - function/const 함수 선언 패턴
  - return ( ... ) JSX 영역 감지
- 향후 확장: @typescript-eslint/parser 또는 babel parser로 AST 기반 정확한 파싱

## 디자인 가이드
- 밝은 테마 (코드 읽기 편하게)
- 코드 폰트: 모노스페이스 (Fira Code, JetBrains Mono 등)
- dimming: opacity 0.25 정도로 흐리게
- 뼈대 쪽: 깔끔하고 여백 넉넉하게
- 반응형 불필요 (PC 전용, 코드 보는 도구니까)

## 실행 방법
```bash
npx create-next-app@latest code-skeleton --typescript --tailwind --app
cd code-skeleton
npm run dev
# http://localhost:3000 에서 사용
```

## 우선순위
1. ⭐ 파일 업로드 → 파싱 → 뼈대 추출 (핵심)
2. ⭐ 좌우 비교 뷰 + dimming (핵심)
3. ⭐ 스크롤 동기화 (핵심)
4. 통계 요약 바
5. 신택스 하이라이팅