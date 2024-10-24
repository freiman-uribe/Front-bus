import React from 'react'
import { CustomDropdown } from '@/components/CustomDropdown'

type DropDownCarsProps = {
  control: any;
  errors: any;
  cars: any;
}

export default function DropDownCars({ control, errors, cars }: DropDownCarsProps) {
  const options = cars.map((car: any) => ({
    label: car.placa + " " + car.company.name + " " + car.type.name,
    value: car.id
  }));
  return (
    <CustomDropdown
      control={control}
      name="car_id"
      label="Vehículo"
      options={options}
      error={errors.car_id}
    />
  )
}