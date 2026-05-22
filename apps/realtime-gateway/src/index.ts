export interface RealtimeGatewayStatus {
  status: "ready";
  transport: "stub";
}

export function realtimeGatewayStatus(): RealtimeGatewayStatus {
  return {
    status: "ready",
    transport: "stub"
  };
}
