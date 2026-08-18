"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FlashNotice } from "@/components/flash-notice";

function QueryNoticeInner() {
  const { t } = useTranslation();
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const confirmed = params.get("email_confirmed") === "1";
    const created = params.get("account_created") === "1";
    if (!confirmed && !created) return;

    setMessage(confirmed ? t("auth.emailConfirmed") : t("auth.accountCreated"));

    const next = new URLSearchParams(params.toString());
    next.delete("email_confirmed");
    next.delete("account_created");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [params, pathname, router, t]);

  return <FlashNotice message={message} onDismiss={() => setMessage(null)} />;
}

export function QueryNotice() {
  return (
    <Suspense fallback={null}>
      <QueryNoticeInner />
    </Suspense>
  );
}
