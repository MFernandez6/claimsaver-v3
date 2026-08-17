"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { webApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Overview = {
  users: Array<{
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    has_platform_access: boolean;
  }>;
  claims: Array<{
    id: string;
    user_id: string;
    claim_number: string;
    status: string;
    updated_at: string;
  }>;
};

export default function AdminPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    webApi
      .get<Overview>("/api/v1/admin/overview")
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Forbidden"));
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <h1 className="text-2xl font-bold">{t("admin.title")}</h1>
        <p className="mt-3 text-slate-600">{error}. {t("admin.forbidden")}</p>
      </div>
    );
  }
  if (!data) return <p className="p-8">{t("common.loading")}</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Image
        src="/images/long-logo-ClaimSaver.jpg"
        alt="ClaimSaver+"
        width={280}
        height={64}
        className="mb-6 h-12 w-auto object-contain"
      />
      <h1 className="text-3xl font-bold">{t("admin.workspace")}</h1>
      <p className="mt-2 text-sm text-slate-500">
        {t("admin.intro")}
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{t("admin.users", { count: data.users.length })}</CardTitle></CardHeader>
          <CardContent className="max-h-[28rem] space-y-2 overflow-auto text-sm">
            {data.users.map((u) => (
              <div key={u.id} className="rounded border p-2">
                <p className="font-medium">{u.email}</p>
                <p className="text-xs text-slate-500">{u.role} · {t("admin.access")} {u.has_platform_access ? t("common.yes") : t("common.no")}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t("admin.claims", { count: data.claims.length })}</CardTitle></CardHeader>
          <CardContent className="max-h-[28rem] space-y-2 overflow-auto text-sm">
            {data.claims.map((c) => (
              <button
                key={c.id}
                type="button"
                className="block w-full rounded border p-2 text-left"
                onClick={async () => {
                  setSelected(c.id);
                  setDetail(await webApi.get(`/api/v1/admin/claims/${c.id}`));
                }}
              >
                <p className="font-medium">{c.claim_number}</p>
                <p className="text-xs text-slate-500">{c.status}</p>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
      {selected && detail ? (
        <Card className="mt-6">
          <CardHeader><CardTitle>{t("admin.recordNotes")}</CardTitle></CardHeader>
          <CardContent>
            <pre className="max-h-64 overflow-auto rounded bg-slate-50 p-3 text-xs">
              {JSON.stringify(detail, null, 2)}
            </pre>
            <form
              className="mt-4 flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                await webApi.post(`/api/v1/admin/claims/${selected}`, { body: note });
                setNote("");
                setDetail(await webApi.get(`/api/v1/admin/claims/${selected}`));
              }}
            >
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("admin.internalNote")} />
              <Button type="submit">{t("admin.addNote")}</Button>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
