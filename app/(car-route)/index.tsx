import { View, ScrollView, Alert } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import { Button, Text } from 'react-native-paper'
import { styles } from './styles/style'
import { Link, router } from 'expo-router'
import CustomDatatable from '@/components/datatable/datatable'
import ButtonBack from '@/components/ButtonBack'
import { Axios } from '@/resources/axios/axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { format } from 'date-fns'
import { useFocusEffect } from '@react-navigation/native'
import { boolean } from 'yup'

const routesColumns = [
    { key: 'schedule_start', label: 'Horario inicio' },
    { key: 'schedule_end', label: 'Horario final' },
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
                            const accessToken = await getAccessToken();
                            await Axios.delete(`/car-route/${id}`, {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`
                                }
                            });
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
    const getAccessToken = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            return token;
        } catch (error) {
            console.error('Error al obtener token:', error);
        }
    };

    const getCarRoutes = async () => {
        try {
            const accessToken = await getAccessToken();
            const { data } = await Axios.get('/car-route', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const formattedData = data.map((route: any) => ({
                ...route,
                schedule_start: format(new Date(route.schedule_start), 'dd/MM/yyyy HH:mm'),
                schedule_end: format(new Date(route.schedule_end), 'dd/MM/yyyy HH:mm'),
            }));

            setCarRoutesData(formattedData);
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
                        onPress={() => router.push('/(create-car-route)')}
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
        </View >
    )
}