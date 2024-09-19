import { useEffect, useState } from 'react';
import { Button, Card, Text } from 'react-native-paper';
import { Axios } from '@/resources/axios/axios';
import { ScrollView, View } from 'react-native';
import { styles } from './styles/style';
import { Link, Stack } from 'expo-router';

export default function Car() {

  const [carList, setCarList] = useState([]);

  const listCar = async () => {
    try {
      const {data} = await Axios.get("/config/car");
      console.log('🚀 ~ listCar ~ data:', data)
      await setCarList(data)
    } catch (error) {
      console.log('🚀 ~ listCar ~ error:', error)
      console.erro('🚀 ~ listCar ~ error:', error)
    }
  }
    useEffect(() => {
      listCar();
    }, [])

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />

      <Link href={`/car/FormCar`}>Agregar</Link>
      <View>
        <Text variant="headlineLarge" style={styles.title}>
          Listado de vehiculos
        </Text>
        {(carList || []).map((car) => (
          <Card style={styles.card}>
            <Card.Cover source={require("@/assets/images/bus.jpeg")} />
            <Card.Content>
              <Text variant="titleLarge">
                {car.type.name} - {car.company.name}
              </Text>
              <Text variant="bodyMedium">Placa: {car.placa}</Text>
              <Text variant="bodyMedium">Capacidad: {car.size}</Text>
              <Text variant="bodyMedium">Color: {car.color}</Text>
            </Card.Content>
            <Card.Actions>
              <Button>Editar</Button>
              <Button color="error">Eliminar</Button>
            </Card.Actions>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}
