type TraceEventType = "DEPLOY" | "CONFIG_CHANGE" | "ERROR";

class TraceOps {
  private endpoint: string;
  private service: string;

  constructor(endpoint: string, service: string) {
    this.endpoint = endpoint.replace(/\/$/, "");
    this.service = service;
  }

  private async send(eventType: TraceEventType, payload: any) {
    try {
      await fetch(`${this.endpoint}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType,
          serviceName: this.service,
          timestamp: Date.now(),
          ...payload,
        }),
      });
    } catch {
      // Observability must never crash backend
    }
  }

  deploy(metadata?: Record<string, any>) {
    return this.send("DEPLOY", {
      message: "Backend server started",
      metadata,
    });
  }

  configChange(message: string, metadata?: Record<string, any>) {
    return this.send("CONFIG_CHANGE", { message, metadata });
  }

  error(message: string, metadata?: Record<string, any>) {
    return this.send("ERROR", { message, metadata });
  }
}

export const trace = new TraceOps(
  "https://traceops.onrender.com",
  "plinko-challenge"
);

