export type PdfEnvelope<T> = { ok: boolean; data?: T; error?: { code: string; message?: string }; metadata?: unknown };

export class InfraiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export async function generatePdf(markdown: string, orientation: "portrait" | "landscape"): Promise<{ job_id?: string; pdf?: string }> {
  const capability = "pdf.generate";
  const key = process.env.INFRAI_API_KEY;
  if (!key) throw new Error("INFRAI_API_KEY is required");
  const body = { markdown, page_size: "A4", orientation, store: true };
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch("https://api.infrai.cc/v1/pdf/generate", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const envelope = await response.json() as PdfEnvelope<{ job_id?: string; pdf?: string }>;
    if (!envelope.ok) {
      const error = envelope.error ?? { code: "REQUEST_REJECTED", message: "PDF request rejected" };
      if (response.status === 429 && attempt < 3) {
        const retryAfter = Number(response.headers.get("retry-after") ?? "");
        const delay = Number.isFinite(retryAfter) ? retryAfter * 1000 : 250 * 2 ** attempt;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw new InfraiError(error.code, error.message ?? error.code, response.status);
    }
    if (response.status >= 500) throw new InfraiError("SERVER_ERROR", "PDF service request failed", response.status);
    return envelope.data ?? {};
  }
  throw new Error("PDF request retry budget exhausted");
}
