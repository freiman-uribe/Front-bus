import { View, Text } from 'react-native'
import React from 'react'

import { CustomDropdown } from '@/components/CustomDropdown'

type DropDownRoutesProps = {
  control: any;
  errors: any;
  routes: any;
}

export default function DropDownRoutes({ control, errors, routes }: DropDownRoutesProps) {
  const options = routes.map((route: any) => ({
    label: route.name + " " + route.scheduleStart + "-" + route.scheduleEnd,
    value: route.id
  }));

  return (
    <CustomDropdown
      control={control}
      name="route_id"
      label="Ruta"
      options={options}
      error={errors.route_id}
    />
  )
}