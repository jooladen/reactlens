import type {
  ParseResult,
  ComponentItem,
  StateItem,
  EffectItem,
  MemoItem,
  CustomHookItem,
  FunctionItem,
  ReturnJsxItem,
} from './types';

/**
 * TSX/JSX 파일을 정규식 기반으로 파싱한다.
 * 컴포넌트 선언, useState, useEffect, useMemo, useCallback,
 * 커스텀 Hook, 함수 시그니처, return JSX 구조를 추출한다.
 */
export function parseTSXFile(code: string): ParseResult {
  const lines = code.split('\n');

  return {
    components: extractComponents(lines),
    states: extractUseState(lines),
    effects: extractUseEffect(lines),
    memos: [
      ...extractMemoOrCallback(lines, 'useMemo'),
      ...extractMemoOrCallback(lines, 'useCallback'),
    ],
    customHooks: extractCustomHooks(lines),
    functions: extractFunctions(lines),
    returnJsx: extractReturnJsx(lines),
    lines,
  };
}

/** 컴포넌트 선언 추출 (function/const + PascalCase) */
function extractComponents(lines: string[]): ComponentItem[] {
  const results: ComponentItem[] = [];

  // function 컴포넌트: export default function Name(...) {
  const fnPattern =
    /(?:export\s+)?(?:default\s+)?function\s+([A-Z]\w*)\s*\(([^)]*)\)/;
  // const 컴포넌트: const Name = (...) => {  또는  const Name: FC = (...) => {
  const arrowPattern =
    /(?:export\s+)?(?:default\s+)?const\s+([A-Z]\w*)\s*(?::\s*\w+\s*)?=\s*(?:\([^)]*\)|[^=]*)=>/;
  const arrowWithParamsPattern =
    /(?:export\s+)?(?:default\s+)?const\s+([A-Z]\w*)\s*(?::\s*\w+\s*)?=\s*\(([^)]*)\)\s*(?::\s*\w+\s*)?=>/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fnMatch = line.match(fnPattern);
    if (fnMatch) {
      results.push({
        type: 'component',
        componentName: fnMatch[1],
        props: fnMatch[2].trim(),
        raw: line.trimEnd(),
        lineNumber: i + 1,
      });
      continue;
    }

    const arrowMatch = line.match(arrowPattern);
    if (arrowMatch) {
      const paramsMatch = line.match(arrowWithParamsPattern);
      results.push({
        type: 'component',
        componentName: arrowMatch[1],
        props: paramsMatch ? paramsMatch[2].trim() : '',
        raw: line.trimEnd(),
        lineNumber: i + 1,
      });
    }
  }

  return results;
}

/** useState 추출 */
function extractUseState(lines: string[]): StateItem[] {
  const results: StateItem[] = [];
  const pattern = /const\s+\[(\w+),\s*\w+\]\s*=\s*useState(?:<[^>]*>)?\(([^)]*)\)/;

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(pattern);
    if (match) {
      results.push({
        type: 'useState',
        variableName: match[1],
        initialValue: match[2].trim(),
        raw: lines[i].trimEnd(),
        lineNumber: i + 1,
      });
    }
  }

  return results;
}

/** useEffect 추출 (의존성 배열 + 첫 줄) */
function extractUseEffect(lines: string[]): EffectItem[] {
  const results: EffectItem[] = [];
  const pattern = /useEffect\s*\(/;

  for (let i = 0; i < lines.length; i++) {
    if (!pattern.test(lines[i])) continue;

    const startLine = i + 1;
    const firstBodyLine = findFirstBodyLine(lines, i);
    const deps = findDependencies(lines, i);
    const endLine = findBlockEnd(lines, i);

    results.push({
      type: 'useEffect',
      dependencies: deps,
      firstLine: firstBodyLine,
      raw: lines[i].trimEnd(),
      lineNumber: startLine,
      endLineNumber: endLine + 1,
    });
  }

  return results;
}

/** useMemo / useCallback 추출 */
function extractMemoOrCallback(
  lines: string[],
  hookName: 'useMemo' | 'useCallback'
): MemoItem[] {
  const results: MemoItem[] = [];
  const pattern = new RegExp(
    `const\\s+(\\w+)\\s*=\\s*${hookName}\\s*\\(`
  );

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(pattern);
    if (match) {
      const deps = findDependencies(lines, i);
      results.push({
        type: hookName,
        variableName: match[1],
        dependencies: deps,
        raw: lines[i].trimEnd(),
        lineNumber: i + 1,
      });
    }
  }

  return results;
}

/** 커스텀 Hook 호출 추출 (use로 시작하는 함수 호출) */
function extractCustomHooks(lines: string[]): CustomHookItem[] {
  const results: CustomHookItem[] = [];
  const pattern = /const\s+.*=\s*(use[A-Z]\w*)\s*\(/;
  const builtInHooks = new Set([
    'useState', 'useEffect', 'useMemo', 'useCallback',
    'useRef', 'useContext', 'useReducer', 'useLayoutEffect',
    'useImperativeHandle', 'useDebugValue', 'useDeferredValue',
    'useTransition', 'useId', 'useSyncExternalStore',
    'useInsertionEffect', 'useOptimistic', 'useFormStatus',
    'useActionState',
  ]);

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(pattern);
    if (match && !builtInHooks.has(match[1])) {
      results.push({
        type: 'customHook',
        hookName: match[1],
        raw: lines[i].trimEnd(),
        lineNumber: i + 1,
      });
    }
  }

  return results;
}

/** 함수 시그니처 추출 (컴포넌트가 아닌 일반 함수) */
function extractFunctions(lines: string[]): FunctionItem[] {
  const results: FunctionItem[] = [];

  // const name = (...) => {   또는  const name = async (...) => {
  const arrowPattern =
    /(?:const|let)\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*(?::\s*\w+\s*)?=>/;
  // function name(...) {
  const fnPattern = /function\s+(\w+)\s*\(([^)]*)\)/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // PascalCase는 컴포넌트이므로 스킵
    // Hook 패턴도 스킵
    if (/(?:useState|useEffect|useMemo|useCallback|use[A-Z]\w*)\s*\(/.test(line)) {
      continue;
    }

    const arrowMatch = line.match(arrowPattern);
    if (arrowMatch && /^[a-z]/.test(arrowMatch[1])) {
      results.push({
        type: 'function',
        functionName: arrowMatch[1],
        params: arrowMatch[2].trim(),
        raw: line.trimEnd(),
        lineNumber: i + 1,
      });
      continue;
    }

    const fnMatch = line.match(fnPattern);
    if (fnMatch && /^[a-z]/.test(fnMatch[1])) {
      results.push({
        type: 'function',
        functionName: fnMatch[1],
        params: fnMatch[2].trim(),
        raw: line.trimEnd(),
        lineNumber: i + 1,
      });
    }
  }

  return results;
}

/** return JSX 구조 추출 (depth 1까지) */
function extractReturnJsx(lines: string[]): ReturnJsxItem[] {
  const results: ReturnJsxItem[] = [];
  const returnPattern = /^\s*return\s*\(/;

  for (let i = 0; i < lines.length; i++) {
    if (!returnPattern.test(lines[i])) continue;

    const startLine = i + 1;
    const endLine = findBlockEnd(lines, i, '(', ')');
    const jsxLines = lines.slice(i, endLine + 1);
    const jsxStructure = extractJsxDepth1(jsxLines);

    results.push({
      type: 'returnJsx',
      jsxStructure,
      raw: jsxLines.join('\n'),
      lineNumber: startLine,
      endLineNumber: endLine + 1,
    });
  }

  return results;
}

// ─── 유틸리티 함수 ───

/** 블록(중괄호 또는 괄호)의 끝 줄 번호(0-based)를 찾는다 */
function findBlockEnd(
  lines: string[],
  startIdx: number,
  open = '{',
  close = '}'
): number {
  let depth = 0;
  let found = false;

  for (let i = startIdx; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === open) {
        depth++;
        found = true;
      } else if (ch === close) {
        depth--;
        if (found && depth === 0) return i;
      }
    }
  }

  return Math.min(startIdx + 1, lines.length - 1);
}

/** useEffect/useMemo/useCallback의 콜백 첫 줄을 찾는다 */
function findFirstBodyLine(lines: string[], startIdx: number): string {
  for (let i = startIdx + 1; i < Math.min(startIdx + 5, lines.length); i++) {
    const trimmed = lines[i].trim();
    if (trimmed && trimmed !== '{' && trimmed !== '() => {' && trimmed !== '=> {') {
      return trimmed;
    }
  }
  return '';
}

/** 의존성 배열 [...]을 찾는다 */
function findDependencies(lines: string[], startIdx: number): string {
  const blockEnd = findBlockEnd(lines, startIdx, '(', ')');
  const chunk = lines.slice(startIdx, blockEnd + 1).join(' ');

  // 마지막 [...] 패턴 찾기 (의존성 배열)
  const depMatch = chunk.match(/,\s*\[([^\]]*)\]\s*\)\s*;?\s*$/);
  if (depMatch) {
    return `[${depMatch[1].trim()}]`;
  }

  return '[]';
}

/** JSX를 depth 1까지만 추출한다 */
function extractJsxDepth1(jsxLines: string[]): string {
  const selfClosingTag = /<(\w+)\s*[^>]*\/>/g;
  const openTag = /<(\w+)[\s>]/g;
  const closeTag = /<\/(\w+)>/g;

  const resultParts: string[] = [];
  let wrapperTag = '';
  let depth = 0;
  let insideReturn = false;

  for (const line of jsxLines) {
    const trimmed = line.trim();

    if (/^return\s*\(/.test(trimmed)) {
      insideReturn = true;
      continue;
    }
    if (!insideReturn) continue;
    if (trimmed === ')' || trimmed === ');') break;

    // depth 추적
    const opens = trimmed.match(openTag) || [];
    const closes = trimmed.match(closeTag) || [];
    const selfCloses = trimmed.match(selfClosingTag) || [];

    if (depth === 0 && opens.length > 0) {
      // 래퍼 태그
      const tagMatch = trimmed.match(/<(\w+)/);
      if (tagMatch) {
        wrapperTag = tagMatch[1];
        resultParts.push(`<${wrapperTag}>`);
        depth++;
        // 같은 줄에 닫히면
        if (closes.length > 0) {
          resultParts.push(`</${wrapperTag}>`);
          depth--;
        }
      }
    } else if (depth === 1) {
      // depth 1 자식들
      for (const sc of selfCloses) {
        const tagName = sc.match(/<(\w+)/)?.[1];
        if (tagName) resultParts.push(`    <${tagName} />`);
      }

      for (const o of opens) {
        const tagName = o.match(/<(\w+)/)?.[1];
        if (tagName && !selfCloses.some((s) => s.includes(tagName))) {
          resultParts.push(`    <${tagName}>...</${tagName}>`);
          // 같은 줄에 닫히지 않으면 depth 2+ 진입
          if (!closes.some((c) => c.includes(tagName))) {
            depth++;
          }
        }
      }

      // 닫는 태그가 래퍼면 depth 0
      for (const c of closes) {
        const tagName = c.match(/<\/(\w+)/)?.[1];
        if (tagName === wrapperTag) {
          resultParts.push(`</${wrapperTag}>`);
          depth = 0;
        }
      }
    } else if (depth > 1) {
      // depth 2+: 닫는 태그 추적만
      for (const c of closes) {
        depth--;
        if (depth === 1) break;
      }
      for (const o of opens) {
        if (!selfCloses.some((s) => s.includes(o))) {
          depth++;
        }
      }
      // 래퍼 닫는 태그 체크
      for (const c of closes) {
        const tagName = c.match(/<\/(\w+)/)?.[1];
        if (tagName === wrapperTag) {
          resultParts.push(`</${wrapperTag}>`);
          depth = 0;
        }
      }
    }
  }

  if (resultParts.length === 0) {
    return 'return (...)';
  }

  return `return (\n${resultParts.join('\n')}\n)`;
}
