
import { Axios } from '@/resources/axios/axios';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, Modal, Portal, PaperProvider, Icon } from 'react-native-paper';
import { es } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import QRCode from 'react-native-qrcode-svg';
import { BUS_DRIVER_STATUS } from '@/constants/Driver';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useSession } from '@/hooks/useSession';
import { theme } from '@/assets/css/style';

export default function Car( { navigation }:any ) {
  const [listAssing, setListAssing] = useState([]);

  const getBusDriverData = async () => {
    try {
      const { data } = await Axios.post<any>("/student-handler/get-bus-driver");
      setListAssing(data)
      console.log('🚀 ~ getBusDriverData ~ data:', data)
    } catch (error) {
      console.error("🚀 ~ listRH ~ error:", error);
    }
  }
  const {session} = useSession()
  useEffect(() => {
    getBusDriverData()
  }, [])


  const handleEntrada = async (id:string) => {
    router.replace('/(student)/register_qr' as any);
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} >
      <Text style={styles.title}>¡Hola, {session?.full_name} {session?.last_name}!</Text>
      <Text style={styles.subtitle}>Rutas del día de hoy</Text>
      <View>
        {
          listAssing.map((driverBus:any) => (
            <Card style={styles.card}>
              <Card.Title
                title="Ruta 1"
                subtitle={
                  <View >
                    <Text>{`Hora de recogida: ${ format(parseISO(driverBus.route.schedule_start), 'hh:mm a', { locale: es }) }`}</Text>
                  </View>
                }
                right={() => <Button style={{marginRight: 10}} compact mode='text' onPress={() => handleEntrada(driverBus.id)}>Registrar QR</Button>}
              >
                </Card.Title>
              <Card.Content>
              
                <Text style={styles.cardText}>Latitud: {driverBus.route.lactitude}</Text>
                <Text style={styles.cardText}>Longitud: {driverBus.route.longitude}</Text>
              </Card.Content>
            </Card>
          ))
        }
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 0
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 10,
  },
  subtitle: {
    color: theme.colors.primary,
    marginBottom: 10,
  },
  modal: {
    margin:20,
    borderRadius: 10,
    backgroundColor: 'white', padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardText: {
      fontSize: 14,
      color: '#444',
      marginVertical: 4,
  },
})
