import { Controller, FieldError } from 'react-hook-form';
import { Dropdown } from 'react-native-element-dropdown';
import { View } from 'react-native';
import { HelperText } from 'react-native-paper';
import React from 'react';

interface CustomDropdownProps {
  control: any;
  name: string;
  label: string;
  options: { label: string; value: any }[];
  error?: FieldError;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({ control, name, label, options, error }) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value } }) => (
      <View style={{ marginBottom: 10 }}>

        <Dropdown
          style={styles.dropdown}
          data={options}
          labelField="label"
          valueField="value"
          placeholder={label}
          value={value}
          onChange={(item) => onChange(item.value)}
        />
        
        <HelperText type="error" visible={!!error}>
          {error?.message}
        </HelperText>
      </View>
    )}
  />
);

const styles = {
  dropdown: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
    borderRadius: 5,
    padding: 15
  },
};