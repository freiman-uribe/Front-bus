import { useState } from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { Text, TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Axios } from '@/resources/axios/axios';
import { theme } from '@/assets/css/style';

export default function HomeScreen() {
  const [user, setUser] = useState('freiman@gmail.com');
  const [password, setPassword] = useState('freiman');
  const [hidePass, setHidePass] = useState(true);

  const handleLogin = async () => {
    try {
      const response = await Axios.post('/auth/login', {
        "email": user,
        password
      });
      const { data } = response.data;
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);

      router.replace('/(tabs)/explore');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert('Error', 'Ha ocurrido un problema al iniciar sesión');
    }
  };
  return (
    <View style={ styles.container }>
      <Image
        source={require('@/assets/images/logo_fet.png')}
        style={styles.logo}
      />
      <Text variant='headlineMedium'>Login</Text>
      <View>
          <TextInput
            mode='outlined'
            label='Usuario'
            value={user}
            onChangeText={(text) => setUser(text)}
            right={<TextInput.Icon icon='face-man-outline' />}
          />
          <TextInput
            mode='outlined'
            label='Password'
            value={password}
            secureTextEntry = {hidePass}
            onChangeText={(text) => setPassword(text)}
            right={<TextInput.Icon icon='eye' onPress={() => setHidePass(!hidePass)}/>}
          />
          <Button style={styles.btn} mode="contained" onPress={handleLogin}>
            Ingresar
          </Button>
          <Link style={styles.linkText} href="/register">Registrarme</Link>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: '30%',
  },
  logo: {
    margin: 'auto',
    width: 150,
    height: 70,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  btn: {
    marginVertical: 10,
    marginHorizontal: 100
  },
  linkText: {
    margin: 'auto',
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.dark,
  },
})
