import React, { useState } from 'react';
import { Alert, Platform, TouchableWithoutFeedback, Keyboard, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Axios } from '@/resources/axios/axios';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from './styles/styles';
import { NumberInput } from '@/components/NumberInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { KeyboardAvoidingView } from 'react-native'; 

const schema = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio'),
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
      name: '',
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <KeyboardAwareScrollView 
          contentContainerStyle={styles.container} 
          extraScrollHeight={100} 
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
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
