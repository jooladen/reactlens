'use client';

import { useState } from 'react';
import type { ApiCallItem } from '@/lib/types';

interface ApiCallMapProps {
  apiCalls: ApiCallItem[];
}

export default function ApiCallMap({ apiCalls }: ApiCallMapProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (apiCalls.length === 0) return null;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 shrink-0">
      {/* 헤더 */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-left hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
      >
        <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
          <span>📡</span>
          <span>[API CALL MAP]</span>
          <span className="text-gray-400 dark:text-gray-500 font-normal">
            ({apiCalls.length})
          </span>
        </span>
        <span className="text-gray-400 dark:text-gray-500 text-[10px]">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {/* 항목 목록 */}
      {isOpen && (
        <div className="px-4 pb-3 space-y-1.5 font-mono text-xs">
          {apiCalls.map((call, idx) => (
            <div
              key={idx}
              className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-gray-700 dark:text-gray-300"
            >
              <span className="text-green-600 dark:text-green-400 font-medium">
                {call.callee}({call.args})
              </span>
              <span className="text-gray-400">→</span>
              <span className="text-gray-500 dark:text-gray-400">called in:</span>
              <span className="text-purple-600 dark:text-purple-400">{call.calledIn}</span>
              {call.triggeredBy && (
                <>
                  <span className="text-gray-400">→</span>
                  <span className="text-gray-500 dark:text-gray-400">triggered by:</span>
                  <span className="text-orange-500 dark:text-orange-400">{call.triggeredBy}</span>
                </>
              )}
              <span className="text-gray-300 dark:text-gray-600">:{call.lineNumber}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
