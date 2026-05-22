import { describe, expect, it } from "vitest";
import { realtimeGatewayStatus } from "../src/index";

describe("realtime gateway smoke surface", () => {
  it("exposes a ready gateway status", () => {
    expect(realtimeGatewayStatus()).toEqual({ status: "ready", transport: "stub" });
  });
});
