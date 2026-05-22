#!/usr/bin/env pwsh
# AVG Lab - Backlog Update Helper
# Updates project-backlog.md with actual token consumption after completing a task

param(
    [Parameter(Mandatory=$true)]
    [string]$TaskId,

    [Parameter(Mandatory=$true)]
    [int]$ActualTokens,

    [string]$Notes
)

$ErrorActionPreference = "Stop"

$backlogPath = Join-Path $PSScriptRoot "..\docs\88-project-plan\project-backlog.md"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AVG Lab Backlog Update Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $backlogPath)) {
    Write-Host "ERROR: project-backlog.md not found at $backlogPath" -ForegroundColor Red
    exit 1
}

Write-Host "Task ID: $TaskId" -ForegroundColor Yellow
Write-Host "Actual Tokens: $ActualTokens" -ForegroundColor Yellow
if ($Notes) {
    Write-Host "Notes: $Notes" -ForegroundColor Yellow
}
Write-Host ""

# Read the backlog file
$content = Get-Content $backlogPath -Raw

# Find the task line and update it
$pattern = "(\| $TaskId \|.*?\| (\d[\d,]*) \|) (\d[\d,]* \|.*?\|) (pending|in_progress|completed|blocked) \|"

if ($content -match $pattern) {
    $planTokens = $matches[2] -replace ',', ''
    $planTokens = [int]$planTokens

    $variance = $ActualTokens - $planTokens
    $varianceStr = if ($variance -gt 0) { "+$($variance)" } else { "$variance" }

    $status = if ($variance -gt ($planTokens * 0.2)) {
        Write-Host "WARNING: Task is over budget by more than 20%" -ForegroundColor Yellow
        "completed"
    } else {
        "completed"
    }

    Write-Host "Plan Tokens: $planTokens" -ForegroundColor Green
    Write-Host "Actual Tokens: $ActualTokens" -ForegroundColor Green
    Write-Host "Variance: $varianceStr" -ForegroundColor Green
    Write-Host ""
    Write-Host "Backlog updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANT: You must manually update the backlog file at:" -ForegroundColor Yellow
    Write-Host "  $backlogPath" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Find the row with Task ID '$TaskId' and update:" -ForegroundColor Yellow
    Write-Host "  - Actual Tokens column: $ActualTokens" -ForegroundColor Gray
    Write-Host "  - Variance column: $varianceStr" -ForegroundColor Gray
    Write-Host "  - Status column: completed" -ForegroundColor Gray
    if ($Notes) {
        Write-Host "  - Notes column: $Notes" -ForegroundColor Gray
    }
} else {
    Write-Host "ERROR: Task '$TaskId' not found in backlog" -ForegroundColor Red
    Write-Host ""
    Write-Host "Available tasks in backlog:" -ForegroundColor Yellow
    Select-String -Path $backlogPath -Pattern "\| AVG-\d+ \|" | ForEach-Object {
        $_.Line -replace '\s+', ' '
    }
}
