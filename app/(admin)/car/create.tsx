import React, { useState } from 'react';
import { View, ScrollView, Text, Alert, ActivityIndicator, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { router } from 'expo-router';

import { useLists } from '@/hooks/useLists';
import { useFilePicker } from '@/hooks/useFilePicker';
import { CustomTextInput } from '@/components/CustomTextInput';
import { CustomDropdown } from '@/components/CustomDropdown';
import { styles } from './styles/styles';
import { Axios } from '@/resources/axios/axios';
import BtnPickFile from '@/components/BtnPickFile';
import AcceptDialog from '@/components/confirms/AcceptDialog';

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
  const { typeList, companyList } = useLists();
  const { selectedFiles, pickFile } = useFilePicker();
  const [loading, setLoading] = useState(false); 
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const requiredFiles = [
    { label: 'Seguro', fileKey: 'seguro' },
    { label: 'Tarjeta de Propietario', fileKey: 'tarjeta_de_propietario' },
    { label: 'Seguro Todo Riesgo', fileKey: 'seguro_todo_riesgo' },
    { label: 'Tecnomecánica', fileKey: 'tecnomecanica' },
  ]
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

  const onSubmit = async (data: any) => {
   
    const missingFiles = requiredFiles.filter(file => !selectedFiles[file.fileKey]);

    if (missingFiles.length > 0) {
        Alert.alert("Error", `Los siguientes archivos son requeridos: ${missingFiles.map(f => f.label).join(", ")}`);
        return;
    }

    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("company", data.company);
    formData.append("placa", data.placa);
    formData.append("color", data.color);
    formData.append("size", data.size.toString());

    Object.keys(selectedFiles).forEach((key) => {
      formData.append(key, {
        uri: selectedFiles[key].uri,
        type: selectedFiles[key].type,
        name: selectedFiles[key].name,
      } as any); 
    });

    setLoading(true); 

    try {
      await Axios.post("/config/car", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Éxito", "Datos guardados correctamente");
      router.navigate("/(admin)/car");
    } catch (error : any) {
      if (error.response.status === 400){
        setModalVisible(true);
        setMessage(error.response.data.message);
        return;
      }
      setModalVisible(true);
      setMessage("Ocurrió un error al guardar los datos");
    } finally {
      setLoading(false); 
    }
  };

  return (
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

        {requiredFiles.map(({fileKey ,label}) => (
         <BtnPickFile
            key={fileKey}
            fileKey={fileKey}
            label={label}
            selectedFiles={selectedFiles}
            pickFile={pickFile}
          />
        ))}

        <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.submitButton}>Guardar</Button>
        <AcceptDialog
          visible={modalVisible} 
          onAccept={() => setModalVisible(false)} 
          message={message} 
          title="Error"
        />
      </ScrollView>
    </View>
  );
}