#!/bin/bash
#
# Auto-create PR from current branch using project template
# Usage: ./scripts/dev/create-pr.sh
#
# Prerequisites:
#   - gh CLI installed and authenticated
#   - On a feature branch (not main)
#   - At least one commit ahead of main
#

set -euo pipefail

# Configuration
GITHUB_REPO="xlabkm-ux/avg-lab"
BASE_BRANCH="main"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== AVG Lab PR Creator ===${NC}"

# Check gh CLI
if ! command -v gh &>/dev/null; then
  echo -e "${RED}Error: gh CLI not installed${NC}"
  echo "Install from: https://cli.github.com/"
  exit 1
fi

# Check authentication
if ! gh auth status &>/dev/null; then
  echo -e "${RED}Error: gh not authenticated${NC}"
  echo "Run: gh auth login"
  exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

if [ "$CURRENT_BRANCH" = "main" ]; then
  echo -e "${RED}Error: Cannot create PR from main branch${NC}"
  exit 1
fi

# Extract ticket ID and slug from branch name
# Format: agent/<role>/<ticket>-<slug>
if [[ "$CURRENT_BRANCH" =~ ^agent/.+/([A-Z]+-[0-9]+)-(.+)$ ]]; then
  TICKET_ID="${BASH_REMATCH[1]}"
  SLUG="${BASH_REMATCH[2]}"
else
  TICKET_ID=""
  SLUG="$CURRENT_BRANCH"
fi

echo "Branch: $CURRENT_BRANCH"
echo "Ticket: ${TICKET_ID:-unknown}"
echo "Base: $BASE_BRANCH"

# Check if PR already exists
EXISTING_PR=$(gh pr list --head "$CURRENT_BRANCH" --json number --jq '.[0].number' 2>/dev/null || echo "")

if [ -n "$EXISTING_PR" ]; then
  echo -e "${YELLOW}PR #$EXISTING_PR already exists${NC}"
  echo "URL: https://github.com/$GITHUB_REPO/pull/$EXISTING_PR"
  exit 0
fi

# Get last commit message
COMMIT_MSG=$(git log -1 --pretty=format:"%s")
COMMIT_BODY=$(git log -1 --pretty=format:"%b")

# Build PR title from commit subject
PR_TITLE="$COMMIT_MSG"

# Build PR body from commit body + template
PR_BODY="$COMMIT_BODY"

# Push branch if not pushed
if ! git rev-parse --abbrev-ref --symbolic-full-name @{u} &>/dev/null; then
  echo "Pushing branch to remote..."
  git push -u origin "$CURRENT_BRANCH"
fi

echo "Creating PR..."

# Create PR
PR_URL=$(gh pr create \
  --base "$BASE_BRANCH" \
  --head "$CURRENT_BRANCH" \
  --title "$PR_TITLE" \
  --body "$PR_BODY")

echo -e "${GREEN}PR created: $PR_URL${NC}"

# Output summary
echo ""
echo "=== PR Summary ==="
echo "URL: $PR_URL"
echo "Branch: $CURRENT_BRANCH -> $BASE_BRANCH"
echo "Title: $PR_TITLE"
echo ""
echo "Next steps:"
echo "1. Review PR on GitHub"
echo "2. Address any review comments"
echo "3. Merge when ready"
