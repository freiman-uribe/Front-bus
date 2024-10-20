
import { Axios } from '@/resources/axios/axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text, Modal, Portal } from 'react-native-paper';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function RegisterQr( { navigation }:any ) {
  const [isModalQr, setIsModalQr] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [messageError, setMessageError] = useState('')
  const device = useCameraDevice('back')
  const { hasPermission, requestPermission } = useCameraPermission()
  const [scannedCode, setCodeScanned] = useState<any>(null)

  const handleGenerateQr = async (dataQr:any) => {
    try {
      const { data } = await Axios.post<any>("/student-handler/save-list-for-qr", dataQr);
      setIsModalQr(true)
    } catch (error:any) {
      setErrorModal(true)
      setCodeScanned(error.status === 400 ? 'Registrado' : null)
      setMessageError(error.status === 400 ? 'El QR ya fué registrado' : 'Hubo un error al registrar el qr')
      console.log("🚀 ~ listRH ~ error:", JSON.stringify(error));
    }
  }

  useEffect(() => {
    const requestCameraPermission = async () => {
      if (!hasPermission) {
        await requestPermission();
      }
    };
    requestCameraPermission();
  }, [])
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (codes.length > 0) {
        if (codes.length > 0 && codes[0].value && !scannedCode) {
          handleGenerateQr(JSON.parse(codes[0].value));
          setCodeScanned(codes[0].value);
        }
      }
      return;
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      setCodeScanned(null); 
      return () => {};
    }, [])
  );


  if (!hasPermission) return <Text>No tiene permisos</Text>
  if (!device) return  <Text>No tiene camara</Text>

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
            router.back()
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
