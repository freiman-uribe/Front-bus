import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { UserAvatar } from '@/components/navigation/UserAvatar';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Stack>
      <Stack.Screen name="(drawer)" options={{
        headerTitle: '',
        headerLeft: () => <DrawerToggleButton
          tintColor={colorScheme === 'dark' ? '#fff' : '#000'}
        />,
        headerRight: () => <UserAvatar />
      }} />
      <Stack.Screen name="bus-driver/create" options={{ title: 'Crear Asignación' }} />
      <Stack.Screen name="bus-driver/update/[id]" options={{ title: 'Editar Asignación' }} />
      <Stack.Screen name="car/create" options={{ title: 'Crear Bus' }} />
      <Stack.Screen name="car/update/[id]" options={{ title: 'Editar Bus' }} />
      <Stack.Screen name='car-route/create' options={{ title: 'Crear Ruta' }} />
      <Stack.Screen name='car-route/update/[id]' options={{ title: 'Editar Ruta' }} />
      <Stack.Screen name='plans/create' options={{ title: 'Crear Plan' }} />
      <Stack.Screen name='plans/update/[id]' options={{ title: 'Editar Plan' }} />
    </Stack>

  );
}

