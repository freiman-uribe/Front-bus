import { Stack } from "expo-router"


export default function CarRouteLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(create-car-route)" />
      <Stack.Screen name="update/[id]"  />

    </Stack>
  )
}