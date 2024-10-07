import React, { useState, useEffect } from 'react';
import { View, Alert, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Axios } from '@/resources/axios/axios';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from './styles/style';
import { NumberInput } from '@/components/NumberInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { KeyboardAvoidingView } from 'react-native'; 

const schema = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio'),
  scheduleStart: Yup.string()
    .required('La hora de inicio es obligatoria')
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

export default function UpdateCarRouteScreen() {
  const [showPicker, setShowPicker] = useState(false);
  const [currentInput, setCurrentInput] = useState<'scheduleStart' | 'scheduleEnd'>('scheduleStart');
  const { id } = useLocalSearchParams(); 

  const {
    control,
    handleSubmit,
    setValue,
    watch,
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

  const watchScheduleStart = watch('scheduleStart');
  const watchScheduleEnd = watch('scheduleEnd');

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        const { data } = await Axios.get(`/car-route/${id}`);
        setValue('name', data.name);
        setValue('scheduleStart', data.scheduleStart);
        setValue('scheduleEnd', data.scheduleEnd);
        setValue('lactitude', data.lactitude);
        setValue('longitude', data.longitude);
        setValue('order', data.order);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la información de la ruta.');
        console.error('Error al cargar la ruta:', error);
      }
    };

    fetchRouteData();
  }, [id, setValue, router]);

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (event.type === 'set' && selectedTime) {
      const formattedTime = `${String(selectedTime.getHours()).padStart(2, '0')}:${String(selectedTime.getMinutes()).padStart(2, '0')}`;
      setValue(currentInput, formattedTime);
    }
    setShowPicker(false);
  };

  const onSubmit = async (data: any) => {
    try {
      await Axios.put(`/car-route/${id}`, data);
      Alert.alert('Ruta de bus actualizada', 'La ruta de bus se ha actualizado correctamente');
      reset();
      router.back();
    } catch (error: any) {
      const serverMessage = error.response?.data?.message || 'No se pudo actualizar la ruta de bus.';
      Alert.alert('Error', serverMessage);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <KeyboardAwareScrollView 
          contentContainerStyle={styles.container} 
          extraScrollHeight={100} // Ajusta este valor si es necesario
          keyboardShouldPersistTaps="handled"
        >
          
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Nombre de la Ruta"
                mode="outlined"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                style={{ marginBottom: 10 }}
                error={!!errors.name}
              />
            )}
          />
          {errors.name && <HelperText type="error">{errors.name.message}</HelperText>}
          <TextInput
            label="Hora de inicio"
            mode='outlined'
            value={watchScheduleStart}
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
            value={watchScheduleEnd}
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
            label="Latitud"
            errors={errors}
            icon={'map-marker'}
          />
          <NumberInput
            control={control}
            name="longitude"
            label="Longitud"
            errors={errors}
            icon={'map-marker'}
          />
          <NumberInput
            control={control}
            name="order"
            label="Orden"
            errors={errors}
            icon={'map-marker'}
          />

          <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.button}>
            Actualizar Ruta
          </Button>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
