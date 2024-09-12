import { useState } from 'react';
import { View, Image, Alert, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Axios } from '@/resources/axios/axios';
import { styles } from './styles/style'

export default function HomeScreen() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
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
              <Text style={styles.cardSubtitle}> Aun no tienes cuenta? <Link style={styles.linkText} href="/register"> Registrarme </Link> </Text>
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

