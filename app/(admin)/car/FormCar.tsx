import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { Axios } from '@/resources/axios/axios';
import { styles } from './styles/style';
import { Dropdown } from 'react-native-paper-dropdown';
import { Button, TextInput } from 'react-native-paper';
import { formattedSelect } from '@/resources/helpers';

export default function FormCar() {

  const [form, setForm] = useState({
    type: "",
    company: "",
    placa: "",
    color: "",
    size: 0,
  });

  const [typeList, setTypeList] = useState<any>([]);
  const [companyList, setCompanyList] = useState<any>([]);

  const listType = async () => {
    try {
      const { data } = await Axios.get("/common/list-types?codes=type_card");
      const formatType = formattedSelect(data[0].listItem);
      setTypeList(formatType);
    } catch (error) {
      console.error("🚀 ~ listRH ~ error:", error);
    }
  };
  
  const listCompany = async () => {
    try {
      const { data } = await Axios.get("/common/list-types?codes=type_company");
      const formatCompany = formattedSelect(data[0].listItem);
      setCompanyList(formatCompany);
    } catch (error) {
      console.error("🚀 ~ listRH ~ error:", error);
    }
  };

  const handleLogin = async () => {
    console.log("🚀 ~ handleLogin ~ form:", form);
    try {
      await Axios.post("/config/car", form);
      // await listCar();
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Alert.alert("Error", "Ha ocurrido un problema al iniciar sesión");
    }
  };

  useEffect(() => {
    listType();
    listCompany();
  }, []);
  return (
    <View>
      <View style={styles.input}>
        <Dropdown
          label="Tipo"
          mode="outlined"
          onSelect={(text) => setForm({ ...form, type: text })}
          options={typeList}
          value={form.type}
          hideMenuHeader={true}
        />
      </View>
      <View style={styles.input}>
        <Dropdown
          label="Compañia"
          mode="outlined"
          onSelect={(text) => setForm({ ...form, company: text })}
          options={companyList}
          value={form.company}
          hideMenuHeader={true}
        />
      </View>
      <TextInput
        mode="outlined"
        label="Placa"
        value={form.placa}
        onChangeText={(text) => setForm({ ...form, placa: text })}
        right={<TextInput.Icon icon="identifier" />}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Color"
        value={form.color}
        onChangeText={(text) => setForm({ ...form, color: text })}
        right={<TextInput.Icon icon="invert-colors" />}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Capacidad"
        keyboardType="numeric"
        value={form.size.toString()}
        onChangeText={(text) => setForm({ ...form, size: Number(text) })}
        right={<TextInput.Icon icon="bus-school" />}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleLogin}>
        Guardar
      </Button>
    </View>
  );
}
