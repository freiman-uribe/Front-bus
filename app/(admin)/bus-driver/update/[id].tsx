import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useCallback, useState } from 'react';
import BusDriverForm from '@/components/bus-driver/form/bus-driver-form';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Axios } from '@/resources/axios/axios';
import { theme } from '@/assets/css/style';

export default function UpdateBusDriver() {
  const { id } = useLocalSearchParams();
  const [busDriver, setBusDriver] = useState<any>(null);
  const [loading, setLoading] = useState(true); 

  const fetchBusDriver = async () => {
    try {
      setLoading(true); 
      const { data: busDriver } = await Axios.get(`/bus-driver/${id}`);
      setBusDriver(busDriver);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); 
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBusDriver();
    }, [id])
  );

  
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
