import { View, ScrollView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useCallback, useState } from 'react';
import { Text, Card, IconButton, FAB, Divider, Searchbar, Menu } from 'react-native-paper';
import { router } from 'expo-router';
import { Axios } from '@/resources/axios/axios';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '@/assets/css/style';
import ConfirmDialog from '@/components/confirms/ConfirmDialog';

interface CarRoute {
  id: string;
  order: number;
  name: string;
  scheduleStart: string;
  scheduleEnd: string;
  lactitude: number; 
  longitude: number;  
}

export default function CarRouteScreen() {
  const [carRoutesData, setCarRoutesData] = useState<CarRoute[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<CarRoute[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<string | null>(null);
  const [visibleMenu, setVisibleMenu] = useState<{ [key: string]: boolean }>({});
  const [selectedFilter, setSelectedFilter] = useState('name'); 

  const openMenu = (id: string) => {
    setVisibleMenu(prev => ({ ...prev, [id]: true }));
  };

  const closeMenu = (id: string) => {
    setVisibleMenu(prev => ({ ...prev, [id]: false }));
  };

  const confirmDelete = (id: string) => {
    setRouteToDelete(id);
    closeMenu(id);
    setDialogVisible(true);
  };

  const handleEdit = (id: string) => {
    router.push(`/(admin)/car-route/update/${id}`);
    closeMenu(id);
  };

  const handleDelete = async () => {
    if (routeToDelete) {
      try {
        await Axios.delete(`/car-route/${routeToDelete}`);
        getCarRoutes();
      } catch (error) {
        console.error('Error al eliminar ruta de bus:', error);
      } finally {
        setDialogVisible(false);
        setRouteToDelete(null);
      }
    }
  };

  const getCarRoutes = async () => {
    try {
      const { data } = await Axios.get('/car-route');
      setCarRoutesData(data);
      setFilteredRoutes(data);
    } catch (error) {
      console.error('Error al obtener rutas de buses:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = carRoutesData.filter(route => {
        const value = String(route[selectedFilter as keyof CarRoute]);
        return value.toLowerCase().includes(query.toLowerCase());
      });
      setFilteredRoutes(filtered);
    } else {
      setFilteredRoutes(carRoutesData);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getCarRoutes();
    }, [])
  );

  
  const searchOptions = [
    { label: 'Nombre', value: 'name' },
    { label: 'Orden', value: 'order' },
    { label: 'Horario Inicio', value: 'scheduleStart' },
    { label: 'Horario Fin', value: 'scheduleEnd' },
    { label: 'Latitud', value: 'lactitude' },
    { label: 'Longitud', value: 'longitude' },
  ];

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar rutas..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <View style={styles.filterListContainer}>
        <FlatList
          horizontal
          data={searchOptions}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterItem, selectedFilter === item.value && styles.selectedFilterItem]}
              onPress={() => {
                setSelectedFilter(item.value);
                handleSearch(searchQuery); 
              }}
            >
              <Text style={[styles.filterText, selectedFilter === item.value && styles.selectedFilterText]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Rutas de Buses</Text>
        {filteredRoutes.map((route) => (
          <Card key={route.id} style={styles.card}>
            <Card.Title
               title={`Nombre: ${route.name}`} 
               subtitle={`Orden: ${route.order} | Horario: ${route.scheduleStart} - ${route.scheduleEnd}`}
              right={(props) => (
                <Menu
                  visible={visibleMenu[route.id]}
                  onDismiss={() => closeMenu(route.id)}
                  anchor={<IconButton {...props} icon="dots-vertical" onPress={() => openMenu(route.id)} />}
                >
                  <Menu.Item onPress={() => handleEdit(route.id)} title="Editar" />
                  <Menu.Item onPress={() => confirmDelete(route.id)} title="Eliminar" />
                </Menu>
              )}
            />
            <Divider />
            <Card.Content>
              <Text style={styles.cardText}>Latitud: {route.lactitude}</Text>
              <Text style={styles.cardText}>Longitud: {route.longitude}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <ConfirmDialog
        visible={dialogVisible}
        onConfirm={handleDelete}
        onCancel={() => setDialogVisible(false)}
        message="¿Estás seguro de que deseas eliminar esta ruta de bus?"
        title="Confirmar eliminación"
      />

      <FAB
        style={styles.fab}
        color='white'
        icon="plus"
        onPress={() => router.push("/(admin)/car-route/create")}
      />
    </View>
  );
}


const styles = StyleSheet.create({
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
