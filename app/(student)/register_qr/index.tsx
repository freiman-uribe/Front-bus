
import { Axios } from '@/resources/axios/axios';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text, Modal, Portal, PaperProvider, Icon, IconButton } from 'react-native-paper';
import { es } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import QRCode from 'react-native-qrcode-svg';
import { BUS_DRIVER_STATUS } from '@/constants/Driver';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function RegisterQr( { navigation }:any ) {
  const [isModalQr, setIsModalQr] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [messageError, setMessageError] = useState('')
  const device = useCameraDevice('back')
  const { hasPermission, requestPermission  } = useCameraPermission()
  const [scannedCode, setCodeScanned] = useState<any>(null)

  const handleGenerateQr = async (dataQr:any) => {
    try {
      const { data } = await Axios.post<any>("/student-handler/save-list-for-qr", dataQr);
      console.log(data)
      setIsModalQr(true)
    } catch (error:any) {
      setErrorModal(true)
      setCodeScanned(null)
      setMessageError(error.status === 400 ? 'El QR ya fué registrado' : 'Hubo un error al registrar el qr')
      console.log("🚀 ~ listRH ~ error:", JSON.stringify(error));
    }
  }

  useEffect(() => {
    if (!hasPermission) {
      requestPermission()
    }
  }, [hasPermission])
  if (!hasPermission) return <Text>No tiene permisos</Text>
  if (device == null) return  <Text>No tiene camara xd</Text>

  useEffect(() => {
    setCodeScanned(null)
  }, [router])

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (codes.length > 0) {
        if (codes[0].value) {
          if (!scannedCode) {
            handleGenerateQr(JSON.parse(codes[0].value))
            setCodeScanned(codes[0]?.value)
          }
        }
      }
      return;
    },
  });

  return (
    <>
      <Camera
        style={StyleSheet.absoluteFillObject}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
      <Portal>
        <Modal dismissable={false} visible={isModalQr} onDismiss={() => setIsModalQr(false)} contentContainerStyle={styles.modal}>
          <Text>Entrada registrada correctamente</Text>
          <Button onPress={() => {
            setIsModalQr(false)
            router.back()
          }}>Ir al inicio</Button>
        </Modal>
      </Portal>

      <Portal>
        <Modal  visible={errorModal} onDismiss={() => setErrorModal(false)} contentContainerStyle={styles.modal}>
          <Text>{messageError}</Text>
          <Button onPress={() => {
            setErrorModal(false)
          }}>Cerrar</Button>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems:'flex-start',
    justifyContent: 'flex-start',
  },
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
