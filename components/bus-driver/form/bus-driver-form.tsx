import { View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-native-paper';
import { Axios } from '@/resources/axios/axios';
import { router, useFocusEffect } from 'expo-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import DropDownDrivers from './DropDownDrivers';
import DropDownRoutes from './DropDownRoutes';
import DropDownCars from './DropDownCars';
import BtnPickFile from '@/components/BtnPickFile';
import { useFilePicker } from '@/hooks/useFilePicker';
import { theme } from '@/assets/css/style';

const validationSchema = Yup.object().shape({
    driver_id: Yup.string().required('El campo es requerido'),
    car_id: Yup.string().required('El campo es requerido'),
    route_id: Yup.string().required('El campo es requerido'),
});  

type BusDriverFormProps = {
    initialValues?: {
        id: string;
        driver_id: string;
        car_id: string;
        route_id: string;
        license: string;
    };
};  

export default function BusDriverForm({ initialValues }: BusDriverFormProps) {
    const [cars, setCars] = useState<any>([]);
    const [routes, setRoutes] = useState<any>([]);
    const [drivers, setDrivers] = useState<any>([]);
    const { selectedFiles, pickFile } = useFilePicker();
    const [fileUrls, setFileUrls] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(true); // Estado de carga para los datos
    const [submitting, setSubmitting] = useState(false); // Estado de carga para el envío del formulario

    const requiredFiles =[ { label: 'Licencia', fileKey: 'license' } ];  

    const fetchCars = async () => {
        try {
            const { data: cars } = await Axios.get('/config/car');
            setCars(cars);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchRoutes = async () => {
        try {
            const { data: routes } = await Axios.get('/car-route');
            setRoutes(routes);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchDrivers = async () => {
        try {
            const { data: drivers } = await Axios.get('/drivers');
            setDrivers(drivers);
        } catch (error) {
            console.log(error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setLoading(true); // Activar estado de carga al iniciar la carga de datos
                await Promise.all([fetchCars(), fetchDrivers(), fetchRoutes()]);
                setLoading(false); // Desactivar estado de carga cuando se hayan cargado los datos
            };

            fetchData();
        }, [])
    );

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(validationSchema),
    });

    // Resetear el formulario con valores iniciales si se proporcionan
    useEffect(() => {
        if (initialValues) {
            reset(initialValues);
            setFileUrls({ license: initialValues.license });
        }
    }, [initialValues, reset]);

    const onSubmit = async (data: any) => {
        if (!initialValues && !Object.keys(selectedFiles).length) {
            Alert.alert("Error", "El archivo de licencia es requerido");
            return;
        }

        setSubmitting(true); // Activar estado de carga al enviar el formulario

        const formData = new FormData();
        formData.append("driver_id", data.driver_id);
        formData.append("car_id", data.car_id);
        formData.append("route_id", data.route_id);
        Object.keys(selectedFiles).forEach((key) => {
            formData.append(key, {
                uri: selectedFiles[key].uri,
                type: selectedFiles[key].type,
                name: selectedFiles[key].name,
            } as any); 
        });
      
        try {
           if (initialValues) {
                await Axios.put(`/bus-driver/${initialValues.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await Axios.post("/bus-driver", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }
            Alert.alert("Éxito", "Datos guardados correctamente");
            router.navigate("/(admin)/bus-driver");
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Ocurrió un problema al guardar los datos");
        } finally {
            setSubmitting(false); // Desactivar estado de carga cuando termine el envío
        }
    };

    // Mostrar el ActivityIndicator mientras se cargan los datos
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text>Cargando datos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <DropDownDrivers control={control} errors={errors} drivers={drivers} />
            <DropDownRoutes control={control} errors={errors} routes={routes} />
            <DropDownCars control={control} errors={errors} cars={cars}  />
            
            {requiredFiles.map(({ fileKey, label }) => (
                <BtnPickFile
                    key={fileKey}
                    label={label}
                    fileKey={fileKey}
                    selectedFiles={selectedFiles}
                    fileUrls={fileUrls}
                    pickFile={pickFile}
                />
            ))}

            {submitting ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
                <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.submitButton}>
                    Guardar
                </Button>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    submitButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 4,
        justifyContent: 'center',
        marginTop: 20,
        paddingVertical: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
