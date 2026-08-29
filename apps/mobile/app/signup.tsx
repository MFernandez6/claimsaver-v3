import { useState } from "react";
import { router } from "expo-router";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { supabase } from "../src/lib/supabase";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    setError(null);
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName } },
    });
    if (err) {
      setError(err.message);
      return;
    }
    if (data.session) {
      router.replace("/(app)");
      return;
    }
    setMsg("Check your email to confirm, then sign in.");
  }

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: "#fff" }}>
      <Image
        source={require("../assets/brand/claimsaver-plus-lockup.png")}
        accessibilityLabel="ClaimSaver+"
        resizeMode="contain"
        style={{ width: 240, height: 59, marginBottom: 12 }}
      />
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Create account</Text>
      <TextInput placeholder="First name" value={firstName} onChangeText={setFirstName} style={input} />
      <TextInput autoCapitalize="none" keyboardType="email-address" placeholder="Email" value={email} onChangeText={setEmail} style={input} />
      <TextInput secureTextEntry placeholder="Password" value={password} onChangeText={setPassword} style={input} />
      {error ? <Text style={{ color: "#b91c1c", marginTop: 8 }}>{error}</Text> : null}
      {msg ? <Text style={{ color: "#0f766e", marginTop: 8 }}>{msg}</Text> : null}
      <Pressable onPress={() => void submit()} style={btn}>
        <Text style={{ color: "#fff", fontWeight: "600" }}>Create account</Text>
      </Pressable>
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
