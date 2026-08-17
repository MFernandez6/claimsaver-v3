import { Tabs } from "expo-router";

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        headerTintColor: "#0f766e",
        tabBarActiveTintColor: "#0d9488",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Workspace" }} />
      <Tabs.Screen name="worksheet" options={{ title: "Worksheet" }} />
      <Tabs.Screen name="docs" options={{ title: "Documents" }} />
      <Tabs.Screen name="more" options={{ title: "More" }} />
    </Tabs>
  );
}
