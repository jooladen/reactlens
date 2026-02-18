'use client';

import CodeViewer from './CodeViewer';

interface SplitViewProps {
  originalCode: string;
  skeletonCode: string;
  /** 원본에서 뼈대에 포함된 줄 번호 Set (밝은 줄) */
  brightLines: Set<number>;
}

export default function SplitView({
  originalCode,
  skeletonCode,
  brightLines,
}: SplitViewProps) {
  return (
    <div className="flex h-full">
      {/* 왼쪽: 원본 소스 */}
      <div className="flex flex-col flex-1 border-r border-gray-200 dark:border-gray-700 min-w-0">
        <div className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
          원본 소스
        </div>
        <div className="flex-1 overflow-hidden">
          <CodeViewer
            code={originalCode}
            showLineNumbers={true}
            brightLines={brightLines}
          />
        </div>
      </div>

      {/* 오른쪽: 뼈대 */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
          🦴 뼈대
        </div>
        <div className="flex-1 overflow-hidden">
          <CodeViewer
            code={skeletonCode}
            showLineNumbers={false}
          />
        </div>
      </div>
    </div>
  );
}
