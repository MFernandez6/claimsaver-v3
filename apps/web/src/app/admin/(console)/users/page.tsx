"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { webApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ADMIN } from "@/content/admin";

type StaffUser = {
  id: string;
  email: string;
  name: string;
  phone: string;
  isActive: boolean;
  hasPlatformAccess: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<StaffUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const search = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const data = await webApi.get<{ users: StaffUser[] }>(
        `/api/v1/admin/users?q=${encodeURIComponent(q.trim())}`,
      );
      setUsers(data.users);
    } catch (err) {
      setUsers([]);
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <AdminPageHeader
        kicker="Directory"
        title="Users"
        description={ADMIN.searchHint}
      />

      <form onSubmit={(e) => void search(e)} className="flex max-w-xl gap-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Exact email or user ID"
          aria-label="Search by exact email or user ID"
        />
        <Button type="submit" disabled={busy}>
          {busy ? "Searching…" : "Search"}
        </Button>
      </form>
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}

      {users ? (
        <div className="mt-8 space-y-3">
          {users.length === 0 ? (
            <p className="text-sm text-slate-500">No account matches that lookup.</p>
          ) : (
            users.map((user) => (
              <Link key={user.id} href={`/admin/users/${user.id}`} className="block">
                <Card className="transition hover:border-teal-300">
                  <CardContent className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{user.email}</p>
                      <p className="text-sm text-slate-500">
                        {user.name} · {user.phone || "no phone"} ·{" "}
                        {user.isActive ? "active" : "disabled"}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      ) : (
        <p className="mt-8 text-sm text-slate-500">
          Accounts are not listed. Look one up when you have an exact email or ID.
        </p>
      )}
    </div>
  );
}
