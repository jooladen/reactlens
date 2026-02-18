@echo off
chcp 65001 >nul
echo ========================================
echo   Code Skeleton - Claude Code 자동 실행
echo ========================================
echo.

for %%i in (1 2 3 4 5) do (
    echo [Chunk %%i] 시작...
    echo.
    claude "prd/HANDOFF.md와 prd/chunk_roadmap.md를 읽고 현재 미완료 Chunk를 작업해줘. Chunk 완료 시 HANDOFF 업데이트, chunk_roadmap 체크, git commit+push 잊지 마."
    echo.
    echo [Chunk %%i] 완료
    echo ----------------------------------------
    echo.
)

echo.
echo ========================================
echo   모든 Chunk 완료!
echo ========================================
pause
