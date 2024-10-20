import { Tabs, useRouter } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserAvatar } from '@/components/navigation/UserAvatar';
import { Platform, TouchableOpacity } from 'react-native';
import { Appbar, IconButton } from 'react-native-paper';



export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
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
        name="generate-qr/[id]"
        options={{
          title: "Registro QR",
          tabBarIcon: () => null,
          tabBarShowLabel: false,
          tabBarButton: () => null,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <IconButton icon="arrow-left" size={24} />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}

