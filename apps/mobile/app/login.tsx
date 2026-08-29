import { useState } from "react";
import { Link, router } from "expo-router";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { supabase } from "../src/lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.replace("/(app)");
  }

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: "#fff" }}>
      <Image
        source={require("../assets/brand/claimsaver-plus-lockup.png")}
        accessibilityLabel="ClaimSaver+"
        resizeMode="contain"
        style={{ width: 240, height: 59, marginBottom: 8 }}
      />
      <Text style={{ marginTop: 8, color: "#475569" }}>
        File your Florida no-fault claim. Keep what’s yours.
      </Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={input}
      />
      <TextInput
        secureTextEntry
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={input}
      />
      {error ? <Text style={{ color: "#b91c1c", marginTop: 8 }}>{error}</Text> : null}
      <Pressable onPress={() => void submit()} style={btn}>
        <Text style={{ color: "#fff", fontWeight: "600" }}>{loading ? "Signing in…" : "Sign in"}</Text>
      </Pressable>
      <Link href="/signup" style={{ marginTop: 16, color: "#0f766e" }}>
        Create an account
      </Link>
      <Text style={{ marginTop: 24, fontSize: 12, color: "#64748b" }}>
        Not a law firm. You stay in control. Platform support only—no legal advice.
      </Text>
    </View>
  );
}

const input = {
  borderWidth: 1,
  borderColor: "#e2e8f0",
  borderRadius: 10,
  padding: 12,
  marginTop: 12,
} as const;

const btn = {
  marginTop: 16,
  backgroundColor: "#0d9488",
  padding: 14,
  borderRadius: 12,
  alignItems: "center" as const,
};
