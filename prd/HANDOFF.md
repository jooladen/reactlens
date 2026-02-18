# Code Skeleton — HANDOFF (인수인계 문서)

## 마지막 완료
Chunk 1: 프로젝트 초기 세팅

## 현재 상태
- Next.js 16 + TypeScript + Tailwind 4 프로젝트 구조 완성
- prismjs, @types/prismjs, prism-themes 설치됨
- src/components/, src/lib/ 폴더 생성됨
- lib/constants.ts 상수 정의 완료
- globals.css: 다크모드 커스텀 variant, 코드 폰트(Fira Code, JetBrains Mono), .line-dimmed 클래스, Prism 다크/라이트 토큰 스타일 완성
- layout.tsx: 다크모드 초기화 스크립트 (localStorage + 시스템 설정 감지), suppressHydrationWarning
- page.tsx: "Code Skeleton" 텍스트 + 설명 placeholder

## 주의사항
- pnpm 사용 (npm이 아닌 pnpm으로 패키지 관리)
- 다크모드 localStorage 키: 'code-skeleton-theme'
- Tailwind 4 사용 (@custom-variant dark 방식)
- 참조 프로젝트: C:\Users\jooladen\Desktop\claude-code\nextlens

## 다음 작업
Chunk 2: 파일 업로드 + 파싱 엔진

## 히스토리
| 시점 | 내용 |
|------|------|
| 프로젝트 생성 | HANDOFF 초기화 |
| Chunk 1 완료 | Next.js 초기 세팅, 패키지 설치, 폴더 구조, constants.ts, globals.css, layout.tsx, page.tsx |
