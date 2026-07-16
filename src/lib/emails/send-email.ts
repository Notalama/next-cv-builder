import { ServerClient } from "postmark";
import { isFeatureEnabled } from "@/lib/features/flags";
import type { SendEmailPayload } from "@/models/email";

let postmarkClient: ServerClient | undefined;

function getPostmarkClient(): ServerClient {
  const token = process.env.POSTMARK_SERVER_TOKEN;
  if (!token) {
    throw new Error(
      "POSTMARK_SERVER_TOKEN is required when ENABLE_POSTMARK=true.",
    );
  }

  postmarkClient ??= new ServerClient(token);
  return postmarkClient;
}

export async function sendEmail({ to, subject, html, text }: SendEmailPayload) {
  if (!isFeatureEnabled("enable_postmark")) {
    console.info("[email] Postmark disabled; skipped send", { to, subject });
    return;
  }

  const from = process.env.POSTMARK_FROM_EMAIL;
  if (!from) {
    throw new Error(
      "POSTMARK_FROM_EMAIL is required when ENABLE_POSTMARK=true.",
    );
  }

  return getPostmarkClient().sendEmail({
    From: from,
    To: to,
    Subject: subject,
    HtmlBody: html,
    TextBody: text,
  });
}
