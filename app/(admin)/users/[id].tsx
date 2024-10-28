// user/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Axios } from '@/resources/axios/axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ROLES } from '@/constants/Rol';

type User = {
  id: string;
  full_name: string;
  last_name: string;
  document?: string;
  email: string;
  code_student?: string;
  phone?: string;
  birthdate?: string;
  address?: string;
  rol: {
    name: string;
    code: string;
  };
  rh: {
    name: string;
  }
  eps: {
    name: string;
  }
};

export default function UserDetails() {
  const [user, setUser] = useState<User | null>(null);
  const { id } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      const { data } = await Axios.get(`/users/${id}`);
      setUser(data);
    } catch (error) {
      Alert.alert('Error', 'Error al cargar los detalles del usuario');
    }
  };

  const handleDelete = async () => {
    try {
      await Axios.delete(`/users/${id}`);
      Alert.alert('Usuario eliminado', 'El usuario ha sido eliminado correctamente.');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Error al eliminar el usuario');
    }
  };

  const handleUpdate = () => {
    router.navigate(`/(admin)/users/update/${id}`);
  };

  const getInitials = (fullName: string) => {
    const names = fullName.split(' ');
    return names.map(name => name.charAt(0).toUpperCase()).join('');
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  if (!user) return <Text style={styles.loading}>Cargando...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Detalles del Usuario</Text>
      <View style={styles.card}>
        <View style={[styles.avatar, { backgroundColor: getRandomColor() }]}>
          <Text style={styles.initials}>{getInitials(user.full_name)}</Text>
        </View>
        <Text style={styles.info}>Nombre: {user.full_name}</Text>
        <Text style={styles.info}>Apellido: {user.last_name}</Text>
        <Text style={styles.info}>Email: {user.email}</Text>
        <Text style={styles.info}>Rol: {user.rol.name}</Text>
        <Text style={styles.info}>Documento: {user.document}</Text>
        <Text style={styles.info}>Teléfono: {user.phone}</Text>
        {user.rol.code === ROLES.STUDENT && (
          <>
            <Text style={styles.info}>Código Estudiante: {user.code_student}</Text>
            <Text style={styles.info}>Fecha de Nacimiento: {user.birthdate}</Text>
            <Text style={styles.info}>Dirección: {user.address}</Text>
            <Text style={styles.info}>RH: {user.rh.name}</Text>
            <Text style={styles.info}>EPS: {user.eps.name}</Text>
          </>
        )}


      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Actualizar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eaeaea',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  initials: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    marginVertical: 5,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    elevation: 2,
  },
  deleteButton: {
    backgroundColor: '#FF4136',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
  },
});
