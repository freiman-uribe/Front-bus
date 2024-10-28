import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import UsersForm from '@/components/users/form/UsersForm';

export default function CreateUserScreen() {
  const { rol } = useLocalSearchParams();
  const rolString = Array.isArray(rol) ? rol[0] : rol;
  return (
      <UsersForm rol={rolString} />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});