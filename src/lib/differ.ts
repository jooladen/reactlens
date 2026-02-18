import type { ParseResult } from './types';

/**
 * 원본 코드에서 뼈대에 포함되는 줄 번호 Set을 계산한다.
 * Set에 포함된 줄 → 밝게, 나머지 → dimming 처리.
 * 줄 번호는 1-based.
 */
export function calculateDimming(
  code: string,
  parseResult: ParseResult
): Set<number> {
  const brightLines = new Set<number>();
  const lines = code.split('\n');

  // 컴포넌트 선언 줄
  for (const comp of parseResult.components) {
    brightLines.add(comp.lineNumber);
  }

  // useState 줄
  for (const state of parseResult.states) {
    brightLines.add(state.lineNumber);
  }

  // useEffect: 시작 줄 + 의존성 배열이 있는 마지막 줄
  for (const effect of parseResult.effects) {
    brightLines.add(effect.lineNumber);
    if (effect.endLineNumber) {
      brightLines.add(effect.endLineNumber);
    }
  }

  // useMemo / useCallback 줄
  for (const memo of parseResult.memos) {
    brightLines.add(memo.lineNumber);
  }

  // 커스텀 Hook 줄
  for (const hook of parseResult.customHooks) {
    brightLines.add(hook.lineNumber);
  }

  // 함수 시그니처 줄
  for (const fn of parseResult.functions) {
    brightLines.add(fn.lineNumber);
  }

  // return JSX: 시작~끝 줄 전체
  for (const jsx of parseResult.returnJsx) {
    const end = jsx.endLineNumber ?? jsx.lineNumber;
    for (let i = jsx.lineNumber; i <= end; i++) {
      brightLines.add(i);
    }
  }

  // 컴포넌트 닫는 중괄호 줄 (마지막 } 가 있는 줄)
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() === '}') {
      brightLines.add(i + 1);
      break;
    }
  }

  return brightLines;
}
