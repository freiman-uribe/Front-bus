import React, { useEffect } from 'react';
import { View } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Axios } from '@/resources/axios/axios';
import AcceptDialog from '@/components/confirms/AcceptDialog';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { styles } from './styles/updateStyles';

const schema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre del plan es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  amount_perday: Yup.number()
    .required('El monto por día es obligatorio')
    .positive('El monto debe ser un número positivo')
    .integer('El monto debe ser un número entero'),
  equals_day: Yup.number()
    .required('Los días equivalentes son obligatorios')
    .positive('Los días equivalentes deben ser un número positivo')
    .integer('Los días equivalentes deben ser un número entero'),
});

interface FormData {
  name: string;
  amount_perday: number;
  equals_day: number;
}

interface PlansCreateScreenProps {
  route: {
    params: {
      planId: string; // ID del plan a editar
    };
  };
}

const PlansCreateScreen: React.FC<PlansCreateScreenProps> = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [AcceptDialogVisible, setAcceptDialogVisible] = React.useState(false);

  // Función para cargar los datos del plan
  const loadPlanData = async () => {
    try {
      const response = await Axios.get(`/plans/${id}`);
      const { name, amount_perday, equals_day } = response.data;
      setValue('name', name);
      setValue('amount_perday', amount_perday);
      setValue('equals_day', equals_day);
    } catch (error) {
      alert('Error al cargar los datos del plan');
    }
  };

  useEffect(() => {
    loadPlanData(); // Carga los datos cuando se monta el componente
  }, []);

  const handleSave = async (data: FormData) => {
    try {
      await Axios.patch(`/plans/${id}`, data); 
      setAcceptDialogVisible(true);
    } catch (error) {
      alert('Error al guardar el plan');
    }
  };

  const handleAccept = () => {
    setAcceptDialogVisible(false);
    router.navigate('/(admin)/plans');
  }

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Nombre del Plan"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            mode="outlined"
            style={{ marginBottom: 8 }}
          />
        )}
        name="name"
      />
      {errors.name && <HelperText type="error">{errors.name.message}</HelperText>}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Monto por Día"
            value={value?.toString()} 
            onBlur={onBlur}
            onChangeText={text => onChange(Number(text))}
            keyboardType="numeric"
            mode="outlined"
            style={{ marginBottom: 8 }}
          />
        )}
        name="amount_perday"
      />
      {errors.amount_perday && <HelperText type="error">{errors.amount_perday.message}</HelperText>}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Días Equivalentes"
            value={value?.toString()} 
            onBlur={onBlur}
            onChangeText={text => onChange(Number(text))}
            keyboardType="numeric"
            mode="outlined"
            style={{ marginBottom: 8 }}
          />
        )}
        name="equals_day"
      />
      {errors.equals_day && <HelperText type="error">{errors.equals_day.message}</HelperText>}

      <Button mode="contained" onPress={handleSubmit(handleSave)}>
        Guardar
      </Button>
      <AcceptDialog
        visible={AcceptDialogVisible}
        onAccept={handleAccept}
        title="Plan Guardado"
        message="El plan ha sido guardado exitosamente"
      />
    </View>
  );
};

export default PlansCreateScreen;
