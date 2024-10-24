import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
  return (
    <Stack>
        <Stack.Screen name="create-bus-driver" options={{
          title: 'Crear Asignación',
        }}  />
        <Stack.Screen name="update-bus-driver/[id]" options={{
          title: 'Editar Asignación',
        }}  />
    </Stack>
  )
}