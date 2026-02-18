'use client';

import { useCallback, useState } from 'react';
import FileUploader from '@/components/FileUploader';
import Toast from '@/components/Toast';
import { parseTSXFile } from '@/lib/parser';
import { extractSkeleton } from '@/lib/extractor';
import { calculateDimming } from '@/lib/differ';
import type { ToastMessage } from '@/lib/types';

export default function Home() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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

      // Chunk 2 완료조건: console.log로 파싱 결과 출력 (임시)
      console.log('=== 파싱 결과 ===', {
        filename,
        parseResult,
        skeleton,
        brightLines,
        stats: skeleton.stats,
      });
      console.log('=== 뼈대 코드 ===\n' + skeleton.skeletonCode);
    },
    []
  );

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
