import "server-only";
import { Resend } from "resend";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variable d'environnement manquante: ${name}`);
  }
  return value;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function sendConfirmationEmail(params: {
  to: string;
  name: string;
  token: string;
}) {
  const resend = new Resend(getEnv("RESEND_API_KEY"));
  const confirmUrl = `${getSiteUrl()}/confirmer/${params.token}`;

  await resend.emails.send({
    from: getEnv("RESEND_FROM_EMAIL"),
    to: params.to,
    subject: "Confirmez votre signature de la Charte #PlayGG",
    html: renderConfirmationEmail({ name: params.name, confirmUrl }),
  });
}

function renderConfirmationEmail({
  name,
  confirmUrl,
}: {
  name: string;
  confirmUrl: string;
}) {
  const escapedName = name.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] ?? c));
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: #161616;">
      <p style="font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #7F5CF9; font-weight: 700; margin: 0 0 8px;">#PlayGG</p>
      <h1 style="font-size: 20px; margin: 0 0 16px;">Bonjour ${escapedName},</h1>
      <p style="font-size: 15px; line-height: 1.5;">
        Merci de vous engager pour un esport mixte et responsable. Il ne reste
        qu'une étape&nbsp;: confirmez votre email pour que votre signature de
        la Charte #PlayGG soit effective.
      </p>
      <p style="margin: 28px 0;">
        <a href="${confirmUrl}" style="background: #FF5011; color: #FFFFFF; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-weight: 700; display: inline-block;">
          Confirmer ma signature
        </a>
      </p>
      <p style="font-size: 13px; color: rgba(22,22,22,0.6);">
        Ce lien expire dans 48 heures. Si vous n'êtes pas à l'origine de cette
        demande, ignorez simplement cet email.
      </p>
    </div>
  `;
}
