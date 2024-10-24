import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import BusDriverForm from '@/components/bus-driver/form/bus-driver-form';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Axios } from '@/resources/axios/axios';
import { theme } from '@/assets/css/style'; // Asegúrate de tener definido el tema con colores

export default function UpdateBusDriver() {
  const { id } = useLocalSearchParams();
  const [busDriver, setBusDriver] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Estado de carga agregado

  const fetchBusDriver = async () => {
    try {
      setLoading(true); // Iniciar estado de carga al comenzar la solicitud
      const { data: busDriver } = await Axios.get(`/bus-driver/${id}`);
      setBusDriver(busDriver);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Detener el estado de carga después de completar la solicitud
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBusDriver();
    }, [id])
  );

  // Mostrar un indicador de carga mientras se obtienen los datos
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <BusDriverForm initialValues={busDriver} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
