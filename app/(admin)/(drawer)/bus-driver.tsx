import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Axios } from '@/resources/axios/axios';
import { router, useFocusEffect } from 'expo-router';
import { Card, Text, Title, Paragraph, Divider, Avatar, Surface, Menu, Button, FAB } from 'react-native-paper';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { theme } from "@/assets/css/style";

type BusDriver = {
  id: string;
  driver: {
    full_name: string;
    last_name: string;
  };
  car: {
    placa: string;
    color: string;
    company: {
      name: string;
    };
    type: {
      name: string;
    };
  };
  route: {
    name: string;
    schedule_start: string;
    schedule_end: string;
  };
};

export default function BusDriverScreen() {
  const [busDriverList, setBusDriverList] = useState<BusDriver[]>([]);
  const [visibleMenu, setVisibleMenu] = useState<{ [key: string]: boolean }>({});

  const fetchBusDriver = async () => {
    try {
      const { data } = await Axios.get('/bus-driver');
      setBusDriverList(data);
    } catch (error) {
      console.error('🚀 ~ fetchBusDriver ~ error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBusDriver();
    }, [])
  );

  const formatDate = (date: string) => {
    return format(parseISO(date), 'hh:mm a', { locale: es });
  };

  const handleEdit = (id: string) => {
    router.navigate({
      pathname: '/(admin)/bus-driver/update/[id]',
      params: { id }, 
    }, );
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Confirmar borrado',
      '¿Estás seguro de que deseas borrar esta asignación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            try {
              await Axios.delete(`/bus-driver/${id}`);
              setBusDriverList(busDriverList.filter((driver) => driver.id !== id));
            } catch (error) {
              console.error('Error al borrar conductor:', error);
            }
          },
        },
      ],
    );
  };

  const handleMenuToggle = (id: string) => {
    setVisibleMenu(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={busDriverList}
        style={styles.list}
        renderItem={({ item }) => (
          <Surface style={styles.surface} elevation={1}>
            <Card style={styles.card}>
              <View style={styles.header}>
                <Avatar.Text size={48} label={item.driver.full_name.charAt(0)} style={styles.avatar} />
                <View style={styles.headerInfo}>
                  <Title style={styles.title}>
                    {item.driver.full_name} {item.driver.last_name}
                  </Title>
                  <Paragraph style={styles.subtitle}>Conductor</Paragraph>
                </View>

                <Menu
                  visible={visibleMenu[item.id]}
                  onDismiss={() => handleMenuToggle(item.id)}
                  statusBarHeight={15}
                  mode='elevated'
                  contentStyle={styles.menuContent}
                  anchor={
                    <TouchableOpacity onPress={() => handleMenuToggle(item.id)} style={styles.menuButton}>
                      <Ionicons name="ellipsis-vertical" size={24} color="green" />
                    </TouchableOpacity>
                  }
                >
                  <Menu.Item
                    leadingIcon={"pencil"}
                    onPress={() => { handleEdit(item.id); handleMenuToggle(item.id); }}
                    title="Editar"
                    titleStyle={styles.menuItemText} 
                  />
                  <Menu.Item
                    leadingIcon={"delete"}
                    onPress={() => { handleDelete(item.id); handleMenuToggle(item.id); }}
                    title="Borrar"
                    titleStyle={styles.menuItemText}
                  />
                </Menu>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vehículo</Text>
                <Paragraph style={styles.paragraph}>
                  <Text style={styles.label}>Placa: </Text>{item.car.placa} - {item.car.color}
                </Paragraph>
                <Paragraph style={styles.paragraph}>
                  <Text style={styles.label}>Compañía: </Text>{item.car.company.name}
                </Paragraph>
                <Paragraph style={styles.paragraph}>
                  <Text style={styles.label}>Tipo: </Text>{item.car.type.name}
                </Paragraph>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ruta</Text>
                <Paragraph style={styles.paragraph}>
                  <Text style={styles.label}>Nombre: </Text>{item.route.name}
                </Paragraph>
                <Paragraph style={styles.paragraph}>
                  <Text style={styles.label}>Horario: </Text>{formatDate(item.route.schedule_start)} - {formatDate(item.route.schedule_end)}
                </Paragraph>
              </View>
            </Card>
          </Surface>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
       <FAB
        icon="plus"
        color='white'
        style={styles.floatButton}
        onPress={() => router.navigate('/(admin)/bus-driver/create')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
