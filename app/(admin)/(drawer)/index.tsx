import React, { useCallback, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, TouchableOpacity, Animated } from 'react-native';
import { Axios } from '@/resources/axios/axios';
import { router, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { FAB } from 'react-native-paper'; // Importa el FAB
import { theme } from '@/assets/css/style';
import { ROLES } from '@/constants/Rol';

type User = {
  id: string;
  full_name: string;
  last_name: string;
  email: string;
  rol: {
    name: string;
  };
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const ITEMS_PER_PAGE = 10;
  
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  const fetchUsers = async () => {
    try {
      const { data } = await Axios.get('/users');
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      alert('Error al cargar los usuarios');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const handleFilterChange = (text: string) => {
    setFilter(text);
    setPage(1);
    const filtered = users.filter((user) =>
      user.full_name.toLowerCase().includes(text.toLowerCase()) ||
      user.last_name.toLowerCase().includes(text.toLowerCase()) ||
      user.email.toLowerCase().includes(text.toLowerCase()) ||
      user.rol.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(opacityValue, {
      toValue: menuVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => router.push(`/(admin)/users/${item.id}`)}
      activeOpacity={1}
    >
      <Animated.View style={[styles.card, { transform: [{ scale: scaleValue }] }]}>
        <MaterialIcons name="person" size={30} color="#4e91fc" style={styles.icon} />
        <View style={styles.userInfo}>
          <Text style={styles.fullName}>{item.full_name} {item.last_name}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <Text style={styles.role}>Rol: {item.rol.name}</Text>
        </View>
        <MaterialIcons name="arrow-forward-ios" size={20} color="#555" />
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Usuarios</Text>
      <TextInput
        placeholder="Buscar por nombre, apellido, email o rol"
        value={filter}
        onChangeText={handleFilterChange}
        style={styles.input}
      />
      <FlatList
        data={paginatedUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={styles.list}
      />
      <View style={styles.pagination}>
        <Button
          title="Anterior"
          onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        />
        <Text style={styles.pageNumber}>Página {page}</Text>
        <Button
          title="Siguiente"
          onPress={() => setPage((prev) => prev + 1)}
          disabled={page * ITEMS_PER_PAGE >= filteredUsers.length}
        />
      </View>

      {/* Botón FAB */}
      <FAB
        style={styles.floatingButton}
        icon="plus"
        color='white'
        onPress={toggleMenu}
      />

      {/* Menú desplegable */}
      {menuVisible && (
        <Animated.View style={[styles.menu, { opacity: opacityValue }]}>
          <TouchableOpacity style={styles.menuItem} onPress={()=> router.push(`/(admin)/users/create/${ROLES.STUDENT}`)}>
            <Text style={styles.menuText}>Crear Estudiante</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={()=> router.push(`/(admin)/users/create/${ROLES.ADMIN}`)}>
            <Text style={styles.menuText}>Crear Administrador</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={()=>router.push(`/(admin)/users/create/${ROLES.DRIVER_BUS}`)}>
            <Text style={styles.menuText}>Crear Conductor</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    
  },
  list: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 6,
    borderLeftColor: '#4e91fc',
  },
  icon: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  fullName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#777',
    marginVertical: 2,
  },
  role: {
    fontSize: 14,
    color: '#4e91fc',
    fontWeight: '500',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  pageNumber: {
    fontSize: 16,
    color: '#333',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: theme.colors.primary
  },
  menu: {
    position: 'absolute',
    right: 20,
    bottom: 140, 
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});
