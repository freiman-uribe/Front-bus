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
        headerTitle: "Estudiante",
        headerShown: true,
        headerStyle: { height: 100, paddingBottom: 0 },
        // headerRight: () => <UserAvatar />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerRight:() => <UserAvatar />,
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
          title: "Home",
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}

