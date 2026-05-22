.PHONY: setup dev test quality pr commit-and-pr

setup:
	pnpm install

dev:
	pnpm dev

test:
	pnpm test

quality:
	pnpm lint && pnpm typecheck && pnpm test && pnpm build

# Create PR from current branch (cross-platform)
pr:
	@if [ -f "scripts/dev/create-pr.sh" ]; then \
		bash scripts/dev/create-pr.sh; \
	elif [ -f "scripts/dev/create-pr.bat" ]; then \
		cmd //c scripts\\dev\\create-pr.bat; \
	else \
		echo "Error: No PR script found"; \
		exit 1; \
	fi

# Commit all changes and automatically create PR
commit-and-pr:
ifndef MSG
	$(error MSG is required. Usage: make commit-and-pr MSG="feat: add feature")
endif
	git add -A
	git commit -m "$(MSG)"
	@if [ -f "scripts/dev/create-pr.sh" ]; then \
		bash scripts/dev/create-pr.sh; \
	elif [ -f "scripts/dev/create-pr.bat" ]; then \
		cmd //c scripts\\dev\\create-pr.bat; \
	else \
		echo "Error: No PR script found"; \
		exit 1; \
	fi
