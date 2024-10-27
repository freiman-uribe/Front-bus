import { View } from 'react-native'
import React from 'react'
import BusDriverForm from '@/components/bus-driver/form/bus-driver-form'

export default function create() {
  return (
    <View style={{ flex: 1 }}>
      <BusDriverForm />
    </View>
  )
}