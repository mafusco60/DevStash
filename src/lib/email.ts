import { Resend } from "resend";

const EMAIL_FROM =
  process.env.EMAIL_FROM ?? "DevStash <onboarding@resend.dev>";

let cachedClient: Resend | null = null;

function getClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY env var is required to send email");
  }
  if (!cachedClient) {
    cachedClient = new Resend(process.env.RESEND_API_KEY);
  }
  return cachedClient;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  const { data, error } = await getClient().emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html,
    ...(text ? { text } : {}),
  });

  if (error) {
    throw new Error(
      `Resend send failed: ${error.message ?? JSON.stringify(error)}`
    );
  }

  return data;
}
