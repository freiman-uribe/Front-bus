// import { Stack } from "expo-router"


// export default function CarRouteLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false
//       }}
//     >
//       <Stack.Screen name="index" />
//       <Stack.Screen name="(create-car-route)" />
//       <Stack.Screen name="update/[id]"  />

//     </Stack>
//   )
// }
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { UserAvatar } from "@/components/navigation/UserAvatar";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <>
      <UserAvatar />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create_car_rute/create"
          options={{
            title: "Crear ruta",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "code-slash" : "code-slash"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="update/[id]"
          options={{
            title: "",
            tabBarIcon: () => null,
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  linkText: {
    marginTop: 100,
  },
});