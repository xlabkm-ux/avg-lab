#!/usr/bin/env pwsh
# AVG Lab - Quality Gate Check
# Runs all quality gates before committing or creating a PR

param(
    [switch]$SkipTest,
    [switch]$SkipBuild,
    [switch]$Quick
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AVG Lab Quality Gate Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$startTime = Get-Date

# Step 1: Install dependencies
Write-Host "[1/6] Installing dependencies..." -ForegroundColor Yellow
pnpm install --frozen-lockfile
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Dependency installation failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 2: Lint
Write-Host "[2/6] Running ESLint + TypeScript check..." -ForegroundColor Yellow
pnpm lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Linting failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Typecheck
Write-Host "[3/6] Running type check..." -ForegroundColor Yellow
pnpm typecheck
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Type check failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 4: Tests
if (-not $SkipTest) {
    Write-Host "[4/6] Running tests..." -ForegroundColor Yellow
    pnpm test
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Tests failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[4/6] Skipping tests (--SkipTest)" -ForegroundColor Gray
}
Write-Host ""

# Step 5: Contract tests
if (-not $Quick) {
    Write-Host "[5/6] Running contract tests..." -ForegroundColor Yellow
    pnpm test:contract
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Contract tests failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[5/6] Skipping contract tests (--Quick)" -ForegroundColor Gray
}
Write-Host ""

# Step 6: Build
if (-not $SkipBuild) {
    Write-Host "[6/6] Building all packages..." -ForegroundColor Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Build failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[6/6] Skipping build (--SkipBuild)" -ForegroundColor Gray
}
Write-Host ""

$endTime = Get-Date
$duration = ($endTime - $startTime).TotalSeconds

Write-Host "========================================" -ForegroundColor Green
Write-Host "All quality gates passed!" -ForegroundColor Green
Write-Host "Duration: $([math]::Round($duration, 2))s" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
