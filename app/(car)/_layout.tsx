import React from 'react'
import { Stack } from 'expo-router'

export default function CarLayout() {
  return (
    <Stack >
        <Stack.Screen name="index" />
        <Stack.Screen name="create_car/create" options={{ title: "Crear Bus" }} />
        <Stack.Screen name="update/[id]" options={{ title: "Editar Bus" }} />
    </Stack>
  )
}