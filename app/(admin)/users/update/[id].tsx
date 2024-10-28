import { Alert, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import UsersForm from '@/components/users/form/UsersForm'
import { useLocalSearchParams } from 'expo-router';
import { Axios } from '@/resources/axios/axios';
import { set } from 'date-fns';
import { ActivityIndicator, Text } from 'react-native-paper';

export default function UpdateUserScreen() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data } = await Axios.get(`/users/${id}`);
      setUser(data);
    } catch (error) {
      Alert.alert('Error', 'Error al cargar los detalles del usuario');
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [id]);

  if(loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <UsersForm initialData={user} />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});