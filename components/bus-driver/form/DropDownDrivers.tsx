import React from 'react'
import { CustomDropdown } from '@/components/CustomDropdown'

type DropDownDriversProps = {
    control: any;
    errors: any;
    drivers: any;
}


export default function DropDownDrivers({ control, errors, drivers }: DropDownDriversProps) {    
  return (
    <CustomDropdown 
        control={control}
        name="driver_id"
        label="Conductor"
        options={drivers.map((driver: any) => ({ label: driver.full_name +" "+ driver.last_name, value: driver.id }))}
        error={errors.driver_id}
      />
  )
}