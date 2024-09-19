import { StyleSheet } from "react-native";
import { theme } from '@/assets/css/style';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.white,
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 20
    },
    topContainer: {
        marginVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginVertical: 20,
        textAlign: 'center',
    },
      input: {
        marginBottom: 15,
      },
      button: {
        marginTop: 20,
      },

      errorText: {
        color: theme.colors.error,
        marginBottom: 10,
      },
})