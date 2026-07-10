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
  const from = process.env.RESEND_FROM_EMAIL ?? "Claude Perú <hola@mayckolco.com>";
  await getResend().emails.send({
    from,
    to: params.to,
    subject: "Confirma tu postulación como Speaker [Claude Perú]",
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

          <!-- Header centrado -->
          <tr>
            <td align="center" style="padding-bottom:28px;border-bottom:1px solid #27272a;">
              <p style="margin:0;color:#52525b;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;text-align:center;">
                CLAUDE PERÚ
              </p>
            </td>
          </tr>

          <!-- Card -->
          <tr><td style="padding:32px 0 0;">
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border:1px solid #27272a;background:#18181b;padding:40px;">
              <tr>
                <td>
                  <!-- Saludo -->
                  <p style="margin:0 0 16px;color:#fafafa;font-size:16px;font-weight:700;line-height:1.5;">
                    Hola ${escHtml(nombre)},
                  </p>

                  <p style="margin:0 0 16px;color:#71717a;font-size:14px;line-height:1.8;">
                    ¡Gracias por aplicar como speaker!<br/>
                    Ya recibimos tu información correctamente para compartir el
                    <strong style="color:#a1a1aa;">${escHtml(slotLabel)} (martes 7–8 pm)</strong>.
                  </p>

                  <p style="margin:0 0 28px;color:#71717a;font-size:14px;line-height:1.8;">
                    Para completar tu postulación, solo necesitas dar clic en el siguiente botón:
                  </p>

                  <!-- CTA -->
                  <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                    <tr>
                      <td style="background:#fafafa;">
                        <a href="${verifyUrl}"
                           style="display:inline-block;padding:13px 32px;color:#09090b;font-size:13px;
                                  font-weight:700;text-decoration:none;letter-spacing:0.08em;
                                  text-transform:uppercase;">
                          Confirmar
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0 0 28px;color:#71717a;font-size:14px;line-height:1.8;">
                    Esto nos permitirá revisar tu propuesta y ponernos en contacto contigo.
                  </p>

                  <p style="margin:0 0 28px;color:#71717a;font-size:14px;line-height:1.8;">
                    ¡Estamos emocionados de conocer lo que quieres compartir!
                  </p>

                  <p style="margin:0 0 28px;color:#a1a1aa;font-size:14px;line-height:1.8;">
                    Un abrazo,<br/>
                    <strong style="color:#fafafa;">Equipo Claude Perú</strong>
                  </p>

                  <hr style="border:none;border-top:1px solid #27272a;margin:0 0 20px;" />

                  <p style="margin:0 0 12px;color:#3f3f46;font-size:11px;line-height:1.8;">
                    Si no solicitaste esto, ignora este correo.
                  </p>
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="border:1px solid #3f3f46;">
                        <a href="${verifyUrl}"
                           style="display:inline-block;padding:8px 20px;color:#71717a;font-size:11px;
                                  text-decoration:none;letter-spacing:0.05em;">
                          Ver link de confirmación
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td></tr>


        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

interface SendMagicLinkParams {
  to: string;
  nombre: string;
  magicUrl: string;
}

export async function sendMagicLinkEmail(params: SendMagicLinkParams): Promise<void> {
  const from = process.env.RESEND_FROM_EMAIL ?? "Claude Perú <hola@mayckolco.com>";
  await getResend().emails.send({
    from,
    to: params.to,
    subject: "Tu acceso al portal de Speaker · Claude Perú",
    html: buildMagicLinkHtml(params),
  });
}

function buildMagicLinkHtml({ nombre, magicUrl }: SendMagicLinkParams): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Acceso a tu portal de Speaker</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:ui-monospace,'JetBrains Mono',monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td align="center" style="padding-bottom:28px;border-bottom:1px solid #27272a;">
              <p style="margin:0;color:#52525b;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;text-align:center;">
                CLAUDE PERÚ
              </p>
            </td>
          </tr>
          <tr><td style="padding:32px 0 0;">
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border:1px solid #27272a;background:#18181b;padding:40px;">
              <tr>
                <td>
                  <p style="margin:0 0 16px;color:#fafafa;font-size:16px;font-weight:700;line-height:1.5;">
                    Hola ${escHtml(nombre)},
                  </p>
                  <p style="margin:0 0 16px;color:#71717a;font-size:14px;line-height:1.8;">
                    Solicitaste acceso a tu portal de speaker. Haz clic en el siguiente botón para ingresar:
                  </p>
                  <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                    <tr>
                      <td style="background:#fafafa;">
                        <a href="${magicUrl}"
                           style="display:inline-block;padding:13px 32px;color:#09090b;font-size:13px;
                                  font-weight:700;text-decoration:none;letter-spacing:0.08em;
                                  text-transform:uppercase;">
                          Ingresar al portal
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:0 0 16px;color:#52525b;font-size:12px;line-height:1.8;">
                    Este link expira en 15 minutos. Si no lo solicitaste, ignora este correo.
                  </p>
                  <hr style="border:none;border-top:1px solid #27272a;margin:20px 0;" />
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="border:1px solid #3f3f46;">
                        <a href="${magicUrl}"
                           style="display:inline-block;padding:8px 20px;color:#71717a;font-size:11px;
                                  text-decoration:none;letter-spacing:0.05em;">
                          Ver link de acceso
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td></tr>
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
