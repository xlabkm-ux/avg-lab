/**
 * API server entry point for AVG Codex Lab.
 *
 * Usage:
 *   npx tsx src/bin.ts
 *   or
 *   node --import tsx src/bin.ts
 */

import { createApiServer } from "./index";

const DEFAULT_PORT = 4000;

function getPort(): number {
  const envPort = process.env.AVG_API_PORT;
  if (envPort !== undefined) {
    const parsed = Number(envPort);
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return DEFAULT_PORT;
}

const port = getPort();
const server = createApiServer();

server.listen(port, () => {
  console.log(`AVG API server listening on http://localhost:${port}`);
  console.log(`  Health check: http://localhost:${port}/health`);
});

process.on("SIGINT", () => {
  console.log("\nShutting down API server...");
  server.close(() => {
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("\nShutting down API server...");
  server.close(() => {
    process.exit(0);
  });
});
