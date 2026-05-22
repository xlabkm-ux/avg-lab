export interface WorkerHeartbeat {
  status: "idle";
  queue: "avg-worker";
}

export function workerHeartbeat(): WorkerHeartbeat {
  return {
    status: "idle",
    queue: "avg-worker"
  };
}
