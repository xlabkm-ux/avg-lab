@echo off
REM Auto-create PR from current branch using project template
REM Usage: scripts\dev\create-pr.bat
REM
REM Prerequisites:
REM   - gh CLI installed and authenticated
REM   - On a feature branch (not main)
REM   - At least one commit ahead of main
REM

setlocal enabledelayedexpansion

echo === AVG Lab PR Creator ===

REM Check gh CLI
where gh >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: gh CLI not installed
    echo Install from: https://cli.github.com/
    exit /b 1
)

REM Check authentication
gh auth status >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: gh not authenticated
    echo Run: gh auth login
    exit /b 1
)

REM Get current branch
for /f "delims=" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i

if "%CURRENT_BRANCH%"=="main" (
    echo Error: Cannot create PR from main branch
    exit /b 1
)

REM Extract ticket ID from branch name (agent/role/TICKET-slug)
echo Branch: %CURRENT_BRANCH%

REM Check if PR already exists
gh pr list --head "%CURRENT_BRANCH%" --json number --jq ".[0].number" 2>nul | findstr /r "[0-9]" >nul
if %errorlevel% equ 0 (
    for /f "delims=" %%i in ('gh pr list --head "%CURRENT_BRANCH%" --json number --jq ".[0].number" 2^>nul') do set EXISTING_PR=%%i
    if defined EXISTING_PR (
        echo PR #%EXISTING_PR% already exists
        echo URL: https://github.com/xlabkm-ux/avg-lab/pull/%EXISTING_PR%
        exit /b 0
    )
)

REM Get last commit message
for /f "delims=" %%i in ('git log -1 --pretty=format:%%s') do set COMMIT_MSG=%%i
for /f "delims=" %%i in ('git log -1 --pretty=format:%%b') do set COMMIT_BODY=%%i

echo Title: %COMMIT_MSG%

REM Push branch if not pushed
git rev-parse --abbrev-ref --symbolic-full-name @{u} >nul 2>nul
if %errorlevel% neq 0 (
    echo Pushing branch to remote...
    git push -u origin "%CURRENT_BRANCH%"
)

echo Creating PR...

for /f "delims=" %%i in ('gh pr create --base main --head "%CURRENT_BRANCH%" --title "%COMMIT_MSG%" --body "%COMMIT_BODY%"') do set PR_URL=%%i

echo PR created: %PR_URL%
echo.
echo === PR Summary ===
echo URL: %PR_URL%
echo Branch: %CURRENT_BRANCH% -^> main
echo Title: %COMMIT_MSG%
echo.
echo Next steps:
echo 1. Review PR on GitHub
echo 2. Address any review comments
echo 3. Merge when ready
