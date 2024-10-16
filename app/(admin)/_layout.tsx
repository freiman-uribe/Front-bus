import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserAvatar } from '@/components/navigation/UserAvatar';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="car"
        options={{
          title: "Buses",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "bus" : "bus-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: "Planes",

          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "wallet" : "wallet-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="car-route"
        options={{
          title: "Rutas",

          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "map" : "map-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

