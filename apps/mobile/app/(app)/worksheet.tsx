import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import {
  emptyWorksheet,
  TOTAL_WORKSHEET_STEPS,
  type ClaimDetail,
  type FloridaNoFaultFormData,
} from "@claimsaver/shared";
import { ApiClientError } from "@claimsaver/shared";
import { api } from "../../src/lib/api";

export default function WorksheetScreen() {
  const [claim, setClaim] = useState<ClaimDetail | null>(null);
  const [form, setForm] = useState<FloridaNoFaultFormData>(emptyWorksheet());
  const [msg, setMsg] = useState("Loading…");

  useEffect(() => {
    (async () => {
      try {
        const list = await api.get<ClaimDetail[]>("/api/v1/claims");
        const current = list[0]
          ? await api.get<ClaimDetail>(`/api/v1/claims/${list[0].id}`)
          : await api.post<ClaimDetail>("/api/v1/claims", {});
        setClaim(current);
        setForm(current.worksheet);
        setMsg(`Record ${current.claimNumber} · autosaves`);
      } catch (e) {
        setMsg(
          e instanceof ApiClientError && e.status === 402
            ? "Buy platform access on the web checkout first."
            : e instanceof Error
              ? e.message
              : "Error",
        );
      }
    })();
  }, []);

  function set<K extends keyof FloridaNoFaultFormData>(key: K, value: FloridaNoFaultFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (!claim) return;
    void api.patch(`/api/v1/claims/${claim.id}`, { worksheet: { [key]: value } });
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} style={{ backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Florida No-Fault Form</Text>
      <Text style={{ marginTop: 6, color: "#64748b", fontSize: 13 }}>{msg}</Text>
      <Text style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>
        Drafting aid. The insurer’s official form controls. Saving does not file with an insurer.
      </Text>
      <Field label="Full name" value={form.claimantName} onChange={(v) => set("claimantName", v)} />
      <Field label="Email" value={form.claimantEmail} onChange={(v) => set("claimantEmail", v)} />
      <Field label="Date of accident (YYYY-MM-DD)" value={form.dateOfAccident} onChange={(v) => { set("dateOfAccident", v); set("accidentDate", v); }} />
      <Field label="Place" value={form.accidentPlace} onChange={(v) => { set("accidentPlace", v); set("accidentLocation", v); }} />
      <Field label="Insurance company" value={form.insuranceCompany} onChange={(v) => set("insuranceCompany", v)} />
      <Field label="Policy number" value={form.policyNumber} onChange={(v) => set("policyNumber", v)} />
      <Field label="Injury description" value={form.injuryDescription} onChange={(v) => set("injuryDescription", v)} multiline />
      <Pressable
        onPress={() => claim && api.patch(`/api/v1/claims/${claim.id}`, { worksheet: form, worksheetStep: TOTAL_WORKSHEET_STEPS })}
        style={{ marginTop: 16, backgroundColor: "#0d9488", padding: 14, borderRadius: 12, alignItems: "center" }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Save to my account</Text>
      </Pressable>
    </ScrollView>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={{ fontSize: 13, fontWeight: "600", color: "#334155" }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        style={{
          marginTop: 6,
          borderWidth: 1,
          borderColor: "#e2e8f0",
          borderRadius: 10,
          padding: 12,
          minHeight: multiline ? 80 : undefined,
        }}
      />
    </View>
  );
}
