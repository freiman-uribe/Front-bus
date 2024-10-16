import { useState, useCallback } from 'react';
import { Button, Card, FAB, Text } from 'react-native-paper';
import { Axios } from '@/resources/axios/axios';
import { ScrollView, View } from 'react-native';
import { styles } from './styles/style';
import { router } from 'expo-router';
import AcceptDialog from '@/components/confirms/AcceptDialog';
import { useFocusEffect } from '@react-navigation/native';
import ConfirmDialog from '@/components/confirms/ConfirmDialog';

interface Car {
  id: string;
  placa: string;
  size: number;
  color: string;
  company: {
    id: number;
    name: string;
  };
  type: {
    id: number;
    name: string;
  };
}

export default function Car() {
  const [carList, setCarList] = useState<Car[]>([]);
  const [acceptDialogVisible, setAcceptDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [carToDelete, setCarToDelete] = useState<string | null>(null);
  const [visibleDialogDelete, setVisibleDialogDelete] = useState(false);

  const listCar = async () => {
    try {
      const { data } = await Axios.get("/config/car");
      setCarList(data);
    } catch (error) {
      console.error("🚀 ~ listCar ~ error:", error);
      setAcceptDialogVisible(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      listCar();
    }, [])
  );

  const handleDelete = (id: string) => {
    setDeleteDialogVisible(true);
    setCarToDelete(id);
  }

  const deleteCar = async () => {
    try {
      await Axios.delete(`/config/car/${carToDelete}`);
      setVisibleDialogDelete(true);
      listCar();
    } catch (error) {
      console.log('🚀 ~ handleDelete ~ error', error);
    }
  }

  const confirmDelete = () => {
    if (carToDelete) {
      deleteCar();
      setCarToDelete(null);
      setDeleteDialogVisible(false);
    }
  }

  const cancelDelete = () => {
    setCarToDelete(null);
    setDeleteDialogVisible(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View>
          <Text variant="headlineLarge" style={styles.title}>
            Listado de Vehículos
          </Text>
          {(carList || []).map((car) => (
            <Card key={car.id} style={styles.card}>
              <Card.Cover source={require("@/assets/images/bus.jpeg")} />
              <Card.Content>
                <Text variant="titleLarge" style={styles.cardTitle}>
                  {car.type.name} - {car.company.name}
                </Text>
                <Text variant="bodyMedium" style={styles.cardDetail}>Placa: {car.placa}</Text>
                <Text variant="bodyMedium" style={styles.cardDetail}>Capacidad: {car.size}</Text>
                <Text variant="bodyMedium" style={styles.cardDetail}>Color: {car.color}</Text>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <Button mode="outlined" onPress={() => router.navigate(`/(car)/update/${car.id}`)} style={styles.editButton}>
                  Editar
                </Button>
                <Button mode="contained" color="red" onPress={() => handleDelete(car.id)} style={styles.deleteButton}>
                  Eliminar
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>
      </ScrollView>
      <FAB
        icon="plus"
        color='white'
        style={styles.floatButton}
        onPress={() => router.navigate('/(car)/create_car/create')}
      />
      <AcceptDialog
        visible={acceptDialogVisible}
        onAccept={() => setAcceptDialogVisible(false)}
        message="Ha ocurrido un error al cargar los vehículos"
        title="Error"
      />
      <ConfirmDialog
        visible={deleteDialogVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="¿Estás seguro de que deseas eliminar este vehículo?"
        title="Eliminar vehículo"
      />
      <AcceptDialog
        visible={visibleDialogDelete}
        onAccept={() => setVisibleDialogDelete(false)}
        message="Vehículo eliminado exitosamente"
        title="Eliminado"
      />
    </View>
  );
}
