import { Stack } from "expo-router"

export default function CreateCarRouteLayout() {
  return (
   <Stack>
        <Stack.Screen name="index" options={{headerShown: false}} />
   </Stack>
  )
}