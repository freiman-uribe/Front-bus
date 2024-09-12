import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native'
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
    <View>
      <Menu
          style={styles.menuAvatar}
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Button style={styles.avatarButton} onPress={openMenu}>
              <Avatar.Text size={50} label="FU" />
            </Button>
          }>
          <Menu.Item onPress={logout} title="Cerrar Sesión" />
        </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  menuAvatar: {
    marginTop: 80
  },
  avatarButton: {
    width: '100%'
  }
})