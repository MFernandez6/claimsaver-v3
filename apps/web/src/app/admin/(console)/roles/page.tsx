"use client";

import { FormEvent, useEffect, useState } from "react";
import { webApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/page-header";

type StaffRow = {
  id: string;
  userId: string;
  role: string;
  email: string;
  createdAt: string;
};

export default function AdminRolesPage() {
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () =>
    webApi
      .get<{ staff: StaffRow[] }>("/api/v1/admin/roles")
      .then((data) => setStaff(data.staff))
      .catch((e) => setError(e instanceof Error ? e.message : "Forbidden"));

  useEffect(() => {
    void load();
  }, []);

  const invite = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await webApi.post("/api/v1/admin/roles", { email, role: "SUPPORT" });
      setEmail("");
      setNotice("SUPPORT invited. They must enroll TOTP before opening /admin.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invite failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <AdminPageHeader
        kicker="OWNER"
        title="Roles"
        description="Invite SUPPORT (admin console) or add CLINIC_ADMIN from a clinic detail later. OWNER is seeded, not invited."
      />

      <form onSubmit={(e) => void invite(e)} className="mb-8 flex max-w-xl gap-2">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="support-teammate@claimsaverplus.com"
          type="email"
          required
        />
        <Button type="submit" disabled={busy}>
          Invite SUPPORT
        </Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {notice ? <p className="mb-4 text-sm text-teal-800">{notice}</p> : null}

      <div className="space-y-3">
        {staff.map((row) => (
          <Card key={row.id}>
            <CardContent className="flex items-center justify-between py-4 text-sm">
              <div>
                <p className="font-medium">{row.email}</p>
                <p className="text-slate-500">
                  {row.role} · since {new Date(row.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
