#!/usr/bin/env pwsh
# AVG Lab - Sprint Status Checker
# Shows current sprint status and quality gate health

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AVG Lab Sprint Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check git branch
$currentBranch = git branch --show-current
Write-Host "Current Branch: $currentBranch" -ForegroundColor White

# Check for uncommitted changes
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "Uncommitted Changes: YES" -ForegroundColor Yellow
    Write-Host ""
    git status --short | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
} else {
    Write-Host "Uncommitted Changes: NO" -ForegroundColor Green
}
Write-Host ""

# Show sprint backlog
$sprintBacklog = Join-Path $PSScriptRoot "..\.qoder\war-room\sprint-backlog.md"
if (Test-Path $sprintBacklog) {
    Write-Host "Active Sprint Tasks:" -ForegroundColor Yellow
    Get-Content $sprintBacklog | Where-Object { $_ -match "AVG-\d+" -and $_ -match "\|" } | ForEach-Object {
        $parts = $_ -split '\|'
        if ($parts.Count -ge 7) {
            $taskId = $parts[1].Trim()
            $taskDesc = $parts[6].Trim()
            $taskStatus = $parts[7].Trim()
            $color = if ($taskStatus -match "✅") { "Green" } elseif ($taskStatus -match "pending") { "Gray" } else { "Yellow" }
            Write-Host "  $taskId - $taskStatus $taskDesc" -ForegroundColor $color
        }
    }
}
Write-Host ""

# Quality gate summary
Write-Host "Quality Gate Status:" -ForegroundColor Yellow

# Run quick checks
$checks = @(
    @{ Name = "Dependencies"; Command = "pnpm install --frozen-lockfile" },
    @{ Name = "TypeScript"; Command = "pnpm typecheck" }
)

foreach ($check in $checks) {
    Write-Host "  Checking $($check.Name)..." -ForegroundColor Gray -NoNewline
    $output = & pnpm $check.Command.Split(" ") 2>&1
    $success = $LASTEXITCODE -eq 0

    if ($success) {
        Write-Host " PASS" -ForegroundColor Green
    } else {
        Write-Host " FAIL" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "For full quality gate check, run:" -ForegroundColor Cyan
Write-Host "  .\scripts\quality-check.ps1" -ForegroundColor Gray
Write-Host ""
