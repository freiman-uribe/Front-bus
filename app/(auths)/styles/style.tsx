import { StyleSheet } from 'react-native'
import { theme } from '@/assets/css/style';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  logo: {
    margin: 'auto',
    width: 150,
    height: 100,
    marginVertical: 75,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  card: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  cardTitle:{
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.secondary,
    width: 'auto',
    alignSelf: 'flex-start',
    paddingLeft: 4,
    paddingRight: 20
  },
  cardSubtitle: {
    marginTop: 10,
    marginBottom: 20
  },
  cardBody: {
    marginTop: 15,
  },
  input: {
    marginBottom: 20
  },
  btn: {
    marginVertical: 10,
    marginHorizontal: 50
  },
  linkText: {
    margin: 'auto',
    fontStyle: 'italic',
    fontWeight: '600',
    color: theme.colors.primary,
  },
})