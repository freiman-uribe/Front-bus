import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserAvatar } from '@/components/navigation/UserAvatar';
import { Platform } from 'react-native';
import { Appbar } from 'react-native-paper';



export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerRight:() => <UserAvatar />,
          title: 'Inicio',
          headerTitleAlign: "center",
          headerStyle: {
            elevation:4,
            shadowColor: "black",
            shadowRadius: 1,
            shadowOpacity: 1
          },
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

