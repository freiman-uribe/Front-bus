import React, { useState } from 'react';
import { View, ScrollView, Alert, Platform } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import ButtonBack from '@/components/ButtonBack';
import { Axios } from '@/resources/axios/axios';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from './styles/style';
import { NumberInput } from '@/components/NumberInput';

const schema = Yup.object().shape({
  scheduleStart: Yup.string()
    .required('La fecha de inicio es obligatoria')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:mm)'),
  scheduleEnd: Yup.string()
    .required('La hora final es obligatoria')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:mm)')
    .test('is-greater', 'La hora final debe ser posterior a la de inicio', function (value) {
      const { scheduleStart } = this.parent;
      return value ? value > scheduleStart : false;
    }),
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

export default function CreateCarRouteScreen() {
  const [showPicker, setShowPicker] = useState(false);
  const [currentInput, setCurrentInput] = useState<'scheduleStart' | 'scheduleEnd'>('scheduleStart');

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      scheduleStart: '',
      scheduleEnd: '',
      lactitude: 0,
      longitude: 0,
      order: 0,
    },
  });

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (event.type === 'set' && selectedTime) {
      const formattedTime = `${String(selectedTime.getHours()).padStart(2, '0')}:${String(selectedTime.getMinutes()).padStart(2, '0')}`;
      setValue(currentInput, formattedTime);
    }
    setShowPicker(false);
  };



  const onSubmit = async (data: any) => {
    try {
      await Axios.post('/car-route', data);
      Alert.alert('Ruta de bus creada', 'La ruta de bus se ha creado correctamente');
      reset();
      router.back();
    } catch (error: any) {
      const serverMessage = error.response?.data?.message || 'No se pudo crear la ruta de bus.';
      Alert.alert('Error', serverMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topContainer}>
        <ButtonBack />
      </View>

      <TextInput
        label="Hora de inicio"
        mode='outlined'
        value={getValues('scheduleStart')}
        right={<TextInput.Icon icon='clock' />}
        style={{ marginBottom: 10 }}
        onFocus={() => {
          setCurrentInput('scheduleStart');
          setShowPicker(true);
        }}
        error={!!errors.scheduleStart}
      />
      {errors.scheduleStart && <HelperText type="error">{errors.scheduleStart.message}</HelperText>}

      <TextInput
        label="Hora de fin"
        mode='outlined'
        value={getValues('scheduleEnd')}
        right={<TextInput.Icon icon='clock' />}
        style={{ marginBottom: 10 }}
        onFocus={() => {
          setCurrentInput('scheduleEnd');
          setShowPicker(true);
        }}
        error={!!errors.scheduleEnd}
      />
      {errors.scheduleEnd && <HelperText type="error">{errors.scheduleEnd.message}</HelperText>}

      {showPicker && (
        <DateTimePicker
          mode='time'
          value={new Date()}
          onChange={handleTimeChange}
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
        Guardar Ruta
      </Button>
    </ScrollView>
  );
}
