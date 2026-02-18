'use client';

import type { SkeletonResult } from '@/lib/types';

interface StatsBarProps {
  stats: SkeletonResult['stats'];
}

export default function StatsBar({ stats }: StatsBarProps) {
  const { originalLines, skeletonLines, stateCount, effectCount, functionCount } = stats;
  const compressionRate =
    originalLines > 0 ? Math.round((1 - skeletonLines / originalLines) * 100) : 0;

  return (
    <div className="flex items-center gap-4 px-5 py-2 text-xs bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 flex-wrap">
      <span>
        <span className="font-medium text-gray-700 dark:text-gray-300">{originalLines}</span>
        줄 →{' '}
        <span className="font-medium text-gray-700 dark:text-gray-300">{skeletonLines}</span>
        줄{' '}
        <span className="text-blue-600 dark:text-blue-400 font-medium">({compressionRate}% 압축)</span>
      </span>
      <span className="text-gray-300 dark:text-gray-600">|</span>
      <span>State <span className="font-medium text-gray-700 dark:text-gray-300">{stateCount}</span>개</span>
      <span>Effect <span className="font-medium text-gray-700 dark:text-gray-300">{effectCount}</span>개</span>
      <span>함수 <span className="font-medium text-gray-700 dark:text-gray-300">{functionCount}</span>개</span>
    </div>
  );
}
