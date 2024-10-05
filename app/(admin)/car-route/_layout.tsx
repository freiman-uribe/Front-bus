import { Stack } from 'expo-router'

export default function CarRouteLayout() {
  return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  )
}