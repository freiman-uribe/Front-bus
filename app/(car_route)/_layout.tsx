import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";


export default function TabLayout() {
  return (
      <Stack >
        <Stack.Screen  name="index" options={{ title: ""}}/>
        <Stack.Screen  name="create_car_rute/create" options={{title: "Crear ruta"}}/>
        <Stack.Screen name="update/[id]"  options={{title: "Editar ruta"}}/>
      </Stack>
  );
}

const styles = StyleSheet.create({
  linkText: {
    marginTop: 100,
  },
});
