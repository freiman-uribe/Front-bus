import { useEffect, useState } from 'react';
import { View, Image, Alert, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import { Axios } from '@/resources/axios/axios';
import { formattedSelect } from '@/resources/helpers';
import { styles } from './styles/style'

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
    })
    const [hidePass, setHidePass] = useState(true);

    const [programList, setProgramList] = useState<any>([]);
    const [rhList, setRhList] = useState<any>([]);
    const [epsList, setEpsList] = useState<any>([]);
    
    const handleRegister = async () => {
        try {
            await Axios.post('/auth/register', form);
            await resetForm();
            router.replace('/');
        } catch (error) {
          console.error('Error al iniciar sesión:', error);
          Alert.alert('Error', 'Ha ocurrido un problema al registrarte');
        }
    };

    const listRH = async () => {
        try {
            const { data } = await Axios.get('/common/list-types?codes=type_rh,type_eps')
            const formatRh = formattedSelect(data.find((item: any) => item.code === 'type_rh').listItem)
            const formatEps = formattedSelect(data.find((item: any) => item.code === 'type_eps').listItem)
            setRhList(formatRh)
            setEpsList(formatEps)
        } catch (error) {
            console.log('🚀 ~ listRH ~ error:', error)
        }
    }

    const listCodeProgram = async () => {
        try {
            const { data } = await Axios.get('/common/programs')
            const formatPrograms = formattedSelect(data)
            setProgramList(formatPrograms)
        } catch (error) {
            console.error('🚀 ~ listCodeProgram ~ error:', error)
        }
    }

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
    })

    useEffect(() => {
      listRH()
      listCodeProgram()
    }, [])
    
    return (
        <ScrollView style={styles.container}>
            <Image
                source={require('@/assets/images/logo_fet.png')}
                style={styles.logo}
            />
            <Card style={styles.card}>
            <Card.Content>
                <Text variant="headlineLarge" style={styles.cardTitle}>Registro</Text>
                <Text style={styles.cardSubtitle}> Ya tienes Cuenta? <Link style={styles.linkText} href="/">Ir a login</Link> </Text>
                <View style={styles.cardBody}>
                    <TextInput
                        mode='outlined'
                        label='Nombre'
                        value={form.full_name}
                        onChangeText={(text) => setForm({...form, full_name: text})}
                        right={<TextInput.Icon icon='face-man-outline' />}
                        style={styles.input}
                    />

                    <TextInput
                        mode='outlined'
                        label='Apellido'
                        value={form.last_name}
                        onChangeText={(text) => setForm({...form, last_name: text})}
                        right={<TextInput.Icon icon='face-man-outline' />}
                        style={styles.input}
                    />
                    
                    <TextInput
                        mode='outlined'
                        label='Email'
                        value={form.email}
                        onChangeText={(text) => setForm({...form, email: text})}
                        right={<TextInput.Icon icon='email-outline' />}
                        style={styles.input}
                    />

                    <TextInput
                        mode='outlined'
                        label='N° Documento'
                        value={form.document}
                        onChangeText={(text) => setForm({...form, document: text})}
                        right={<TextInput.Icon icon='identifier' />}
                        style={styles.input}
                    />

                    <View style={styles.input}>
                        <Dropdown
                            label='RH'
                            mode='outlined'
                            onSelect={(text) => setForm({...form, rh: text as any})}
                            options={rhList}
                            value={form.rh}
                            hideMenuHeader={true}
                        />
                    </View>

                    <View style={styles.input}>
                        <Dropdown
                            label='Eps'
                            mode='outlined'
                            onSelect={(text) => setForm({...form, eps: text as any})}
                            options={epsList}
                            value={form.eps}
                            hideMenuHeader={true}
                        />
                    </View>

                    <TextInput
                        mode='outlined'
                        label='Contraseña'
                        value={form.password}
                        secureTextEntry = {hidePass}
                        onChangeText={(text) => { setForm({...form, password: text}) }}
                        right={<TextInput.Icon icon='eye' onPress={() => setHidePass(!hidePass)}/>}
                        style={styles.input}
                    />

                    <TextInput
                        mode='outlined'
                        label='Código de estudiante'
                        value={form.code_student}
                        onChangeText={(text) => setForm({...form, code_student: text})}
                        right={<TextInput.Icon icon='two-factor-authentication' />}
                        style={styles.input}
                    />


                    <View style={styles.input}>
                        <Dropdown
                            label='Código de programa'
                            mode='outlined'
                            onSelect={(text) => setForm({...form, code_program: text as any})}
                            options={programList}
                            value={form.code_program}
                            hideMenuHeader={true}
                        />
                    </View>

                    <Button style={styles.btn} mode="contained" onPress={handleRegister}>
                        Registrase
                    </Button>
                </View>
            </Card.Content>
            </Card>
        </ScrollView>
    );
}