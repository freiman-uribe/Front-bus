
import { useState, useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabTwoScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Error al verificar autenticidad:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      router.replace('/(auths)/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View>
      {!isLoggedIn ? <Text>no Login</Text> : <Text> Home <Button title="Cerrar Sesión" onPress={logout} /> </Text>}
    </View>
  );
}
