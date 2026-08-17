import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { supabase } from "../src/lib/supabase";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session));
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(Boolean(session));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#0d9488" />
      </View>
    );
  }

  return <Redirect href={signedIn ? "/(app)" : "/login"} />;
}
