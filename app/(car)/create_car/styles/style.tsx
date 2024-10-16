import { StyleSheet } from "react-native";
import { theme } from '@/assets/css/style';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.white,
        flex: 1,
        paddingTop: 20,
        paddingBottom: 15,
        paddingHorizontal: 15,
    },
    input: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    fileButton: {
        marginTop: 10,
    },
    fileName: {
        marginTop: 5,
        color: theme.colors.gray, 
    },
    submitButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 4,
        justifyContent: 'center',
        marginTop: 20,
        paddingVertical: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        marginTop: 10,
        fontSize: 16,
        color: '#000',
    },
});