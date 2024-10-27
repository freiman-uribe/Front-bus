import { StyleSheet } from 'react-native';
import { theme } from '@/assets/css/style';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5', // Color de fondo general
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    // Estilos para la búsqueda
    searchbar: {
        marginBottom: 10,
        borderRadius: 8,
        elevation: 10,
    },
    card: {
        marginBottom: 16,
        borderRadius: 10,
        elevation: 3, // Sombra
        backgroundColor: 'white',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    cardContent: {
        padding: 10,
    },
    cardText: {
        fontSize: 14,
        color: '#444',
        marginVertical: 4,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.primary,
    },
    filterListContainer: {
        marginBottom: 10,
        paddingVertical: 5,
    },
    filterItem: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.surface,
        marginRight: 10,
    },
    selectedFilterItem: {
        backgroundColor: theme.colors.primary,
    },
    filterText: {
        color: '#000',
    },
    selectedFilterText: {
        color: '#fff',
    },
});
