import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Alert, ActivityIndicator, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { router, useLocalSearchParams } from 'expo-router';

import { useLists } from '@/hooks/useLists';
import { useFilePicker } from '@/hooks/useFilePicker';
import { CustomTextInput } from '@/components/CustomTextInput';
import { CustomDropdown } from '@/components/CustomDropdown';
import { styles } from './styles/styles';
import { Axios } from '@/resources/axios/axios';
import BtnPickFile from '@/components/BtnPickFile';

const schema = yup.object().shape({
  type: yup.string().required("Tipo es requerido"),
  company: yup.string().required("Compañía es requerida"),
  placa: yup.string().required("Placa es requerida"),
  color: yup.string().required("Color es requerido"),
  size: yup
    .number()
    .typeError("Capacidad debe ser un número")
    .positive("Capacidad debe ser mayor a 0")
    .required("Capacidad es requerida"),
});

export default function FormCar() {
  const { id } = useLocalSearchParams();
  const { typeList, companyList } = useLists();
  const { selectedFiles, pickFile } = useFilePicker();
  const [fileUrls, setFileUrls] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [loadingCar, setLoadingCar] = useState(true);
  const requiredFiles = [
    { label: 'Seguro', fileKey: 'seguro' },
    { label: 'Tarjeta de Propietario', fileKey: 'tarjeta_de_propietario' },
    { label: 'Seguro Todo Riesgo', fileKey: 'seguro_todo_riesgo' },
    { label: 'Tecnomecánica', fileKey: 'tecnomecanica' },

  ];
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: "",
      company: "",
      placa: "",
      color: "",
      size: 0,
    },
  });


  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoadingCar(true);
        const response = await Axios.get(`/config/car/${id}`);
        const carData = response.data;

        setValue('type', carData.type_id);
        setValue('company', carData.company_id);
        setValue('placa', carData.placa);
        setValue('color', carData.color);
        setValue('size', carData.size.toString());

        
        setFileUrls({
          tarjeta_de_propietario: carData.tarjeta_de_propietario,
          seguro: carData.seguro,
          seguro_todo_riesgo: carData.seguro_todo_riesgo,
          tecnomecanica: carData.tecnomecanica,
        });
      } catch (error) {
        Alert.alert("Error", "No se pudo cargar la información del coche.");
      } finally {
        setLoadingCar(false);
      }
    };

    fetchCarData();
  }, [id, setValue]);
  console.log("Archivos seleccionados:", selectedFiles);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("company", data.company);
    formData.append("placa", data.placa);
    formData.append("color", data.color);
    formData.append("size", data.size.toString());
  
    
    Object.keys(selectedFiles).forEach((key) => {
      const file = selectedFiles[key];
      if (file && file.uri && file.type && file.name) {
        const fileBlob = {
          uri: file.uri,
          type: file.type,
          name: file.name,
        } as any;
        formData.append(key, fileBlob);
      } else {
        console.error(`Archivo faltante o inválido: ${key}`, file);
      }
    });
  
    setLoading(true);
  
    try {
      await Axios.put(`/config/car/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Éxito", "Datos editados correctamente");
      router.navigate("/(admin)/car");
    } catch (error: any) {
      Alert.alert("Error", "Ocurrió un problema al editar los datos");
      console.log("Error al editar coche:", error.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    loadingCar
      ? <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando...</Text>
      </View>
      : (
        <View style={styles.container}>
          <Modal visible={loading} transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.modalText}>Guardando...</Text>
              </View>
            </View>
          </Modal>

          <ScrollView style={{ paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
            <CustomDropdown control={control} name="type" label="Tipo" options={typeList} error={errors.type} />
            <CustomDropdown control={control} name="company" label="Compañía" options={companyList} error={errors.company} />
            <CustomTextInput control={control} name="placa" label="Placa" icon="identifier" error={errors.placa} />
            <CustomTextInput control={control} name="color" label="Color" icon="invert-colors" error={errors.color} />
            <CustomTextInput control={control} name="size" label="Capacidad" icon="account-multiple" keyboardType="numeric" error={errors.size} />

            {requiredFiles.map(({fileKey, label}) => (
              <BtnPickFile
                key={fileKey}
                label={label}
                fileKey={fileKey}
                fileUrls={fileUrls}
                selectedFiles={selectedFiles}
                pickFile={pickFile}
              />
            ))}
            <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.submitButton}>Guardar</Button>
          </ScrollView>
        </View>
      )
  );
}
