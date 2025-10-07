import { Tabs } from "expo-router";
import TabBar from "./components/TabBar"; // optional custom tab bar
import React from "react";

export default function Layout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="cardio"
        options={{
          title: "Cardio",
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
        }}
      />
    </Tabs>
  );
}
