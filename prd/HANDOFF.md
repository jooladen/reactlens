# Code Skeleton — HANDOFF (인수인계 문서)

## 마지막 완료
Chunk 6 (API 호출 지도)

## 현재 상태
Chunk 1~6 완료. 모든 기능 구현 완료.

## 주의사항
- API 호출 감지는 정규식 기반 (fetch, axios, supabase, await+HTTP동사)
- 컨텍스트 탐지 로직: useEffect 의존성 배열 기반 triggeredBy, 함수명 calledIn
- API 호출 0개인 파일에서는 ApiCallMap 컴포넌트 렌더링 안 됨 (null 반환)

## 다음 작업
없음 (모든 Chunk 완료)

## 히스토리
| 시점 | 내용 |
|------|------|
| 프로젝트 생성 | HANDOFF 초기화 |
| Chunk 1 | 프로젝트 초기 세팅 완료 |
| Chunk 2 | 파일 업로드 + 파싱 엔진 완료 |
| Chunk 3 | 좌우 비교 뷰 + 신택스 하이라이팅 완료 |
| Chunk 4 | 스크롤 동기화 + 통계 바 + 다크모드 완료 |
| Chunk 5 | 마무리 (에러 UI, 반응형, README) 완료 |
| Chunk 6 | API 호출 지도 (ApiCallMap) 완료 |
