#!/usr/bin/env bash
# ============================================================
# AVG Lab — Остановка всех серверов приложения
# Unix/Linux/Mac/WSL shell script
# ============================================================
# Находит и завершает все процессы:
#   - turbo (turbo daemon)
#   - vite (web dev server)
#   - node (API, worker, realtime-gateway)
# ============================================================

set -e

echo ""
echo "========================================"
echo "  AVG Lab: Остановка всех серверов"
echo "========================================"
echo ""

# 1. Останавливаем turbo daemon
echo "[1/4] Остановка turbo daemon..."
if command -v npx &> /dev/null; then
    npx turbo daemon stop 2>/dev/null && echo "  turbo daemon остановлен" || echo "  turbo daemon не запущен или уже остановлен"
else
    echo "  npx не найден, пропускаем"
fi
echo ""

# 2. Ищем PID-ы процессов
echo "[2/4] Поиск процессов..."

FOUND_PIDS=""
FOUND_COUNT=0

# Ищем vite процессы
VITE_PIDS=$(pgrep -f "vite" 2>/dev/null || true)
if [ -n "$VITE_PIDS" ]; then
    echo "  Найдены Vite процессы: $VITE_PIDS"
    FOUND_PIDS="$VITE_PIDS"
    FOUND_COUNT=$((FOUND_COUNT + $(echo "$VITE_PIDS" | wc -l)))
fi

# Ищем turbo процессы
TURBO_PIDS=$(pgrep -f "turbo" 2>/dev/null || true)
if [ -n "$TURBO_PIDS" ]; then
    echo "  Найдены Turbo процессы: $TURBO_PIDS"
    if [ -n "$FOUND_PIDS" ]; then
        FOUND_PIDS="$FOUND_PIDS"$'\n'"$TURBO_PIDS"
    else
        FOUND_PIDS="$TURBO_PIDS"
    fi
    FOUND_COUNT=$((FOUND_COUNT + $(echo "$TURBO_PIDS" | wc -l)))
fi

# Ищем node процессы в директории avg-lab
NODE_PIDS=$(pgrep -f "node.*avg" 2>/dev/null || true)
if [ -n "$NODE_PIDS" ]; then
    echo "  Найдены Node процессы: $NODE_PIDS"
    if [ -n "$FOUND_PIDS" ]; then
        FOUND_PIDS="$FOUND_PIDS"$'\n'"$NODE_PIDS"
    else
        FOUND_PIDS="$NODE_PIDS"
    fi
    FOUND_COUNT=$((FOUND_COUNT + $(echo "$NODE_PIDS" | wc -l)))
fi

if [ "$FOUND_COUNT" -eq 0 ]; then
    echo "  Процессы не найдены"
    echo ""
    echo "========================================"
    echo "  Все серверы уже остановлены"
    echo "========================================"
    echo ""
    exit 0
fi

echo ""
echo "  Всего найдено процессов: $FOUND_COUNT"
echo ""

# 3. Завершаем процессы
echo "[3/4] Завершение процессов..."

# Уникальные PID-ы
UNIQUE_PIDS=$(echo "$FOUND_PIDS" | sort -u)

for PID in $UNIQUE_PIDS; do
    if kill -0 "$PID" 2>/dev/null; then
        echo "  PID $PID: завершение..."
        kill "$PID" 2>/dev/null || true
        sleep 0.5
        # Проверяем, завершился ли процесс
        if kill -0 "$PID" 2>/dev/null; then
            echo "  PID $PID: принудительное завершение..."
            kill -9 "$PID" 2>/dev/null || true
        fi
    fi
done

echo "  Процессы завершены"
echo ""

# 4. Освобождаем порты
echo "[4/4] Проверка портов..."

# Проверяем порт 5173 (Vite)
PORT_5173_PID=$(lsof -ti:5173 2>/dev/null || true)
if [ -n "$PORT_5173_PID" ]; then
    echo "  Порт 5173 занят PID $PORT_5173_PID, завершение..."
    kill -9 "$PORT_5173_PID" 2>/dev/null || true
else
    echo "  Порт 5173 свободен"
fi

# Проверяем порт 3000 (API)
PORT_3000_PID=$(lsof -ti:3000 2>/dev/null || true)
if [ -n "$PORT_3000_PID" ]; then
    echo "  Порт 3000 занят PID $PORT_3000_PID, завершение..."
    kill -9 "$PORT_3000_PID" 2>/dev/null || true
else
    echo "  Порт 3000 свободен"
fi

echo ""
echo "========================================"
echo "  Все серверы остановлены"
echo "========================================"
echo ""
