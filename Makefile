.PHONY: setup dev test quality

setup:
	pnpm install

dev:
	pnpm dev

test:
	pnpm test

quality:
	pnpm lint && pnpm typecheck && pnpm test && pnpm build
