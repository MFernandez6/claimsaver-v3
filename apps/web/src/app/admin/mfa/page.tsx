import { Suspense } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminMfaForm } from "@/components/admin/mfa-form";

export default function AdminMfaPage() {
  return (
    <div className="flex h-full items-center justify-center bg-slate-950 p-6">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <BrandLogo className="mb-4" />
          <CardTitle>Admin authenticator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-600">
            Staff access requires a TOTP app (aal2). This console manages the
            software. You are not the filer.
          </p>
          <Suspense fallback={<p className="text-sm text-slate-500">Loading authenticator…</p>}>
            <AdminMfaForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
