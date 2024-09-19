import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Platform, ActivityIndicator } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import ButtonBack from '@/components/ButtonBack';
import { Axios } from '@/resources/axios/axios';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from './styles/style';
import { NumberInput } from '@/components/NumberInput';
import { format } from 'date-fns';

const schema = Yup.object().shape({
  scheduleStart: Yup.date().required('La fecha de inicio es obligatoria'),
  scheduleEnd: Yup.date()
    .required('La fecha final es obligatoria')
    .min(Yup.ref('scheduleStart'), 'La fecha final debe ser posterior a la de inicio'),
  lactitude: Yup.number()
    .typeError('La latitud debe ser un número')
    .required('La latitud es obligatoria'),
  longitude: Yup.number()
    .typeError('La longitud debe ser un número')
    .required('La longitud es obligatoria'),
  order: Yup.number()
    .typeError('El orden debe ser un número')
    .required('El orden es obligatorio'),
});

export default function UpdateCarRouteScreen() {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [currentInput, setCurrentInput] = useState<'scheduleStart' | 'scheduleEnd'>('scheduleStart');
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useLocalSearchParams(); // Obtén el ID de la ruta desde los parámetros
  const [routeData, setRouteData] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      scheduleStart: new Date(),
      scheduleEnd: new Date(),
      lactitude: 0,
      longitude: 0,
      order: 0,
    },
  });

  useEffect(() => {
    // Cargar los datos de la ruta por su ID
    const fetchRouteData = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('Error', 'No se pudo obtener el token de acceso.');
          return;
        }

        const response = await Axios.get(`/car-route/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRouteData(response.data);
        // Setea los valores en el formulario
        setValue('scheduleStart', new Date(response.data.schedule_start));
        setValue('scheduleEnd', new Date(response.data.schedule_end));
        setValue('lactitude', response.data.lactitude);
        setValue('longitude', response.data.longitude);
        setValue('order', response.data.order);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la información de la ruta.');
        console.error('Error al cargar la ruta:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRouteData();
  }, [id, setValue]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      if (pickerMode === 'date') {
        setPickerMode('time');
        setShowPicker(true);
        setValue(currentInput, selectedDate);
      } else {
        const currentDate = getValues(currentInput);
        const updatedDate = new Date(currentDate.setHours(selectedDate.getHours(), selectedDate.getMinutes()));
        setValue(currentInput, updatedDate);
        setShowPicker(false);
        setPickerMode('date');
      }
    } else {
      setShowPicker(false);
      setPickerMode('date');
    }
  };

  const formatDateTime = (date: Date) => format(date, 'dd/MM/yyyy hh:mm a');

  const onSubmit = async (data: any) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', 'No se pudo obtener el token de acceso.');
        return;
      }

      await Axios.put(`/car-route/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Ruta de bus actualizada', 'La ruta de bus se ha actualizado correctamente');
      router.back();
    } catch (error: any) {
      if (error.response) {
        const serverMessage = error.response.data?.message || JSON.stringify(error.response.data);
        Alert.alert('Error', `No se pudo actualizar la ruta de bus: ${serverMessage}`);
      } else {
        Alert.alert('Error', 'No se pudo actualizar la ruta de bus. Por favor, intenta de nuevo.');
      }
      console.error('Error al actualizar la ruta de bus:', error);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topContainer}>
        <ButtonBack />
      </View>

      <TextInput
        label="Fecha y hora de inicio"
        mode='outlined'
        value={formatDateTime(getValues('scheduleStart'))}
        right={<TextInput.Icon icon='calendar' />}
        style={{ marginBottom: 10 }}
        onFocus={() => {
          setCurrentInput('scheduleStart');
          setPickerMode('date');
          setShowPicker(true);
        }}
        error={!!errors.scheduleStart}
      />
      {errors.scheduleStart && <HelperText type="error">{errors.scheduleStart.message}</HelperText>}

      <TextInput
        label="Fecha y hora de fin"
        mode='outlined'
        style={{ marginBottom: 10 }}
        value={formatDateTime(getValues('scheduleEnd'))}
        right={<TextInput.Icon icon='calendar' />}
        onFocus={() => {
          setCurrentInput('scheduleEnd');
          setPickerMode('date');
          setShowPicker(true);
        }}
        error={!!errors.scheduleEnd}
      />
      {errors.scheduleEnd && <HelperText type="error">{errors.scheduleEnd.message}</HelperText>}

      {showPicker && (
        <DateTimePicker
          mode={pickerMode}
          value={getValues(currentInput)}
          onChange={handleDateChange}
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
        />
      )}

      <NumberInput
        control={control}
        name="lactitude"
        label="Latitud" errors={errors}
        icon={'map-marker'}
      />
      <NumberInput
        control={control}
        name="longitude"
        label="Longitud" errors={errors}
        icon={'map-marker'}
      />
      <NumberInput
        control={control}
        name="order"
        label="Orden" errors={errors}
        icon={'map-marker'}
      />

      <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
        Actualizar Ruta
      </Button>
    </ScrollView>
  );
}