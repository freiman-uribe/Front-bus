import React, { useEffect, useState } from 'react';
import { View, Image, Alert, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Text, TextInput, Button, Card, ActivityIndicator } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown'; // Importar la nueva librería
import { Axios } from '@/resources/axios/axios';
import { formattedSelect } from '@/resources/helpers';
import { styles } from './styles/style';

export default function Register() {
    const [form, setForm] = useState({
        full_name: '',
        last_name: '',
        document: '',
        email: '',
        password: '',
        code_student: '',
        code_program: '',
        rh: '',
        eps: ''
    });

    const [hidePass, setHidePass] = useState(true);

    const [programList, setProgramList] = useState<any>([]);
    const [rhList, setRhList] = useState<any>([]);
    const [epsList, setEpsList] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true); // Estado de carga

    const handleRegister = async () => {
        try {
            await Axios.post('/auth/register', form);
            await resetForm();
            router.replace('/');
        } catch (error) {
            console.error('Error al registrarte:', error);
            Alert.alert('Error', 'Ha ocurrido un problema al registrarte');
        }
    };

    const listRH = async () => {
        try {
            const { data } = await Axios.get('/common/list-types?codes=type_rh,type_eps');
            const formatRh = formattedSelect(data.find((item: any) => item.code === 'type_rh').listItem);
            const formatEps = formattedSelect(data.find((item: any) => item.code === 'type_eps').listItem);
            setRhList(formatRh);
            setEpsList(formatEps);
        } catch (error) {
            console.log('🚀 ~ listRH ~ error:', error);
        }
    };

    const listCodeProgram = async () => {
        try {
            const { data } = await Axios.get('/common/programs');
            const formatPrograms = formattedSelect(data);
            setProgramList(formatPrograms);
        } catch (error) {
            console.error('🚀 ~ listCodeProgram ~ error:', error);
        }
    };

    const resetForm = () => setForm({
        full_name: '',
        last_name: '',
        document: '',
        email: '',
        password: '',
        code_student: '',
        code_program: '',
        rh: '',
        eps: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Inicia el estado de carga
            await Promise.all([listRH(), listCodeProgram()]);
            setIsLoading(false); // Finaliza la carga
        };
        fetchData();
    }, []);

    if (isLoading) {
        // Mostrar spinner mientras se cargan los datos
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text>Cargando datos...</Text>
            </View>
        );
    }
    return (
        <ScrollView style={styles.container}>
            <Image
                source={require('@/assets/images/logo_fet.png')}
                style={styles.logo}
            />
            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="headlineLarge" style={styles.cardTitle}>Registro</Text>
                    <Text style={styles.cardSubtitle}>
                        ¿Ya tienes Cuenta? <Link style={styles.linkText} href="/">Ir a login</Link>
                    </Text>
                    <View style={styles.cardBody}>
                        <TextInput
                            mode='outlined'
                            label='Nombre'
                            value={form.full_name}
                            onChangeText={(text) => setForm({ ...form, full_name: text })}
                            right={<TextInput.Icon icon='face-man-outline' />}
                            style={styles.input}
                        />

                        <TextInput
                            mode='outlined'
                            label='Apellido'
                            value={form.last_name}
                            onChangeText={(text) => setForm({ ...form, last_name: text })}
                            right={<TextInput.Icon icon='face-man-outline' />}
                            style={styles.input}
                        />

                        <TextInput
                            mode='outlined'
                            label='Email'
                            value={form.email}
                            onChangeText={(text) => setForm({ ...form, email: text })}
                            right={<TextInput.Icon icon='email-outline' />}
                            style={styles.input}
                        />

                        <TextInput
                            mode='outlined'
                            label='N° Documento'
                            value={form.document}
                            onChangeText={(text) => setForm({ ...form, document: text })}
                            right={<TextInput.Icon icon='identifier' />}
                            style={styles.input}
                        />

                        <Dropdown
                            style={styles.dropdown}
                            data={rhList}
                            labelField="label"
                            valueField="value"
                            placeholder="Seleccione su RH"
                            value={form.rh}
                            onChange={(item) => setForm({ ...form, rh: item.value })}
                        />

                        <Dropdown
                            style={styles.dropdown}
                            data={epsList}
                            labelField="label"
                            valueField="value"
                            placeholder="Seleccione su EPS"
                            value={form.eps}
                            onChange={(item) => setForm({ ...form, eps: item.value })}
                        />

                        <TextInput
                            mode='outlined'
                            label='Contraseña'
                            value={form.password}
                            secureTextEntry={hidePass}
                            onChangeText={(text) => { setForm({ ...form, password: text }) }}
                            right={<TextInput.Icon icon='eye' onPress={() => setHidePass(!hidePass)} />}
                            style={styles.input}
                        />

                        <TextInput
                            mode='outlined'
                            label='Código de estudiante'
                            value={form.code_student}
                            onChangeText={(text) => setForm({ ...form, code_student: text })}
                            right={<TextInput.Icon icon='two-factor-authentication' />}
                            style={styles.input}
                        />

                        <Dropdown
                            style={styles.dropdown}
                            data={programList}
                            labelField="label"
                            valueField="value"
                            placeholder="Seleccione un Programa"
                            value={form.code_program}
                            onChange={(item) => setForm({ ...form, code_program: item.value })}
                        />

                        <Button style={styles.btn} mode="contained" onPress={handleRegister}>
                            Registrarse
                        </Button>
                    </View>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}
