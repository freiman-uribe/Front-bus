import { theme } from "@/assets/css/style";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0f2f5',
    },
    list: {
      paddingTop: 16,
    },
    surface: {
      marginVertical: 10,
      borderRadius: 10,
      marginHorizontal: 20,
    },
    card: {
      padding: 16,
      borderRadius: 10,
      backgroundColor: '#ffffff',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      justifyContent: 'space-between',
    },
    avatar: {
      marginRight: 16,
      backgroundColor: 'green',
    },
    headerInfo: {
      flex: 1,
    },
    menuButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    subtitle: {
      fontSize: 14,
      color: '#555',
    },
    divider: {
      marginVertical: 12,
    },
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'green',
      marginBottom: 8,
    },
    paragraph: {
      marginBottom: 4,
      color: '#333',
    },
    label: {
      fontWeight: '600',
      color: '#555',
    },
    listContent: {
      paddingBottom: 30,
    },
    menuContent: {
      backgroundColor: '#ffffff',
      borderRadius: 8,
      padding: 4, 
    },
    menuItemText: { 
      fontWeight: '600', 
    },
    floatButton: {
      position: 'absolute',
      right: 16,
      bottom: 16,
      backgroundColor: theme.colors.primary,
    },
  });