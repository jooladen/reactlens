'use client';

import { useCallback, useState } from 'react';
import FileUploader from '@/components/FileUploader';
import Toast from '@/components/Toast';
import SplitView from '@/components/SplitView';
import { parseTSXFile } from '@/lib/parser';
import { extractSkeleton } from '@/lib/extractor';
import { calculateDimming } from '@/lib/differ';
import type { ToastMessage } from '@/lib/types';

interface FileData {
  content: string;
  filename: string;
  skeletonCode: string;
  brightLines: Set<number>;
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
      const brightLines = calculateDimming(content, parseResult);
      setFileData({ content, filename, skeletonCode: skeleton.skeletonCode, brightLines });
    },
    []
  );

  const handleReset = useCallback(() => {
    setFileData(null);
  }, []);

  if (fileData) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground">
        <Toast toasts={toasts} onRemove={removeToast} />

        {/* 헤더 */}
        <header className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-base font-bold shrink-0">Code Skeleton</h1>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-mono truncate">
              {fileData.filename}
            </span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="ml-4 shrink-0 rounded-lg px-4 py-1.5 text-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            다른 파일
          </button>
        </header>

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
      <Toast toasts={toasts} onRemove={removeToast} />
      <FileUploader
        onFileUpload={handleFileUpload}
        onError={(msg) => addToast(msg, 'error')}
        onWarning={(msg) => addToast(msg, 'warning')}
      />
    </div>
  );
}
