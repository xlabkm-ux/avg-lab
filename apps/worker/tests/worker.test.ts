import { describe, expect, it } from "vitest";
import { workerHeartbeat } from "../src/index";

describe("worker smoke surface", () => {
  it("exposes an idle heartbeat", () => {
    expect(workerHeartbeat()).toEqual({ status: "idle", queue: "avg-worker" });
  });
});
