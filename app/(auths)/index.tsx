import { useState } from 'react';
import { View, Image, Alert, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Axios } from '@/resources/axios/axios';
import { styles } from './styles/style'
import { jwtDecode } from 'jwt-decode';
import { ROLES } from '@/constants/Rol';

export default function HomeScreen() {
  const [user, setUser] = useState('ander_co@fet.com');
  const [password, setPassword] = useState('hola.123');
  const [hidePass, setHidePass] = useState(true);

  const handleLogin = async () => {
    try {
      const { data } = await Axios.post('/auth/login', {
        "email": user,
        password
      });

      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;

      const decodedToken = jwtDecode(accessToken) as any;

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      const cases = {
        [ROLES.ADMIN]: '/(admin)',
        [ROLES.STUDENT]: '/(student)',
        [ROLES.DRIVER_BUS]: '/(driver)',
      }
      router.replace(cases[decodedToken.rol] || '/(auths)' as any);
    } catch (error) {
      console.error('Error al iniciar sesión:', JSON.stringify(error));
      Alert.alert('Error', 'Ha ocurrido un problema al iniciar sesión');
    }
  };
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/logo_fet.png')}
          style={styles.logo}
        />
        <Card style={styles.card}>
          <Card.Content>
              <Text variant="headlineLarge" style={styles.cardTitle}>Login</Text>
              <Text style={styles.cardSubtitle}> Aún no tienes cuenta? <Link style={styles.linkText} href="/register"> Registrarse </Link> </Text>
            <View style={styles.cardBody}>
                <TextInput
                  mode='outlined'
                  label='Usuario'
                  value={user}
                  onChangeText={(text) => setUser(text)}
                  right={<TextInput.Icon icon='account' />}
                  style={styles.input}
                />
                <TextInput
                  mode='outlined'
                  label='Password'
                  value={password}
                  secureTextEntry = {hidePass}
                  onChangeText={(text) => setPassword(text)}
                  right={<TextInput.Icon icon='eye' onPress={() => setHidePass(!hidePass)}/>}
                  style={styles.input}
                />
                
                <Button style={styles.btn} mode="contained" onPress={handleLogin}>
                  Ingresar
                </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

