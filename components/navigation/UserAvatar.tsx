import { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native'
import { router } from 'expo-router';
import { Avatar, Button, Menu } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserAvatar = () => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) router.replace('/(auths)/');
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
    <Menu
        contentStyle={{ marginBottom: 0 }}
        visible={visible}
        anchorPosition='bottom'
        statusBarHeight={30}
        onDismiss={closeMenu}
        anchor={
          <Pressable style={styles.avatarButton} onPress={openMenu}>
            <Avatar.Text size={40} label="FU" />
          </Pressable>
        }>
        <Menu.Item onPress={logout} title="Cerrar Sesión" />
      </Menu>
  );
}

const styles = StyleSheet.create({
  avatarButton: {
    marginRight: 10,
    width: '100%',
    marginBottom: 0
  }
})