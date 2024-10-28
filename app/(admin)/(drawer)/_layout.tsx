import { View, Text } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Drawer from 'expo-router/drawer'
import DrawerIcon from '@/components/navigation/DrawerIcon'


export default function _layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
    <Drawer screenOptions={{
      headerShown: false,
      drawerActiveTintColor: "green",
      }}>
      <Drawer.Screen
        name="index" 
        options={{
          drawerLabel: 'Usuarios',
          title: 'overview',
          drawerIcon: (props) => <DrawerIcon name="person-outline"  color={props.color}/>,
          
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
  )
}