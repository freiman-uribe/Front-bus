import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserAvatar } from '@/components/navigation/UserAvatar';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <>
      <UserAvatar/>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
      }}> 
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'code-slash' : 'code-slash'} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}


const styles = StyleSheet.create({
  linkText: {
    marginTop: 100
  },
})
