import React from 'react'
import { Stack } from 'expo-router'

export default function PlansLayout() {
  return (
    <Stack
    >
        <Stack.Screen name='index' />
        <Stack.Screen name='create' options={{headerTitle: "Crear Plan"}}/>
        <Stack.Screen name='edit/[id]' options={{headerTitle: "Editar Plan"}}/>
    </Stack>
  )
}