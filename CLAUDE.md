# CLAUDE.md — Claude Code 작업 규칙서

## 프로젝트 정보
- **프로젝트명**: Code Skeleton
- **GitHub**: `https://github.com/jooladen/reactlens`
- **설명**: TSX/JSX 파일의 뼈대를 추출해서 원본과 비교하는 Next.js 웹앱

---

## 기본 규칙
- 항상 한국어로 응답
- 작업 시작 시 `prd/HANDOFF.md`와 `prd/chunk_roadmap.md` 먼저 읽기
- `prd/PRD.md`는 기능 상세가 필요할 때 참고
- 관련된 로직이 C:\Users\jooladen\Desktop\claude-code\nextlens 에 있으니 참조

---

## 작업 방식
- 미완료 Chunk만 순서대로 작업 (한 번에 여러 Chunk 절대 금지)
- chunk_roadmap에 없는 기능 임의 추가 금지
- 애매하면 질문하지 말고 최선의 판단으로 진행, HANDOFF.md에 판단 근거 기록
- package.json 있으면 프로젝트 생성 스킵, 없는 패키지만 추가
- 이미 있는 파일/폴더 덮어쓰지 않음 (수정만 가능)

---

## Chunk 완료 시 필수 절차
1. `prd/HANDOFF.md` 업데이트 (마지막 완료, 현재 상태, 다음 작업, 히스토리)
2. `prd/chunk_roadmap.md` 체크박스 `[x]` 체크
3. `git add . → git commit -m "Chunk N: 한 줄 요약" → git push`
4. "Chunk N 완료" 출력

---

## Git 규칙
- Chunk 완료 시에만 commit + push
- 첫 push: `git push -u origin main`
- 이후: `git push`
- 중간 저장은 commit하지 않음

---

## 코드 규칙
- TypeScript strict 모드
- 상수는 `lib/constants.ts`에 정의 (매직 넘버 금지)
- 사용자에게 노출되는 텍스트는 한국어
- 컴포넌트는 `components/` 폴더에, 유틸리티는 `lib/` 폴더에
- Prism.js로 신택스 하이라이팅 (커스텀 구현 금지)
