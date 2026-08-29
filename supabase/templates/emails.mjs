/** ClaimSaver+ Auth email copy + HTML. Source of truth for local files and hosted push. */

export const SITE = "https://www.claimsaverplus.com";
export const SUPPORT = "support@claimsaverplus.com";
export const SENDER_NAME = "ClaimSaver+";

const LOGO = `${SITE}/images/brand/claimsaver-plus-lockup-email.png`;

function authCallbackLink(type, next = "/dashboard") {
  const n = encodeURIComponent(next);
  return `${SITE}/auth/callback?token_hash={{ .TokenHash }}&type=${type}&next=${n}`;
}

function wrap({ title, preheader, innerHtml }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:560px;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="height:4px;background-color:#0d9488;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="background-color:#ffffff;padding:20px 28px 16px;border-bottom:1px solid #e2e8f0;">
              <a href="${SITE}" style="text-decoration:none;">
                <img src="${LOGO}" width="200" height="49" alt="ClaimSaver+" style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:200px;" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px 8px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
              ${innerHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 28px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#64748b;border-top:1px solid #e2e8f0;">
              ClaimSaver+ · Miami, Florida<br>
              Guided claim software — not a law firm.<br>
              <a href="${SITE}" style="color:#0f766e;text-decoration:underline;">claimsaverplus.com</a>
              &nbsp;·&nbsp;
              <a href="mailto:${SUPPORT}" style="color:#0f766e;text-decoration:underline;">${SUPPORT}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function heading(text) {
  return `<h1 style="margin:0 0 12px;font-size:22px;line-height:28px;font-weight:700;color:#0f172a;">${text}</h1>`;
}

function para(text) {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:22px;color:#334155;">${text}</p>`;
}

function button(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;">
    <tr>
      <td style="background-color:#0d9488;border-radius:8px;">
        <a href="${href}" style="display:inline-block;padding:12px 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">${label}</a>
      </td>
    </tr>
  </table>`;
}

function fallbackLink(href) {
  return `<p style="margin:0 0 8px;font-size:12px;line-height:18px;color:#64748b;">If the button does not work, copy and paste this link into your browser:</p>
<p style="margin:0 0 16px;font-size:12px;line-height:18px;word-break:break-all;"><a href="${href}" style="color:#0f766e;">${href}</a></p>`;
}

const SIGNUP_LINK = authCallbackLink("signup");
const RECOVERY_LINK = authCallbackLink("recovery", "/update-password");
const MAGIC_LINK = authCallbackLink("magiclink");
const EMAIL_CHANGE_LINK = authCallbackLink("email_change");
const INVITE_LINK = authCallbackLink("invite");

export const templates = {
  confirmation: {
    subject: "Confirm your ClaimSaver+ account",
    html: wrap({
      title: "Confirm your ClaimSaver+ account",
      preheader: "Confirm your email to activate your ClaimSaver+ account.",
      innerHtml:
        heading("Confirm your email") +
        para("Thanks for creating a ClaimSaver+ account. Confirm this email address to finish signing up and open your workspace.") +
        button(SIGNUP_LINK, "Confirm email address") +
        fallbackLink(SIGNUP_LINK) +
        para("If you did not create this account, you can ignore this message."),
    }),
  },
  recovery: {
    subject: "Reset your ClaimSaver+ password",
    html: wrap({
      title: "Reset your ClaimSaver+ password",
      preheader: "Use this link to choose a new ClaimSaver+ password.",
      innerHtml:
        heading("Reset your password") +
        para("We received a request to reset the password for your ClaimSaver+ account. This link expires shortly and can only be used once.") +
        button(RECOVERY_LINK, "Choose a new password") +
        fallbackLink(RECOVERY_LINK) +
        para("If you did not request this, you can ignore this message. Your password will stay the same."),
    }),
  },
  magic_link: {
    subject: "Your ClaimSaver+ sign-in link",
    html: wrap({
      title: "Your ClaimSaver+ sign-in link",
      preheader: "Use this one-time link to sign in to ClaimSaver+.",
      innerHtml:
        heading("Sign in to ClaimSaver+") +
        para("Use this one-time link to sign in. It expires shortly and can only be used once.") +
        button(MAGIC_LINK, "Sign in") +
        fallbackLink(MAGIC_LINK) +
        para("If you did not request this, you can ignore this message."),
    }),
  },
  email_change: {
    subject: "Confirm your new ClaimSaver+ email",
    html: wrap({
      title: "Confirm your new ClaimSaver+ email",
      preheader: "Confirm this address to update your ClaimSaver+ account email.",
      innerHtml:
        heading("Confirm your new email") +
        para("Follow the button below to confirm {{ .NewEmail }} as the email address for your ClaimSaver+ account.") +
        button(EMAIL_CHANGE_LINK, "Confirm new email") +
        fallbackLink(EMAIL_CHANGE_LINK) +
        para("If you did not request this change, you can ignore this message."),
    }),
  },
  invite: {
    subject: "You're invited to ClaimSaver+",
    html: wrap({
      title: "You're invited to ClaimSaver+",
      preheader: "Accept your invitation to create a ClaimSaver+ account.",
      innerHtml:
        heading("You're invited") +
        para("You've been invited to create a ClaimSaver+ account. Accept the invitation to get started.") +
        button(INVITE_LINK, "Accept invitation") +
        fallbackLink(INVITE_LINK),
    }),
  },
  reauthentication: {
    subject: "{{ .Token }} is your ClaimSaver+ verification code",
    html: wrap({
      title: "Your ClaimSaver+ verification code",
      preheader: "Use this code to verify your ClaimSaver+ account.",
      innerHtml:
        heading("Your verification code") +
        para("Use this code to verify your identity. It expires shortly.") +
        `<p style="margin:8px 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:36px;font-weight:700;letter-spacing:0.12em;color:#0f172a;">{{ .Token }}</p>` +
        para("If you did not request this, you can ignore this message."),
    }),
  },
};

export const hostedApiMap = {
  confirmation: {
    subjectKey: "mailer_subjects_confirmation",
    contentKey: "mailer_templates_confirmation_content",
  },
  recovery: {
    subjectKey: "mailer_subjects_recovery",
    contentKey: "mailer_templates_recovery_content",
  },
  magic_link: {
    subjectKey: "mailer_subjects_magic_link",
    contentKey: "mailer_templates_magic_link_content",
  },
  email_change: {
    subjectKey: "mailer_subjects_email_change",
    contentKey: "mailer_templates_email_change_content",
  },
  invite: {
    subjectKey: "mailer_subjects_invite",
    contentKey: "mailer_templates_invite_content",
  },
  reauthentication: {
    subjectKey: "mailer_subjects_reauthentication",
    contentKey: "mailer_templates_reauthentication_content",
  },
};
