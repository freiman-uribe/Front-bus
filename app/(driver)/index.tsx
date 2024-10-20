
import { Axios } from '@/resources/axios/axios';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, Modal, Portal, PaperProvider, Appbar } from 'react-native-paper';
import { es } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import QRCode from 'react-native-qrcode-svg';
import { BUS_DRIVER_STATUS } from '@/constants/Driver';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { UserAvatar } from '@/components/navigation/UserAvatar';
import { useSession } from '@/hooks/useSession';
import { theme } from '@/assets/css/style';
import { useRouter } from 'expo-router';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export default function Car() {
  const [listAssing, setListAssing] = useState([]);
  const [isModalQr, setIsModalQr] = useState(false)
  const [dataQr, setDataQr] = useState(null)
  const router = useRouter();
  const getAssignCarRoutes = async () => {
    try {
      const { data } = await Axios.get<any>("/bus-driver-manager/get-assigned-driver");
      setListAssing(data)
    } catch (error) {
      console.error("🚀 ~ listRH ~ error:", error);
    }
  };

  useEffect(() => {
    getAssignCarRoutes()
  }, [])

  const {session} = useSession()

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} >
      <Text style={styles.title}>¡Hola, {session?.full_name} {session?.last_name}!</Text>
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
                right={() => <Button style={{marginRight: 10}} compact mode='text'  onPress={() => {
                  router.push(`/(driver)/generate-qr/${driverBus.id}` as any)
                }}>Recoger</Button>}
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
      <Portal>
        <Modal visible={isModalQr} onDismiss={() => setIsModalQr(false)} contentContainerStyle={styles.modal}>
          <Text>QR</Text>
          <QRCode
            value={JSON.stringify(dataQr)}
            size={200}
          />
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
  },
  card: {
    margin: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 0
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
