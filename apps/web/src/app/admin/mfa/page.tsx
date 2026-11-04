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
          <CardTitle>Admin login code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-600">
            Staff access uses a 6-digit code emailed to the OWNER inbox. This
            console manages the software. You are not the filer.
          </p>
          <Suspense fallback={<p className="text-sm text-slate-500">Sending a code…</p>}>
            <AdminMfaForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
