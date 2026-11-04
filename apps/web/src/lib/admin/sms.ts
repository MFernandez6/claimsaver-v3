import { sendOperationalEmail } from "./mail";

type SendResult = { sms: boolean; email: boolean; error?: string };

async function sendTwilio(to: string, body: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_FROM_NUMBER?.trim();
  if (!sid || !token || !from) return false;
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }),
  });
  return res.ok;
}

/** Best-effort SMS via US carrier email gateways when Twilio is not configured. */
async function sendCarrierGateway(e164: string, body: string): Promise<boolean> {
  const national = e164.replace(/\D/g, "").replace(/^1/, "");
  if (national.length !== 10) return false;
  const hosts = ["tmomail.net", "vtext.com", "txt.att.net"];
  const results = await Promise.all(
    hosts.map((host) =>
      sendOperationalEmail({
        to: `${national}@${host}`,
        subject: "ClaimSaver+",
        text: body,
      }),
    ),
  );
  return results.some((row) => row.status === "sent");
}

export async function sendAdminMfaCode(input: {
  e164: string;
  email: string;
  body: string;
}): Promise<SendResult> {
  let sms = false;
  let smsError: string | undefined;
  try {
    sms = (await sendTwilio(input.e164, input.body)) || (await sendCarrierGateway(input.e164, input.body));
  } catch (err) {
    smsError = err instanceof Error ? err.message : "sms failed";
  }

  const mailed = await sendOperationalEmail({
    to: input.email,
    subject: "Your ClaimSaver+ admin code",
    text: input.body,
  });

  return {
    sms,
    email: mailed.status === "sent",
    error: sms || mailed.status === "sent" ? undefined : smsError || mailed.error || "Could not send code",
  };
}
