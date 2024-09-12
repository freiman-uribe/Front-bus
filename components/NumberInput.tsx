import React from 'react';
import { Controller } from 'react-hook-form';
import { TextInput, HelperText } from 'react-native-paper';

type NumberInputProps = {
  control: any;
  name: any;
  label: any;
  errors: any;
  icon?: string;
};

export const NumberInput = ({ control, name, label, errors, icon = '' }: NumberInputProps) => (
  <Controller
    control={control}
    name={name}
    
    render={({ field: { onChange, onBlur, value } }) => (
      <>
        <TextInput
          label={label}
          mode="outlined"
          value={value.toString()}
          right={<TextInput.Icon icon={icon} />}
          onBlur={onBlur}
          onChangeText={onChange}
          keyboardType="numeric"
          style={{ marginBottom: 10 }}
        />
        {errors[name] && <HelperText type="error">{errors[name].message}</HelperText>}
      </>
    )}
  />
);
