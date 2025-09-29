import { Stack } from "expo-router";
import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

const _layout = () => {
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
};

export default function RootLayout() {
  return <Stack />;
}
