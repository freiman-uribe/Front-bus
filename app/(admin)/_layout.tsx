import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserAvatar } from '@/components/navigation/UserAvatar';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import DrawerIcon from '@/components/navigation/DrawerIcon';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <Drawer screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "green",
        }}>
        <Drawer.Screen
          name="index" 
          options={{
            drawerLabel: 'inicio',
            title: 'overview',
            drawerIcon: (props) => <DrawerIcon name="home-outline"  color={props.color}/>,
            
          }}
        />
        <Drawer.Screen
          name="car" 
          options={{
            drawerLabel: 'Buses',
            title: 'Buses',
            drawerIcon: (props) => <DrawerIcon name="bus-outline"  color={props.color}/>,
          }}
        />
        <Drawer.Screen
          name="plans" 
          options={{
            drawerLabel: 'Planes',
            title: 'Planes',
            drawerIcon: (props) => <DrawerIcon name="wallet-outline"  color={props.color}/>,
          }}
        />
        <Drawer.Screen
          name="car-route" 
          options={{
            drawerLabel: 'Rutas',
            title: 'Rutas',
            drawerIcon: (props) => <DrawerIcon name="map-outline"  color={props.color}/>,
          }}
        />
        <Drawer.Screen
          name="bus-driver" 
          options={{
            drawerLabel: 'Asignación de conductores',
            title: 'Conductores',
            drawerIcon: (props) => <DrawerIcon name="speedometer-outline"  color={props.color}/>,
          }}
        />       
      </Drawer>
    </GestureHandlerRootView>

  );
}

