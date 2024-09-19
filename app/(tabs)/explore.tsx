
import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';

export default function TabTwoScreen() {

  return (
    <View>
      <Text> Explore</Text>
      <Button  onPress={() => router.push('/(car-route)')}>Go to car-route</Button>
    </View>
  );
}
