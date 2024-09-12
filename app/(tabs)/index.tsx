import { View, StyleSheet } from 'react-native';
export default function HomeScreen() {

  return (
    <View style={ styles.container }>
        Home
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: '30%',
  }
})
