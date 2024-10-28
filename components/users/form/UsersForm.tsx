import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { CustomTextInput } from '@/components/CustomTextInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { ROLES } from '@/constants/Rol';
import { theme } from '@/assets/css/style';
import { Axios } from '@/resources/axios/axios';
import { formattedSelect } from '@/resources/helpers';
import { CustomDropdown } from '@/components/CustomDropdown';
import { router } from 'expo-router';

import DateTimePicker from '@react-native-community/datetimepicker';

type UsersFormProps = {
  rol?: string;
  initialData?: any;
};

const schemaValidation = yup.object().shape({
  full_name: yup.string().required('Nombre completo es requerido'),
  last_name: yup.string().required('Apellido es requerido'),
  email: yup.string().email('Email inválido').required('Email es requerido'),
  document: yup.string().required('Documento es requerido'),
  code_student: yup.string(),
  phone: yup.string(),
  birthdate: yup.string(),
  address: yup.string(),
  rol: yup.string().required('Rol es requerido'),
  rh_id: yup.string(),
  eps_id: yup.string(),
  program_academic_id: yup.string(),
});

export default function UsersForm({ rol, initialData }: UsersFormProps) {
  const [selectedRol, setSelectedRol] = useState(rol || initialData?.rol.code);
  const [rhList, setRhList] = useState<any>([]);
  const [epsList, setEpsList] = useState<any>([]);
  const [programList, setProgramList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  


  const { control, handleSubmit, formState: { errors }, reset, setValue, getValues } = useForm({
    resolver: yupResolver(schemaValidation),
    defaultValues: {
      rol: rol || initialData?.rol?.code || '',
      full_name: initialData?.full_name || '',
      last_name: initialData?.last_name || '',
      email: initialData?.email || '',
      document: initialData?.document || '',
      code_student: initialData?.code_student || '',
      phone: initialData?.phone || '',
      birthdate: initialData?.birthdate || '',
      address: initialData?.address || '',
      rh_id: initialData?.rh_id || '',
      eps_id: initialData?.eps_id || '',
      program_academic_id: initialData?.program_academic_id || '',
    },
  });

  useEffect(() => {
    reset({
      rol: rol || initialData?.rol?.code || '',
      full_name: initialData?.full_name || '',
      last_name: initialData?.last_name || '',
      email: initialData?.email || '',
      document: initialData?.document || '',
      code_student: initialData?.code_student || '',
      phone: initialData?.phone || '',
      birthdate: initialData?.birthdate || '',
      address: initialData?.address || '',
      rh_id: initialData?.rh_id || '',
      eps_id: initialData?.eps_id || '',
      program_academic_id: initialData?.program_academic_id || '',
    });
  }, [initialData, rol, reset]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (selectedRol === ROLES.STUDENT) {
        const { data } = await Axios.get('/common/list-types?codes=type_rh,type_eps');
        const formatRh = formattedSelect(data.find((item: any) => item.code === 'type_rh').listItem);
        const formatEps = formattedSelect(data.find((item: any) => item.code === 'type_eps').listItem);
        setRhList(formatRh);
        setEpsList(formatEps);

        const { data: programData } = await Axios.get('/common/programs');
        const formatPrograms = formattedSelect(programData);
        setProgramList(formatPrograms);
      }
    } catch (error) {
      console.error('🚀 ~ fetchData ~ error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedRol(rol || initialData?.rol.code);
  }, [rol, initialData]);

  useEffect(() => {
    fetchData();
  }, [selectedRol]);


  const onSubmit =async  (data: any) => {
    const isUpdating = !!initialData;

    if (data.rol === ROLES.DRIVER_BUS || data.rol === ROLES.ADMIN){
      delete data.code_student;
      delete data.birthdate;
      delete data.address;
      delete data.rh_id;
      delete data.eps_id;
      delete data.program_academic_id;

    } 

    try {
      if (isUpdating) {
       await Axios.put(`/users/${initialData.id}`, data);
      } else {
       await Axios.post('/users', data);
      }
      router.push('/(admin)/');
    } catch (error) {
      
      console.error('🚀 ~ onSubmit ~ error:', error);
    }

  };

 const handleDateChange = (event: any, selectedDate?: Date) => {
  if (event.type === 'set' && selectedDate) {
    // Establece la hora en 00:00:00
    selectedDate.setHours(0, 0, 0, 0);
    
    // Convierte la fecha con hora en 0 en el formato ISO (datetime) y actualiza el campo
    const formattedDate = selectedDate.toISOString(); 
    setValue("birthdate", formattedDate);
  }
  setShowPicker(false);
};

  
  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <>
          <Text style={styles.title}>{initialData ? 'Actualizar Usuario' : 'Crear Usuario'}</Text>
          <CustomTextInput control={control} name='full_name' label={'Nombre'} icon={'account'} error={errors.full_name} />
          <CustomTextInput control={control} name='last_name' label={'Apellidos'} icon={'account'} error={errors.last_name} />
          <CustomTextInput control={control} name='email' label={'Correo Electrónico'} icon={'email'} error={errors.email} />
          <CustomTextInput control={control} name='document' label={'Documento de identidad'} icon={'identifier'} error={errors.document} />
          <CustomTextInput control={control} name='phone' label={'Teléfono'} icon={'cellphone'} error={errors.phone} keyboardType='numeric' />

          {selectedRol === ROLES.STUDENT && (
            <>
              <CustomTextInput control={control} name='code_student' label={'Código de estudiante'} icon={'account'} error={errors.code_student} />
              <View style={{ marginBottom: 30 }}>
                <TextInput
                  label="Fecha de nacimiento"
                  mode='outlined'
                  value={getValues('birthdate')}
                  right={<TextInput.Icon icon='clock' />}

                  onFocus={() => {
                    setShowPicker(true);
                  }}
                  error={!!errors.birthdate}
                />
              </View>
              {errors.birthdate && <HelperText type="error">{errors.birthdate.message}</HelperText>}

              {showPicker && (
                <DateTimePicker
                  mode='date' 
                  value={new Date()}
                  onChange={handleDateChange}
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                />
              )}
              <CustomTextInput control={control} name='address' label={'Dirección'} icon={'directions'} error={errors.address} />
              <CustomDropdown control={control} name='rh_id' label={'RH'} options={rhList} error={errors.rh_id} />
              <CustomDropdown control={control} name='eps_id' label={'EPS'} options={epsList} error={errors.eps_id} />
              <CustomDropdown control={control} name='program_academic_id' label={'Programa académico'} options={programList} error={errors.program_academic_id} />
            </>
          )}

          <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.submitButton}>Guardar</Button>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 20,
  },
});
