'use client';

import { useCallback, useRef, useState } from 'react';
import {
  MAX_FILE_SIZE,
  MAX_LINE_COUNT,
  ALLOWED_EXTENSIONS,
} from '@/lib/constants';

interface FileUploaderProps {
  onFileUpload: (content: string, filename: string) => void;
  onError: (message: string) => void;
  onWarning: (message: string) => void;
}

export default function FileUploader({
  onFileUpload,
  onError,
  onWarning,
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcess = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      if (files.length > 1) {
        onWarning('파일 1개만 분석 가능합니다. 첫 번째 파일만 처리합니다.');
      }

      const file = files[0];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();

      // 확장자 검증
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        onError('TSX/JSX 파일만 지원합니다.');
        return;
      }

      // 파일 크기 검증
      if (file.size > MAX_FILE_SIZE) {
        onError('파일이 너무 큽니다 (최대 500KB).');
        return;
      }

      // 파일 내용 읽기
      const content = await file.text();

      // 빈 파일 검증
      if (content.trim().length === 0) {
        onError('파일이 비어있습니다.');
        return;
      }

      // 라인 수 검증
      const lineCount = content.split('\n').length;
      if (lineCount > MAX_LINE_COUNT) {
        onError('10,000줄 이하 파일만 분석 가능합니다.');
        return;
      }

      onFileUpload(content, file.name);
    },
    [onFileUpload, onError, onWarning]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      validateAndProcess(e.dataTransfer.files);
    },
    [validateAndProcess]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      validateAndProcess(e.target.files);
      // 같은 파일 재선택 허용
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [validateAndProcess]
  );

  const borderColor = isDragOver
    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
    : 'border-gray-300 dark:border-gray-600';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">
        Code Skeleton
      </h1>
      <p className="mb-10 text-lg text-gray-500 dark:text-gray-400">
        TSX/JSX 파일의 뼈대를 추출해서 원본과 비교합니다
      </p>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex w-full max-w-lg cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors duration-200 ${borderColor}`}
        onClick={() => fileInputRef.current?.click()}
      >
        {/* 파일 아이콘 */}
        <svg
          className="mb-4 h-12 w-12 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>

        <p className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
          TSX/JSX 파일을 여기에 드래그하세요
        </p>

        <button
          type="button"
          className="mb-3 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          또는 파일 선택
        </button>

        <p className="text-xs text-gray-400 dark:text-gray-500">
          .tsx, .jsx 파일만 가능
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".tsx,.jsx"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}
