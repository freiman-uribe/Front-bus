import React, { useCallback, useState } from 'react';
import { View, FlatList } from 'react-native';
import { FAB, Card, IconButton, Text, Avatar, Searchbar } from 'react-native-paper';
import { styles } from './styles/plans';
import ConfirmDialog from '@/components/confirms/ConfirmDialog';
import { useFocusEffect, useRouter } from 'expo-router';
import { Axios } from '@/resources/axios/axios';


interface Plan {
  id: string;
  name: string;
  amount_perday: number;
  equals_day: number;
}

export default function Plans() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (id: string) => {
    router.navigate(`/(admin)/plans/update/${id}`);
  };

  const fetchPlans = async () => {
    try {
      const response = await Axios.get('/plans');
      setPlans(response.data);
    } catch (error) {
      alert('Error al cargar los planes');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPlans(); 
    }, [])
  );

  const handleDelete = (id: string) => {
    setPlanToDelete(id);
    setDialogVisible(true);
  };

  const deletePlan = async (id: string) => {
    try {
      await Axios.delete(`/plans/${id}`);
      fetchPlans();
    } catch (error) {
      alert('Error al eliminar el plan');
    }
  }

  const confirmDelete = () => {
    if (planToDelete) {
      deletePlan(planToDelete);
      setPlanToDelete(null);
      setDialogVisible(false);
    }
  };

  const cancelDelete = () => {
    setPlanToDelete(null);
    setDialogVisible(false);
  };

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar plan..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredPlans}
        keyExtractor={(item) => item.id}
        style={{ padding: 10 }}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title
              title={item.name}
              subtitle={`Monto por dia: ${item.amount_perday}`} 
              left={(props) => (
                <Avatar.Icon {...props} icon="package-variant" style={styles.avatarIcon} />
              )}
              right={(props) => (
                <View style={styles.cardActions}>
                  <IconButton
                    {...props}
                    icon="pencil"
                    onPress={() => handleEdit(item.id)}
                    size={20}
                    style={{ marginRight: 0 }}
                  />
                  <IconButton
                    {...props}
                    icon="delete"
                    onPress={() => handleDelete(item.id)}
                    size={20}
                  />
                </View>
              )}
            />
            <Card.Content>
              <Text>Este plan equivale a {item.equals_day} dias</Text>
            </Card.Content>
          </Card>
        )}
      />
      <FAB
        icon="plus"
        color='white'
        style={styles.floatButton}
        onPress={() => router.navigate('/(admin)/plans/create')}
      />
      <ConfirmDialog
        visible={dialogVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="¿Estás seguro de que deseas eliminar este plan?"
        title="Eliminar plan"
      />
    </View>
  );
}
