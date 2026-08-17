import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import type { DocumentRow } from "@claimsaver/shared";
import { api } from "../../src/lib/api";

export default function DocsScreen() {
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setDocs(await api.get<DocumentRow[]>("/api/v1/documents"));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Could not load documents");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function capture() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      setMsg("Camera permission is required to photograph accident scenes and paperwork.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const form = new FormData();
    form.append("file", {
      uri: asset.uri,
      name: asset.fileName || "photo.jpg",
      type: asset.mimeType || "image/jpeg",
    } as unknown as Blob);
    form.append("name", asset.fileName || "Accident photo");
    form.append("type", "evidence");
    await api.upload("/api/v1/documents", form);
    await load();
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} style={{ backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Document vault</Text>
      <Text style={{ marginTop: 6, color: "#64748b", fontSize: 13 }}>
        You control what you upload. ClaimSaver+ does not review evidence for legal sufficiency.
      </Text>
      <Pressable onPress={() => void capture()} style={{ marginTop: 16, backgroundColor: "#0d9488", padding: 14, borderRadius: 12, alignItems: "center" }}>
        <Text style={{ color: "#fff", fontWeight: "600" }}>Photograph a document</Text>
      </Pressable>
      {msg ? <Text style={{ marginTop: 8, color: "#b91c1c" }}>{msg}</Text> : null}
      {docs.map((d) => (
        <View key={d.id} style={{ marginTop: 12, borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, padding: 12 }}>
          <Text style={{ fontWeight: "600" }}>{d.name}</Text>
          <Text style={{ color: "#64748b", fontSize: 12 }}>{d.type}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
