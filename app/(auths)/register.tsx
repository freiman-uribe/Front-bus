import { useState, useRef, useEffect } from "react"
import { StyleSheet, View } from 'react-native'
import { TextInput, Button } from "react-native-paper"
import { PaperSelect } from 'react-native-paper-select';
import { Link } from 'expo-router';
import { theme } from '@/assets/css/style';


const Register = ()=>{

    const [form, setForm] = useState({
        name: '',
        lastName: '',
        rh: '', // api
        email: '',
        password: '',
        studentCode: '',
        programStudent: ''// api
    })
    const singleSelectRef = useRef<any>();
  const [gender, setGender] = useState<any>({
    value: '',
    list: [
      { _id: '1', value: 'MALE', checked: true },
      { _id: '2', value: 'FEMALE', checked: false},
      { _id: '3', value: 'OTHERS', checked: false },
    ],
    selectedList: [],
    error: '',
  });



  useEffect(() => {
    let isMounted = true;
    return () => {
      isMounted = false;
    };
  }, []);

  
    return (
         <View>
            <TextInput
                mode='outlined'
                label='Nombre'
                value={form.name}
                onChangeText={(text) => setForm({name: text})}
                right={<TextInput.Icon icon='face-man-outline' />}
            />
           <PaperSelect
                inputRef={singleSelectRef}
                label="Select Gender"
                value={gender.value}
                onSelection={(value: any) => {
                setGender({
                    ...gender,
                    value: value.text,
                    selectedList: value.selectedList,
                    error: '',
                });
                }}
                arrayList={[...gender.list]}
                selectedArrayList={[...gender.selectedList]}
                errorText={gender.error}
                multiEnable={false}
                dialogTitleStyle={{ color: 'black' }}
                textInputStyle={{ fontWeight: '700', color: 'yellow' }}
                hideSearchBox={true}
                hideCheckbox={true}
                theme={{
                colors: {
                    text: 'blue', // Change this to the desired text color
                    placeholder: 'gray', // Change this to the desired placeholder color
                },
                }}
                textInputProps={{
                    outlineColor: 'black',
                }}
                checkboxProps={{
                    checkboxColor: 'blue',
                    checkboxLabelStyle: { color: 'black', fontWeight: '700' },
                }}
                textInputOutlineStyle={{ borderColor: 'red', borderBottomWidth: 10 }}
                textInputMode="outlined"
            />
            <TextInput
                mode='outlined'
                label='Apellido'
                value={form.lastName}
                onChangeText={(text) => setForm({lastName: text})}
                right={<TextInput.Icon icon='face-man-outline' />}
            />
            <TextInput
                mode='outlined'
                label='RH'
                value={form.rh}
                onChangeText={(text) => setForm({rh: text})}
                right={<TextInput.Icon icon='face-man-outline' />}
            />
            <TextInput
                mode='outlined'
                label='Email'
                value={form.email}
                onChangeText={(text) => setForm({email: text})}
                right={<TextInput.Icon icon='face-man-outline' />}
            />

            <TextInput
                mode='outlined'
                label='Password'
                value={form.password}
                onChangeText={(text) => setForm({password: text})}
                right={<TextInput.Icon icon='face-man-outline' />}
            />
            <TextInput
                mode='outlined'
                label='Codigop de estudiante'
                value={form.studentCode}
                onChangeText={(text) => setForm({studentCode: text})}
                right={<TextInput.Icon icon='face-man-outline' />}
            />

            <TextInput
                mode='outlined'
                label='Codigop de estudiante'
                value={form.studentCode}
                onChangeText={(text) => setForm({studentCode: text})}
                right={<TextInput.Icon icon='face-man-outline' />}
            />

            <Button mode="outlined" onPress={() => console.log(form)}>
                Ingresar
            </Button>
            <Link style={styles.linkText} href="/">Registrarme</Link>
        </View>
    )
}

const styles = StyleSheet.create({
  linkText: {
    margin: 'auto',
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.dark,
  },
})

export default Register