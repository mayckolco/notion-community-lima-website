import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  _resend = new Resend(key);
  return _resend;
}

interface SendVerificationParams {
  to: string;
  nombre: string;
  verifyUrl: string;
  slotLabel: string;
}

export async function sendVerificationEmail(params: SendVerificationParams): Promise<void> {
  const from = process.env.RESEND_FROM_EMAIL ?? "AI First Founders <noreply@aifirstfounders.com>";
  await getResend().emails.send({
    from,
    to: params.to,
    subject: "Confirma tu postulación como Speaker — AI First Founders",
    html: buildEmailHtml(params),
  });
}

function buildEmailHtml({ nombre, verifyUrl, slotLabel }: SendVerificationParams): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirma tu postulación</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:ui-monospace,'JetBrains Mono',monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <tr>
            <td style="padding-bottom:28px;border-bottom:1px solid #27272a;">
              <p style="margin:0;color:#52525b;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;">
                AI FIRST FOUNDERS
              </p>
            </td>
          </tr>

          <tr><td style="padding:32px 0 0;">
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border:1px solid #27272a;background:#18181b;padding:40px;">
              <tr>
                <td>
                  <p style="margin:0 0 4px;color:#52525b;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;">
                    Postulación pendiente
                  </p>
                  <h1 style="margin:0 0 20px;color:#fafafa;font-size:22px;font-weight:900;letter-spacing:-0.02em;line-height:1.2;">
                    Hola ${escHtml(nombre)},<br/>confirma tu lugar
                  </h1>

                  <p style="margin:0 0 8px;color:#71717a;font-size:13px;line-height:1.7;">
                    Recibimos tu postulación para hablar el
                    <strong style="color:#a1a1aa;">${escHtml(slotLabel)}</strong>
                    (martes 7–8 pm).
                  </p>
                  <p style="margin:0 0 32px;color:#71717a;font-size:13px;line-height:1.7;">
                    Para reservar tu fecha, haz clic en el botón.
                    El link es válido por <strong style="color:#a1a1aa;">24 horas</strong>.
                  </p>

                  <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                    <tr>
                      <td style="background:#fafafa;">
                        <a href="${verifyUrl}"
                           style="display:inline-block;padding:13px 28px;color:#09090b;font-size:12px;
                                  font-weight:700;text-decoration:none;letter-spacing:0.08em;
                                  text-transform:uppercase;">
                          Confirmar postulación &rarr;
                        </a>
                      </td>
                    </tr>
                  </table>

                  <hr style="border:none;border-top:1px solid #27272a;margin:0 0 24px;" />

                  <p style="margin:0;color:#3f3f46;font-size:11px;line-height:1.8;">
                    Si no solicitaste esto, ignora este correo.<br/>
                    Link completo:<br/>
                    <span style="color:#52525b;word-break:break-all;">${verifyUrl}</span>
                  </p>
                </td>
              </tr>
            </table>
          </td></tr>

          <tr>
            <td style="padding-top:24px;">
              <p style="margin:0;color:#3f3f46;font-size:10px;letter-spacing:0.05em;">
                AI First Founders &mdash; Martes 7&ndash;8 pm
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
