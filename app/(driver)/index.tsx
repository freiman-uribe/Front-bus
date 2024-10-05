
import { Axios } from '@/resources/axios/axios';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, Modal, Portal, PaperProvider } from 'react-native-paper';
import { es } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import QRCode from 'react-native-qrcode-svg';
import { BUS_DRIVER_STATUS } from '@/constants/Driver';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

export default function Car() {
  const [listAssing, setListAssing] = useState([]);
  const [isModalQr, setIsModalQr] = useState(false)
  const [dataQr, setDataQr] = useState(null)
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

  const handleGenerateQr = async (id:string) => {
    try {
      const { data } = await Axios.post<any>("/bus-driver-manager/generate-qr", {
        bus_driver_id: id,
        status: BUS_DRIVER_STATUS.PICKING
      });
      setDataQr(data)
      setIsModalQr(true)
    } catch (error) {
      console.error("🚀 ~ listRH ~ error:", error);
    }
  }

  const device = useCameraDevice('back')
  const { hasPermission } = useCameraPermission()

  if (!hasPermission) return <></>
  if (device == null) return  <></>


  return (
    <ScrollView >
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />
      <Text style={styles.title} >Pagina de condutor</Text>
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
                <Button onPress={() => handleGenerateQr(driverBus.id)}>Recoger</Button>
              </Card.Actions>
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
  title: {
    fontSize: 20,
  },
  container: {
    padding: 20
  },
  modal: {
    margin:20,
    borderRadius: 10,
    backgroundColor: 'white', padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
