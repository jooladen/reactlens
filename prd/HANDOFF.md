# Code Skeleton — HANDOFF (인수인계 문서)

## 마지막 완료
Chunk 2: 파일 업로드 + 파싱 엔진

## 현재 상태
- FileUploader.tsx: 드래그앤드롭 + 파일 선택 버튼, 확장자/크기/라인수/빈파일 검증, 여러 파일 드롭 시 첫 번째만 처리 + 안내
- Toast.tsx: 에러(빨강)/안내(노랑) 구분, 3초 후 fadeout 자동 사라짐, 우측 상단 고정
- parser.ts: 정규식 기반 parseTSXFile() — 컴포넌트 선언, useState, useEffect, useMemo, useCallback, 커스텀 Hook, 함수 시그니처, return JSX(depth 1) 추출, 원본 라인 번호 매핑
- extractor.ts: extractSkeleton() — 카테고리별 조립(State → Effects → Memo → Callback → Hooks → 함수 → 렌더링 구조), 카테고리 구분 주석, 통계(압축률, State/Effect/함수 개수)
- differ.ts: calculateDimming() — 뼈대 포함 줄 번호 Set 반환 (밝은 줄)
- types.ts: ParseResult, SkeletonResult, ToastMessage 등 타입 정의
- page.tsx: FileUploader + Toast 통합, 업로드 시 console.log로 파싱 결과 출력 (임시)

## 주의사항
- pnpm 사용 (npm이 아닌 pnpm으로 패키지 관리)
- 다크모드 localStorage 키: 'code-skeleton-theme'
- Tailwind 4 사용 (@custom-variant dark 방식)
- 참조 프로젝트: C:\Users\jooladen\Desktop\claude-code\nextlens
- parser.ts는 정규식 기반이므로 복잡한 패턴(중첩 괄호, 멀티라인 구조분해 등)에서 오탐/누락 가능
- Chunk 2 완료조건 중 "console.log로 파싱 결과 출력"은 page.tsx의 handleFileUpload에서 구현됨 (Chunk 3에서 실제 UI로 전환 예정)

## 다음 작업
Chunk 3: 좌우 비교 뷰 + 신택스 하이라이팅

## 히스토리
| 시점 | 내용 |
|------|------|
| 프로젝트 생성 | HANDOFF 초기화 |
| Chunk 1 완료 | Next.js 초기 세팅, 패키지 설치, 폴더 구조, constants.ts, globals.css, layout.tsx, page.tsx |
| Chunk 2 완료 | FileUploader, Toast, parser, extractor, differ, types 생성, page.tsx 통합 |
