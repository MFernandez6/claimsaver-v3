import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "../../src/lib/supabase";

export default function MoreScreen() {
  const web = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: "#fff", gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>More</Text>
      <Pressable onPress={() => WebBrowser.openBrowserAsync(`${web}/when-to-call-an-attorney`)}>
        <Text style={{ color: "#0f766e", fontSize: 16 }}>When to call an attorney</Text>
      </Pressable>
      <Pressable onPress={() => WebBrowser.openBrowserAsync(`${web}/learning-center`)}>
        <Text style={{ color: "#0f766e", fontSize: 16 }}>Learning Center</Text>
      </Pressable>
      <Pressable onPress={() => WebBrowser.openBrowserAsync(`${web}/contact`)}>
        <Text style={{ color: "#0f766e", fontSize: 16 }}>Platform support</Text>
      </Pressable>
      <Pressable
        onPress={async () => {
          await supabase.auth.signOut();
          router.replace("/login");
        }}
        style={{ marginTop: 24 }}
      >
        <Text style={{ color: "#b91c1c", fontWeight: "600" }}>Sign out</Text>
      </Pressable>
      <Text style={{ marginTop: 24, fontSize: 12, color: "#64748b" }}>
        ClaimSaver+ is not a law firm and does not file or negotiate your claim. You are the filer.
      </Text>
    </View>
  );
}
