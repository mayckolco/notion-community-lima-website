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

export async function sendCommunityMagicLinkEmail(params: SendMagicLinkParams): Promise<void> {
  const from = process.env.RESEND_FROM_EMAIL ?? "Claude Perú <hola@mayckolco.com>";
  await getResend().emails.send({
    from,
    to: params.to,
    subject: "Confirma tu perfil en la comunidad · Claude Perú",
    html: buildCommunityMagicLinkHtml(params),
  });
}

function buildCommunityMagicLinkHtml({ nombre, magicUrl }: SendMagicLinkParams): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirma tu perfil en la comunidad</title>
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
                    Confirma tu perfil para aparecer en el mapa de la comunidad de Claude Perú:
                  </p>
                  <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                    <tr>
                      <td style="background:#fafafa;">
                        <a href="${magicUrl}"
                           style="display:inline-block;padding:13px 32px;color:#09090b;font-size:13px;
                                  font-weight:700;text-decoration:none;letter-spacing:0.08em;
                                  text-transform:uppercase;">
                          Confirmar perfil
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:0 0 16px;color:#52525b;font-size:12px;line-height:1.8;">
                    Este link expira en 15 minutos. Si no lo solicitaste, ignora este correo.
                  </p>
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

interface SendNewsletterWelcomeParams {
  to: string;
  nombre?: string;
}

export async function sendNewsletterWelcomeEmail(
  params: SendNewsletterWelcomeParams
): Promise<void> {
  const from = process.env.RESEND_FROM_EMAIL ?? "Claude Perú <hola@mayckolco.com>";
  const greeting = params.nombre ? escHtml(params.nombre) : "builder";

  await getResend().emails.send({
    from,
    to: params.to,
    subject: "Bienvenido a las novedades de Claude Perú",
    html: `<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:40px 20px;background:#F5F1EB;font-family:sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #EDE6DA;border-radius:12px;padding:32px;">
    <p style="margin:0 0 8px;color:#D97757;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;">Claude Perú</p>
    <h1 style="margin:0 0 16px;color:#2B2622;font-size:22px;">¡Gracias por suscribirte!</h1>
    <p style="margin:0 0 16px;color:#6B6560;font-size:15px;line-height:1.6;">
      Hola ${greeting}, te avisaremos sobre próximos eventos, lanzamientos de Claude y recursos nuevos de la comunidad.
    </p>
    <p style="margin:0 0 24px;color:#6B6560;font-size:15px;line-height:1.6;">
      Mientras tanto, únete al grupo de WhatsApp para no perderte ningún webinar.
    </p>
    <a href="https://chat.whatsapp.com/CvBaizXWjtZCstUgXlJqi3"
       style="display:inline-block;padding:12px 24px;background:#D97757;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
      Unirme a la comunidad
    </a>
  </div>
</body>
</html>`,
  });
}

export async function addNewsletterContact(
  email: string,
  nombre?: string
): Promise<void> {
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) return;

  const [firstName, ...rest] = (nombre ?? "").trim().split(/\s+/).filter(Boolean);
  const lastName = rest.join(" ") || undefined;

  await getResend().contacts.create({
    audienceId,
    email,
    ...(firstName ? { firstName } : {}),
    ...(lastName ? { lastName } : {}),
    unsubscribed: false,
  });
}
