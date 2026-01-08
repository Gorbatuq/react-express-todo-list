export type Envelope<T = unknown> = { data: T; requestId?: string };

export function unwrapEnvelope(payload: unknown): {
  data: unknown;
  requestId?: string;
} {
  if (payload && typeof payload === "object" && "data" in payload) {
    const env = payload as Envelope;
    return { data: env.data, requestId: env.requestId };
  }
  return { data: payload };
}
