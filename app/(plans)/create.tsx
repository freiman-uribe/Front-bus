import React from 'react';
import { View } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { styles } from './styles/createStyles';
import { Axios } from '@/resources/axios/axios';
import AcceptDialog from '@/components/confirms/AcceptDialog';
import { useRouter } from 'expo-router';


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

const PlansCreateScreen: React.FC = () => {
  const router = useRouter();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [AcceptDialogVisible, setAcceptDialogVisible] = React.useState(false);

  const handleSave = async (data: FormData) => {
    try {
        Axios.post('/plans', data);
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
