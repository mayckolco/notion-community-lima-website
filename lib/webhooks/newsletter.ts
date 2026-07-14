const NEWSLETTER_WEBHOOK_URL =
  "https://mayckolco.app.n8n.cloud/webhook/notion-lima-website";

const NEWSLETTER_TAG = "notion-lima-website";

export interface NewsletterWebhookPayload {
  nombre: string;
  email: string;
  etiqueta: string;
  location?: string;
}

export async function sendNewsletterWebhook(
  payload: Omit<NewsletterWebhookPayload, "etiqueta">
): Promise<void> {
  const body = JSON.stringify({
    nombre: payload.nombre.normalize("NFC"),
    email: payload.email,
    etiqueta: NEWSLETTER_TAG,
    ...(payload.location ? { location: payload.location } : {}),
  });

  const res = await fetch(NEWSLETTER_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json; charset=utf-8",
    },
    body: new TextEncoder().encode(body),
  });

  if (!res.ok) {
    throw new Error(`Newsletter webhook failed: ${res.status}`);
  }
}
