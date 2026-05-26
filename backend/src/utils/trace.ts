type TraceEventType = "DEPLOY" | "CONFIG_CHANGE" | "ERROR";

class TraceOps {
  private endpoint: string;
  private service: string;

  constructor(endpoint: string, service: string) {
    this.endpoint = endpoint.replace(/\/$/, "");
    this.service = service;
  }

  private async send(eventType: TraceEventType, payload: any) {
    const eventData = {
      eventType,
      serviceName: this.service,
      timestamp: Date.now(),
      ...payload,
    };

    try {
      const response = await fetch(`${this.endpoint}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      // Log response for debugging (only in development or if TRACE_DEBUG is set)
      if (process.env.NODE_ENV === "development" || process.env.TRACE_DEBUG === "true") {
        console.log(`[TraceOps] ${eventType} event sent:`, {
          status: response.status,
          statusText: response.statusText,
          service: this.service,
          endpoint: `${this.endpoint}/events`,
        });
      }

      // Log if response is not OK
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unable to read error");
        console.warn(`[TraceOps] Event send failed:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          eventType,
          service: this.service,
        });
      }
    } catch (error: any) {
      // Log errors for debugging (only in development or if TRACE_DEBUG is set)
      if (process.env.NODE_ENV === "development" || process.env.TRACE_DEBUG === "true") {
        console.error(`[TraceOps] Failed to send ${eventType} event:`, {
          error: error.message,
          code: error.code,
          service: this.service,
          endpoint: `${this.endpoint}/events`,
        });
      }
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

