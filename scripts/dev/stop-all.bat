@echo off
REM ============================================================
REM AVG Lab — Остановка всех серверов приложения
REM Windows batch script
REM ============================================================
REM Находит и завершает все процессы:
REM   - turbo (turbo daemon)
REM   - vite (web dev server)
REM   - node (API, worker, realtime-gateway)
REM ============================================================

echo.
echo ========================================
echo   AVG Lab: Остановка всех серверов
echo ========================================
echo.

REM 1. Останавливаем turbo daemon
echo [1/3] Остановка turbo daemon...
call npx turbo daemon stop 2>nul
if %errorlevel% equ 0 (
    echo   turbo daemon остановлен
) else (
    echo   turbo daemon не запущен или уже остановлен
)
echo.

REM 2. Ищем и завершаем процессы по именам
echo [2/3] Завершение процессов dev-серверов...

set "FOUND=0"

REM Ищем vite.exe (Vite dev server)
tasklist /FI "IMAGENAME eq node.exe" 2>nul | find /I "node.exe" >nul
if %errorlevel% equ 0 (
    echo   Найдены node.exe процессы...
    REM Показываем PID-ы для информации
    for /f "tokens=2" %%a in ('tasklist /FI "IMAGENAME eq node.exe" /NH /FO CSV') do (
        set "FOUND=1"
    )
    REM Завершаем все node процессы, связанные с avg-lab
    echo   Завершение node процессов...
    taskkill /F /IM node.exe /T 2>nul
    if %errorlevel% equ 0 (
        echo   node процессы завершены
    ) else (
        echo   node процессы не найдены или нет прав
    )
)
echo.

REM 3. Очищаем порты (если остались зависшие)
echo [3/3] Проверка портов...

REM Проверяем порт 5173 (Vite)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do (
    echo   Порт 5173 занят PID %%a, завершение...
    taskkill /F /PID %%a >nul 2>&1
)

REM Проверяем порт 3000 (API)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    echo   Порт 3000 занят PID %%a, завершение...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ========================================
echo   Все серверы остановлены
echo ========================================
echo.

REM Проверяем, остались ли node процессы
tasklist /FI "IMAGENAME eq node.exe" /NH 2>nul | find /I "node.exe" >nul
if %errorlevel% equ 0 (
    echo ВНИМАНИЕ: Остались node процессы:
    tasklist /FI "IMAGENAME eq node.exe" /FO TABLE
    echo.
    echo Для принудительной остановки всех node:
    echo   taskkill /F /IM node.exe /T
) else (
    echo OK: Node процессы не обнаружены
)
echo.
pause
