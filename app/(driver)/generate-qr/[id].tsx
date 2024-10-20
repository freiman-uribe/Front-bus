import { Axios } from '@/resources/axios/axios';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, List, ActivityIndicator } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { BUS_DRIVER_STATUS } from '@/constants/Driver';
import { theme } from '@/assets/css/style';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import useSocket from '@/hooks/useSocket';

export default function GenerateQr() {

  const { messages, sendMessage } = useSocket('http://192.168.0.7:3000'); 

  const [listAssign, setListAssign] = useState<any>([]);
  const [dataQr, setDataQr] = useState<any>(null);
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (messages.length > 0) {
      if (messages.includes('ACTUALIZAR')) {
        getUsersRegisters(dataQr.id)
      }
    }
  }, [messages])

  const handleGenerateQr = async () => {
    try {
      const { data } = await Axios.post<any>("/bus-driver-manager/generate-qr", {
        bus_driver_id: id,
        status: BUS_DRIVER_STATUS.PICKING
      });
      setDataQr(data);
      getUsersRegisters(data.id)
      setLoading(false);

    } catch (error) {

      console.error("🚀 ~ error:", error);
      setLoading(false);
    }
  };

  const getUsersRegisters = async (id:string) => {
    try {

      const { data } = await Axios.get<any>("/bus-driver-manager/get-users-register/" + id);
      setListAssign(data);
    } catch (error) {
      console.error("🚀 ~ error:", error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleGenerateQr();
      return () => {
        setListAssign([]); 
      };
    }, [])
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>¡Escanea el QR!</Text>
      
      {/* Muestra el QR o un indicador de carga */}
      <View style={styles.qrContainer}>
        {loading ? (
          <ActivityIndicator animating={true} color={theme.colors.primary} />
        ) : (
          <QRCode
            value={JSON.stringify(dataQr)}
            size={200}
            backgroundColor="white"
          />
        )}
      </View>

      {/* Lista de nombres y estatus */}
      <Text style={styles.listTitle}>Lista de asignaciones</Text>
      {listAssign.length > 0 ? (
        <Card style={styles.card}>
          {listAssign.map((item:any, index:number) => (
            <List.Item
              key={index}
              title={item.user.full_name + ' ' + item.user.last_name}
              description={`Estado: Registrado`}
              left={(props) => <List.Icon {...props} icon="account" />}
              style={styles.listItem}
            />
          ))}
        </Card>
      ) : (
        <Text style={styles.noDataText}>No hay asignaciones disponibles.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.colors.primary,
  },
  card: {
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 2,
    marginBottom: 20,
  },
  listItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  noDataText: {
    textAlign: 'center',
    color: '#777',
    marginVertical: 20,
  },
});
