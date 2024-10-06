import { View } from 'react-native'
import { Stack } from 'expo-router'

export default function PlansLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerTitle: "",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </View>
  )
}