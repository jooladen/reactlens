# Code Skeleton

TSX/JSX 파일의 뼈대를 추출해서 원본과 좌우로 비교하는 Next.js 웹앱입니다.

## 실행 방법

```bash
# 패키지 설치
npm install
# 또는
pnpm install

# 개발 서버 실행
npm run dev
# 또는
pnpm dev
```

브라우저에서 http://localhost:3000 접속

## 사용법

1. `.tsx` 또는 `.jsx` 파일을 드래그앤드롭하거나 파일 선택 버튼으로 업로드
2. 왼쪽 패널에서 원본 코드 확인 (뼈대에 포함된 줄은 밝게, 나머지는 흐리게 표시)
3. 오른쪽 패널에서 추출된 뼈대 코드 확인
4. 헤더의 🌙/☀️ 버튼으로 다크/라이트 모드 전환
5. "다른 파일" 버튼으로 초기 화면 복귀

## 제한 사항

- 지원 확장자: `.tsx`, `.jsx`
- 최대 파일 크기: 500KB
- 최대 라인 수: 10,000줄
- PC 환경(1024px 이상) 전용

## 기술 스택

| 항목 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript (strict 모드) |
| 스타일 | Tailwind CSS v4 |
| 신택스 하이라이팅 | Prism.js |
| 패키지 매니저 | pnpm |

## 뼈대 추출 규칙

정규식 기반으로 아래 항목을 추출합니다 (복잡한 패턴은 정확하지 않을 수 있습니다):

| 항목 | 추출 내용 |
|------|-----------|
| 컴포넌트 선언 | `function`/`const` + PascalCase 선언부 |
| State | `useState` 호출 (변수명, 초기값) |
| Effects | `useEffect` 시그니처 (의존성 배열, 첫 줄) |
| Memo/Callback | `useMemo`, `useCallback` (변수명, 의존성) |
| 커스텀 Hook | `use`로 시작하는 Hook 호출부 |
| 함수 시그니처 | 내부 함수 이름과 파라미터 |
| 렌더링 구조 | `return` JSX의 depth 1 구조 |
