import { useCallback, useEffect, useState } from "react";
import { Link } from "expo-router";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import type { ClaimSummary, Me } from "@claimsaver/shared";
import { ApiClientError, TOTAL_WORKSHEET_STEPS } from "@claimsaver/shared";
import { api } from "../../src/lib/api";

export default function WorkspaceScreen() {
  const [me, setMe] = useState<Me | null>(null);
  const [claims, setClaims] = useState<ClaimSummary[]>([]);
  const [paywall, setPaywall] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const profile = await api.get<Me>("/api/v1/me");
      setMe(profile);
      if (!profile.hasPlatformAccess) {
        setPaywall(true);
        return;
      }
      setPaywall(false);
      setClaims(await api.get<ClaimSummary[]>("/api/v1/claims"));
    } catch (e) {
      if (e instanceof ApiClientError && e.status === 402) setPaywall(true);
      else setError(e instanceof Error ? e.message : "Load failed");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (paywall) {
    return (
      <View style={{ flex: 1, padding: 24, backgroundColor: "#fff" }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>Unlock your workspace</Text>
        <Text style={{ marginTop: 8, color: "#475569" }}>
          Flat $500 platform access. You remain the filer. Notarization is optional and separate.
        </Text>
        <Pressable
          style={btn}
          onPress={() => WebBrowser.openBrowserAsync(`${process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"}/pricing`)}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Open checkout</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      contentContainerStyle={{ padding: 20 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await load();
            setRefreshing(false);
          }}
        />
      }
    >
      <Text style={{ fontSize: 22, fontWeight: "700" }}>
        Hello {me?.firstName || "there"}
      </Text>
      <Text style={{ marginTop: 6, color: "#64748b" }}>
        Recovery workspace—not “we are handling your case.” You send the package to your insurer.
      </Text>
      {error ? <Text style={{ color: "#b91c1c", marginTop: 8 }}>{error}</Text> : null}
      {claims.map((c) => (
        <View key={c.id} style={card}>
          <Text style={{ fontWeight: "700" }}>{c.claimNumber}</Text>
          <Text style={{ color: "#64748b", marginTop: 4 }}>
            Step {c.worksheetStep}/{TOTAL_WORKSHEET_STEPS} · {c.status} · {c.accidentDate || "No accident date"}
          </Text>
        </View>
      ))}
      <Link href="/(app)/worksheet" style={{ marginTop: 16, color: "#0f766e", fontWeight: "600" }}>
        Open Florida no-fault worksheet
      </Link>
    </ScrollView>
  );
}

const card = {
  marginTop: 12,
  backgroundColor: "#fff",
  borderRadius: 14,
  padding: 16,
  borderWidth: 1,
  borderColor: "#e2e8f0",
} as const;

const btn = {
  marginTop: 20,
  backgroundColor: "#0d9488",
  padding: 14,
  borderRadius: 12,
  alignItems: "center" as const,
};
