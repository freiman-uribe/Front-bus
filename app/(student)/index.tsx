
import { Axios } from '@/resources/axios/axios';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, Modal, Portal, PaperProvider } from 'react-native-paper';
import { es } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import QRCode from 'react-native-qrcode-svg';
import { BUS_DRIVER_STATUS } from '@/constants/Driver';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function Car( { navigation }:any ) {
  const [listAssing, setListAssing] = useState([]);
  const [isModalQr, setIsModalQr] = useState(false)
  const [dataQr, setDataQr] = useState(null)


  const getBusDriverData = async () => {
    try {
      const { data } = await Axios.post<any>("/student-handler/get-bus-driver");
      setListAssing(data)
      console.log('🚀 ~ getBusDriverData ~ data:', data)
    } catch (error) {
      console.error("🚀 ~ listRH ~ error:", error);
    }
  }

  const device = useCameraDevice('back')
  const { hasPermission, requestPermission  } = useCameraPermission()

  useEffect(() => {
    getBusDriverData()
  }, [])


  const handleEntrada = async (id:string) => {
    router.replace('/(student)/register_qr' as any);
  }
  return (
    <ScrollView >
      <Text style={styles.title} >Pagina de estudiante</Text>
      <View style={styles.container}>
        {
          listAssing.map((driverBus:any) => (
            <Card>
              <Card.Title title="Ruta 1" subtitle={`Hora de recogida: ${ format(parseISO(driverBus.route.schedule_start), 'hh:mm a', { locale: es }) }`}  />
              <Card.Content>
                <Text variant="titleLarge">Card title</Text>
                <Text variant="bodyMedium">Card content</Text>
              </Card.Content>
              <Card.Actions>
                {/* <Button>Cancel</Button> */}
                <Button onPress={() => handleEntrada(driverBus.id)}>Registrar entrada</Button>
              </Card.Actions>
            </Card>
          ))
        }
      </View>
      {/* <Camera
        style={StyleSheet.absoluteFillObject}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />  */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
  },
  modal: {
    margin:20,
    borderRadius: 10,
    backgroundColor: 'white', padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
