import { router, Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserAvatar } from '@/components/navigation/UserAvatar';
import { TouchableOpacity } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        // headerRight: () => <UserAvatar />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerRight:() => <UserAvatar />,
          title: "Inicio",
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
        name="register_qr/index"
        options={{
          title: "Escanear QR",
          headerTitleAlign: "center",
          
          tabBarShowLabel: false,
          headerShadowVisible: false,
          tabBarButton: () => null,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Button icon={ { source: 'arrow-left', direction: 'ltr'} } children={null} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="payment/index"
        options={{
          title: "Pagar con woompi",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Button icon={ { source: 'arrow-left', direction: 'ltr'} } children={null} />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "card" : "card-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

