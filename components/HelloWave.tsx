import { useState } from 'react';
// import { StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

export function HelloWave() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [hidePass, setHidePass] = useState(true);
  
  return (
    <>
      <TextInput
        mode='outlined'
        label='Usuario'
        value={user}
        onChangeText={(text) => setUser(text)}
        right={<TextInput.Icon icon='face-man-outline' />}
      />
      <TextInput
        mode='outlined'
        label='Password'
        value={password}
        secureTextEntry = {hidePass}
        onChangeText={(text) => setPassword(text)}
        right={<TextInput.Icon icon='eye' onPress={() => setHidePass(!hidePass)}/>}
      />

      <Button mode="outlined" onPress={() => console.log('Pressed')}>
        Ingresar
      </Button>
    </>
    // <Animated.View style={animatedStyle}>
    //   <ThemedText style={styles.text}>👋</ThemedText>
    //   <Checkbox
    //     status={checked ? 'checked' : 'unchecked'}
    //     onPress={() => {
    //       setChecked(!checked);
    //     }}
    //   />
    // </Animated.View>
  );
}

// const styles = StyleSheet.create({
//   text: {
//     fontSize: 28,
//     lineHeight: 32,
//     marginTop: -6,
//   },
// });
