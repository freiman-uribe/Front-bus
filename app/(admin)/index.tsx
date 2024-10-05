
import { ScrollView, Text } from 'react-native';
import { router } from 'expo-router';
import { Button } from 'react-native-paper';

export default function Car() {

  return (
    <ScrollView >
      <Text>hola</Text>
      <Button onPress={() => router.push('/(car_route)/')}>car routes</Button>
    </ScrollView>
  );
}
