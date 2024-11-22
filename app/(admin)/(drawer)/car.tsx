import React, { useState, useCallback } from 'react';
import { Button, Card, FAB, Text } from 'react-native-paper';
import { Axios } from '@/resources/axios/axios';
import { ScrollView, StyleSheet, View } from 'react-native';
import { theme } from '@/assets/css/style';
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
                <Button mode="outlined" onPress={() => router.navigate(`/(admin)/car/update/${car.id}`)} style={styles.editButton}>
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
        onPress={() => router.navigate('/(admin)/car/create')}
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollContainer: {
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    elevation: 3,
    marginHorizontal: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  cardDetail: {
    fontSize: 14,
    marginVertical: 2,
    color: theme.colors.darkGray,
  },
  cardActions: {
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    flex: 1,
  },
  floatButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: theme.colors.primary,
  },
});
