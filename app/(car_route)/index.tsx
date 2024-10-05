import { View, ScrollView, Alert } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import { Button, Text } from 'react-native-paper'
import { styles } from './styles/style'
import { router } from 'expo-router'
import CustomDatatable from '@/components/datatable/datatable'
import ButtonBack from '@/components/ButtonBack'
import { Axios } from '@/resources/axios/axios'
import { useFocusEffect } from '@react-navigation/native'

const routesColumns = [
    { key: 'scheduleStart', label: 'Horario inicio' },
    { key: 'scheduleEnd', label: 'Horario final' },
    { key: 'longitude', label: 'Longitud' },
    { key: 'lactitude', label: 'Latitud' },
    { key: 'order', label: 'Orden' },
];

export default function CarRouteScreen() {
    const [carRoutesData, setCarRoutesData] = useState([]);

    const routesActions = {
        editUrl: true,
        delete: (id: string) => handleDelete(id),
    };

    const handleDelete = async (id: string) => {
        // Mostrar un mensaje de confirmación antes de eliminar
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que deseas eliminar esta ruta de bus?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    onPress: async () => {
                        try {
                            await Axios.delete(`/car-route/${id}`);
                            // Recargar los datos después de la eliminación
                            getCarRoutes();
                        } catch (error) {
                            console.error('Error al eliminar ruta de bus:', error);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };


    const getCarRoutes = async () => {
        try {
            const { data } = await Axios.get('/car-route');
            setCarRoutesData(data);
        } catch (error) {
            console.error('Error al obtener rutas de buses:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getCarRoutes();
        }, [])
    );

    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.topContainer}>
            <ButtonBack />
            <Button
              mode="contained"
              onPress={() => router.push("/create_car_rute/create")}
              style={styles.buttonAdd}
            >
              Agregar
            </Button>
          </View>
          <Text style={styles.title}>Rutas de Buses</Text>
          <CustomDatatable
            data={carRoutesData}
            columns={routesColumns}
            actions={routesActions}
          />
        </ScrollView>
      </View>
    );
}