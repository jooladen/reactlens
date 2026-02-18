/** 파싱된 항목 하나의 공통 구조 */
export interface ParsedItem {
  type:
    | 'component'
    | 'useState'
    | 'useEffect'
    | 'useMemo'
    | 'useCallback'
    | 'customHook'
    | 'function'
    | 'returnJsx';
  raw: string;
  lineNumber: number;
  endLineNumber?: number;
}

/** useState 항목 */
export interface StateItem extends ParsedItem {
  type: 'useState';
  variableName: string;
  initialValue: string;
}

/** useEffect 항목 */
export interface EffectItem extends ParsedItem {
  type: 'useEffect';
  dependencies: string;
  firstLine: string;
}

/** useMemo / useCallback 항목 */
export interface MemoItem extends ParsedItem {
  type: 'useMemo' | 'useCallback';
  variableName: string;
  dependencies: string;
}

/** 커스텀 Hook 항목 */
export interface CustomHookItem extends ParsedItem {
  type: 'customHook';
  hookName: string;
}

/** 함수 시그니처 항목 */
export interface FunctionItem extends ParsedItem {
  type: 'function';
  functionName: string;
  params: string;
}

/** 컴포넌트 선언 항목 */
export interface ComponentItem extends ParsedItem {
  type: 'component';
  componentName: string;
  props: string;
}

/** return JSX 항목 */
export interface ReturnJsxItem extends ParsedItem {
  type: 'returnJsx';
  jsxStructure: string;
}

/** API 호출 항목 */
export interface ApiCallItem {
  /** 호출 표현식 (예: "fetch", "axios.get", "supabase.from") */
  callee: string;
  /** 첫 번째 인자 (URL, 테이블명 등) */
  args: string;
  lineNumber: number;
  /** 호출 위치 (함수명, "useEffect", "컴포넌트 최상위") */
  calledIn: string;
  /** useEffect 의존성 배열 (해당할 때만) */
  triggeredBy?: string;
}

/** 파싱 결과 전체 */
export interface ParseResult {
  components: ComponentItem[];
  states: StateItem[];
  effects: EffectItem[];
  memos: MemoItem[];
  customHooks: CustomHookItem[];
  functions: FunctionItem[];
  returnJsx: ReturnJsxItem[];
  apiCalls: ApiCallItem[];
  /** 원본 코드 줄 배열 */
  lines: string[];
}

/** 뼈대 추출 결과 */
export interface SkeletonResult {
  skeletonCode: string;
  stats: {
    originalLines: number;
    skeletonLines: number;
    stateCount: number;
    effectCount: number;
    functionCount: number;
    apiCallCount: number;
  };
}

/** 토스트 메시지 타입 */
export type ToastType = 'error' | 'warning';

/** 토스트 메시지 */
export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
