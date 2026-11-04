"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { webApi } from "@/lib/api/client";
import { Button } from "@/components/ui/button";

export default function EnrollPage() {
  const params = useParams<{ code: string }>();
  const code = params.code;
  const [clinicName, setClinicName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    webApi
      .get<{ clinicName: string; open: boolean }>(`/api/v1/enroll/${code}`)
      .then((data) => {
        setClinicName(data.clinicName);
        setOpen(data.open);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Invalid link"));
  }, [code]);

  const join = async () => {
    setBusy(true);
    setError(null);
    try {
      await webApi.post(`/api/v1/enroll/${code}`, {});
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not enroll");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="text-3xl font-bold">Clinic enrollment</h1>
      {clinicName ? (
        <p className="mt-3 text-slate-600">
          {clinicName} uses ClaimSaver+ for document-preparation software. You remain
          the filer. This does not send your worksheet to the clinic.
        </p>
      ) : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      {done ? (
        <p className="mt-6 text-teal-800">You’re enrolled. The clinic sees progress only.</p>
      ) : (
        <Button className="mt-6" disabled={!open || busy} onClick={() => void join()}>
          {open ? (busy ? "Enrolling…" : "Enroll with this clinic") : "Enrollment is closed"}
        </Button>
      )}
    </div>
  );
}
