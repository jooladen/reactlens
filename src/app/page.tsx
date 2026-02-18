export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-4xl font-bold tracking-tight">Code Skeleton</h1>
      <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
        TSX/JSX 파일의 뼈대를 추출해서 원본과 비교합니다
      </p>
    </div>
  );
}
