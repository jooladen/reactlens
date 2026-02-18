'use client';

import { useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

interface CodeViewerProps {
  code: string;
  showLineNumbers?: boolean;
  /** 뼈대에 포함된 줄 번호 Set (밝은 줄) — 미전달 시 dimming 없음 */
  brightLines?: Set<number>;
  language?: string;
}

export default function CodeViewer({
  code,
  showLineNumbers = false,
  brightLines,
  language = 'tsx',
}: CodeViewerProps) {
  const highlightedLines = useMemo(() => {
    const grammar = Prism.languages[language] ?? Prism.languages['javascript'];
    const highlighted = Prism.highlight(code, grammar, language);
    return highlighted.split('\n');
  }, [code, language]);

  return (
    <div className="h-full overflow-auto bg-[#fafafa] dark:bg-[#1e1e1e]">
      <pre
        className="m-0 min-h-full"
        style={{ background: 'transparent', overflow: 'visible', padding: '1rem' }}
      >
        <code className={`language-${language} code-font`}>
          {highlightedLines.map((line, index) => {
            const lineNumber = index + 1;
            const isDimmed =
              brightLines !== undefined && !brightLines.has(lineNumber);

            return (
              <div
                key={lineNumber}
                className={`flex${isDimmed ? ' line-dimmed' : ''}`}
              >
                {showLineNumbers && (
                  <span
                    className="select-none text-right pr-4 shrink-0 text-gray-400 dark:text-gray-600"
                    style={{ minWidth: '3em' }}
                  >
                    {lineNumber}
                  </span>
                )}
                <span
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: line || '\u00a0' }}
                  style={{ whiteSpace: 'pre', flex: 1 }}
                />
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
