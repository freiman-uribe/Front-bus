import { StyleSheet } from "react-native";
import { theme } from '@/assets/css/style';


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10
    },
    searchBar: {
        marginBottom: 10,
        borderRadius: 8,
        elevation: 10,
        marginHorizontal: 10
    },
    card: {
        marginBottom: 16,
        marginHorizontal: 2,
    },
    avatarIcon: {
        backgroundColor: '#6200ee'
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    floatButton: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: theme.colors.primary,
    }
});