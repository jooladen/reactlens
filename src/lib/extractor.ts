import type { ParseResult, SkeletonResult, ApiCallItem } from './types';

/**
 * 파싱 결과를 카테고리별로 조립하여 뼈대 코드를 생성한다.
 * 순서: 컴포넌트 선언 → State → Effects → Memo/Callback → 커스텀 Hook → 함수 → 렌더링 구조
 */
export function extractSkeleton(parseResult: ParseResult): SkeletonResult {
  const sections: string[] = [];

  // 컴포넌트 선언
  if (parseResult.components.length > 0) {
    for (const comp of parseResult.components) {
      sections.push(comp.raw);
    }
    sections.push('');
  }

  // State
  if (parseResult.states.length > 0) {
    sections.push('  // === State ===');
    for (const state of parseResult.states) {
      sections.push(`  ${state.raw.trim()}`);
    }
    sections.push('');
  }

  // Effects
  if (parseResult.effects.length > 0) {
    sections.push('  // === Effects ===');
    for (const effect of parseResult.effects) {
      const firstLine = effect.firstLine
        ? `    ${effect.firstLine}`
        : '    // ...';
      sections.push(`  useEffect(() => {`);
      sections.push(firstLine);
      sections.push(`    // ...`);
      sections.push(`  }, ${effect.dependencies});`);
    }
    sections.push('');
  }

  // Memo / Callback
  const memos = parseResult.memos.filter((m) => m.type === 'useMemo');
  const callbacks = parseResult.memos.filter((m) => m.type === 'useCallback');

  if (memos.length > 0) {
    sections.push('  // === Memo ===');
    for (const memo of memos) {
      sections.push(
        `  const ${memo.variableName} = useMemo(() => /* ... */, ${memo.dependencies});`
      );
    }
    sections.push('');
  }

  if (callbacks.length > 0) {
    sections.push('  // === Callback ===');
    for (const cb of callbacks) {
      sections.push(
        `  const ${cb.variableName} = useCallback(() => { /* ... */ }, ${cb.dependencies});`
      );
    }
    sections.push('');
  }

  // 커스텀 Hook
  if (parseResult.customHooks.length > 0) {
    sections.push('  // === Hooks ===');
    for (const hook of parseResult.customHooks) {
      sections.push(`  ${hook.raw.trim()}`);
    }
    sections.push('');
  }

  // 함수 시그니처
  if (parseResult.functions.length > 0) {
    sections.push('  // === 함수 ===');
    for (const fn of parseResult.functions) {
      const params = fn.params;
      sections.push(
        `  const ${fn.functionName} = (${params}) => { /* ... */ };`
      );
    }
    sections.push('');
  }

  // 렌더링 구조
  if (parseResult.returnJsx.length > 0) {
    sections.push('  // === 렌더링 구조 ===');
    for (const jsx of parseResult.returnJsx) {
      // JSX 구조 각 줄에 들여쓰기 추가
      const jsxLines = jsx.jsxStructure.split('\n');
      for (const line of jsxLines) {
        sections.push(`  ${line}`);
      }
    }
  }

  // 컴포넌트 닫기
  if (parseResult.components.length > 0) {
    sections.push('}');
  }

  const skeletonCode = sections.join('\n');
  const skeletonLines = skeletonCode.split('\n').filter((l) => l.trim()).length;

  return {
    skeletonCode,
    stats: {
      originalLines: parseResult.lines.length,
      skeletonLines,
      stateCount: parseResult.states.length,
      effectCount: parseResult.effects.length,
      functionCount: parseResult.functions.length,
      apiCallCount: parseResult.apiCalls.length,
    },
  };
}

/**
 * API 호출 배열을 포맷팅된 문자열로 조립한다.
 * 형식: 함수명(args) → called in: 위치 → triggered by: 의존성
 * API 호출 0개면 빈 문자열 반환
 */
export function formatApiCallMap(apiCalls: ApiCallItem[]): string {
  if (apiCalls.length === 0) return '';

  return apiCalls
    .map((call) => {
      let line = `${call.callee}(${call.args})`;
      line += ` → called in: ${call.calledIn}`;
      if (call.triggeredBy) {
        line += ` → triggered by: ${call.triggeredBy}`;
      }
      return line;
    })
    .join('\n');
}
