#!/usr/bin/env pwsh
# AVG Lab - Branch and PR Helper
# Creates a properly named branch and optionally opens a PR

param(
    [Parameter(Mandatory=$true)]
    [string]$Role,

    [Parameter(Mandatory=$true)]
    [string]$TicketId,

    [Parameter(Mandatory=$true)]
    [string]$Slug,

    [switch]$CreatePR,
    [string]$PRDescription
)

$ErrorActionPreference = "Stop"

# Validate role
$validRoles = @("frontend", "backend", "validation", "qa", "security", "product", "docs", "refactor")
if ($Role -notin $validRoles) {
    Write-Host "ERROR: Invalid role '$Role'. Must be one of: $($validRoles -join ', ')" -ForegroundColor Red
    exit 1
}

# Generate branch name
$branchName = "agent/$Role/$TicketId-$Slug"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AVG Lab Branch & PR Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check for uncommitted changes
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "WARNING: You have uncommitted changes. Commit or stash them first." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Uncommitted files:" -ForegroundColor Yellow
    git status --short
    exit 1
}

# Create and checkout branch
Write-Host "Creating branch: $branchName" -ForegroundColor Yellow
git checkout -b $branchName

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to create branch" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Branch created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Make your changes" -ForegroundColor White
Write-Host "  2. Commit with conventional commit message:" -ForegroundColor White
Write-Host "     git add ." -ForegroundColor Gray
Write-Host "     git commit -m `"$Role($TicketId): your change description`"" -ForegroundColor Gray
Write-Host "  3. Push and optionally create PR:" -ForegroundColor White
Write-Host "     git push -u origin $branchName" -ForegroundColor Gray

if ($CreatePR) {
    Write-Host ""
    Write-Host "Creating PR..." -ForegroundColor Yellow

    # Check if gh CLI is available
    $ghAvailable = Get-Command gh -ErrorAction SilentlyContinue
    if (-not $ghAvailable) {
        Write-Host "ERROR: GitHub CLI (gh) is not installed" -ForegroundColor Red
        exit 1
    }

    # Create PR body from template
    $prBody = @"
## Purpose

$PRDescription

## Changed Areas

- TODO: List changed areas

## Tests Run

- [x] pnpm lint
- [x] pnpm typecheck
- [x] pnpm test
- [x] pnpm build

## Risks

TODO: Document risks

## Rollback Plan

TODO: Document rollback plan

## Affected Agents

TODO: List affected agents

## Migration Notes

TODO: Add migration notes if applicable

🤖 Generated with [Qoder](https://qoder.com)
"@

    # Create PR
    gh pr create --title "$Role($TicketId): $Slug" --body $prBody

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "PR created successfully!" -ForegroundColor Green
    }
}

Write-Host ""
