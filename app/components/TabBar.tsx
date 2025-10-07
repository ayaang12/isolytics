import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Home, HeartPulse, History, PlusCircle } from "lucide-react-native";

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const icons: Record<string, React.ElementType> = {
    index: Home,
    cardio: HeartPulse,
    history: History,
    create: PlusCircle,
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        paddingVertical: 10,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        // Ensure label is always a string
        const label: string =
          (options.tabBarLabel as string) ||
          (options.title as string) ||
          route.name;

        const isFocused = state.index === index;
        const Icon = icons[route.name] || Home;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={{ flex: 1, alignItems: "center" }}
          >
            <Icon
              color={isFocused ? "#2563eb" : "#9ca3af"}
              size={22}
              strokeWidth={2.4}
            />
            <Text
              style={{
                color: isFocused ? "#2563eb" : "#9ca3af",
                fontWeight: isFocused ? "600" : "400",
                fontSize: 12,
                marginTop: 3,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
