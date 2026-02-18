# Code Skeleton — HANDOFF (인수인계 문서)

## 마지막 완료
Chunk 5: 마무리 (전체 완성)

## 현재 상태 (최종)
- FileUploader.tsx: 드래그앤드롭 + 파일 선택 버튼, 확장자/크기/라인수/빈파일 검증, 여러 파일 드롭 시 첫 번째만 처리 + 안내
- Toast.tsx: 에러(빨강)/안내(노랑) 구분, 3초 후 fadeout 자동 사라짐, 우측 상단 고정
- parser.ts: 정규식 기반 parseTSXFile()
- extractor.ts: extractSkeleton() — 카테고리별 조립 + 통계
- differ.ts: calculateDimming() — 뼈대 포함 줄 번호 Set 반환
- types.ts: 타입 정의 전체
- CodeViewer.tsx: Prism.js 신택스 하이라이팅, 라인 넘버, dimming, scrollRef
- SplitView.tsx: 50:50 분할, 비율 기반 양방향 스크롤 동기화
- StatsBar.tsx: 통계 + 파싱 안내 문구 ("정규식 기반 분석으로, 복잡한 패턴은 정확하지 않을 수 있습니다")
- ThemeToggle.tsx: 🌙/☀️ 토글, localStorage 저장
- page.tsx: MobileNotice(1024px 미만 안내), 파싱 실패(0줄) 에러 처리, 전체 통합
- README.md: 프로젝트 소개, 실행 방법, 사용법, 기술 스택, 추출 규칙

## 주의사항
- pnpm 사용
- 다크모드 localStorage 키: 'code-skeleton-theme'
- Tailwind 4 (@custom-variant dark 방식)
- Prism 임포트 순서: javascript → markup → typescript → jsx → tsx
- 스크롤 동기화: isSyncing ref + requestAnimationFrame

## 프로젝트 완료
모든 Chunk(1~5) 완료. 추가 작업 없음.

## 히스토리
| 시점 | 내용 |
|------|------|
| 프로젝트 생성 | HANDOFF 초기화 |
| Chunk 1 완료 | Next.js 초기 세팅, 패키지 설치, 폴더 구조, constants.ts, globals.css, layout.tsx, page.tsx |
| Chunk 2 완료 | FileUploader, Toast, parser, extractor, differ, types 생성, page.tsx 통합 |
| Chunk 3 완료 | CodeViewer(Prism.js 하이라이팅+dimming), SplitView(50:50 분할), page.tsx 통합 |
| Chunk 4 완료 | 스크롤 동기화(SplitView), StatsBar, ThemeToggle, page.tsx 헤더+StatsBar 통합 |
| Chunk 5 완료 | 반응형 안내(MobileNotice), 파싱 안내 문구(StatsBar), 파싱 실패 에러 처리, README.md |
