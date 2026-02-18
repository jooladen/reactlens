'use client';

import { useCallback, useState } from 'react';
import FileUploader from '@/components/FileUploader';
import Toast from '@/components/Toast';
import SplitView from '@/components/SplitView';
import StatsBar from '@/components/StatsBar';
import ThemeToggle from '@/components/ThemeToggle';
import { parseTSXFile } from '@/lib/parser';
import { extractSkeleton } from '@/lib/extractor';
import { calculateDimming } from '@/lib/differ';
import type { SkeletonResult, ToastMessage } from '@/lib/types';

interface FileData {
  content: string;
  filename: string;
  skeletonCode: string;
  brightLines: Set<number>;
  stats: SkeletonResult['stats'];
}

/** 1024px 미만에서 PC 환경 안내 오버레이 */
function MobileNotice() {
  return (
    <div className="flex lg:hidden flex-col items-center justify-center fixed inset-0 z-50 bg-background text-foreground px-8 text-center">
      <svg
        className="mb-6 h-16 w-16 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      <h2 className="text-xl font-bold mb-2">PC 환경에서 사용해주세요</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Code Skeleton은 좌우 코드 비교 뷰를 제공하는 도구로,<br />
        넓은 화면(1024px 이상)에서 최적화되어 있습니다.
      </p>
    </div>
  );
}

export default function Home() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [fileData, setFileData] = useState<FileData | null>(null);

  const addToast = useCallback((message: string, type: 'error' | 'warning') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleFileUpload = useCallback(
    (content: string, filename: string) => {
      const parseResult = parseTSXFile(content);
      const skeleton = extractSkeleton(parseResult);

      // 파싱 실패 (뼈대 0줄) 에러 처리
      if (skeleton.stats.skeletonLines === 0) {
        addToast(
          '뼈대를 추출하지 못했습니다. 지원하지 않는 코드 구조일 수 있습니다.',
          'warning'
        );
        return;
      }

      const brightLines = calculateDimming(content, parseResult);
      setFileData({
        content,
        filename,
        skeletonCode: skeleton.skeletonCode,
        brightLines,
        stats: skeleton.stats,
      });
    },
    [addToast]
  );

  const handleReset = useCallback(() => {
    setFileData(null);
  }, []);

  if (fileData) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground">
        <MobileNotice />
        <Toast toasts={toasts} onRemove={removeToast} />

        {/* 헤더 */}
        <header className="flex items-center justify-between px-5 py-2.5 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-base font-bold shrink-0">Code Skeleton</h1>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-mono truncate">
              {fileData.filename}
            </span>
          </div>
          <div className="flex items-center gap-2 ml-4 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg px-4 py-1.5 text-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              다른 파일
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* 통계 바 */}
        <StatsBar stats={fileData.stats} />

        {/* 좌우 비교 뷰 */}
        <div className="flex-1 overflow-hidden">
          <SplitView
            originalCode={fileData.content}
            skeletonCode={fileData.skeletonCode}
            brightLines={fileData.brightLines}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MobileNotice />
      <Toast toasts={toasts} onRemove={removeToast} />
      <FileUploader
        onFileUpload={handleFileUpload}
        onError={(msg) => addToast(msg, 'error')}
        onWarning={(msg) => addToast(msg, 'warning')}
      />
    </div>
  );
}
