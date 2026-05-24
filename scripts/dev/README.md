# scripts/dev

Operational scripts for development.

## Остановка серверов

### Одной командой (все платформы)

```bash
pnpm stop
```

### Напрямую

**Windows:**
```cmd
scripts\dev\stop-all.bat
```

**Linux/Mac/WSL:**
```bash
bash scripts/dev/stop-all.sh
```

### Что делает скрипт

1. Останавливает `turbo daemon`
2. Находит все node/vite/turbo процессы
3. Завершает их (soft → hard)
4. Освобождает порты 5173 (Vite) и 3000 (API)
5. Проверяет, что процессы действительно остановлены

### Ручная остановка

Если скрипт не сработал:

**Windows (PowerShell):**
```powershell
# Показать все node процессы
Get-Process -Name node | Select-Object Id, ProcessName, StartTime

# Остановить все node процессы
Get-Process -Name node | Stop-Process -Force
```

**Linux/Mac:**
```bash
# Показать процессы на портах
lsof -i :5173,:3000

# Остановить по PID
kill -9 <PID>
```
