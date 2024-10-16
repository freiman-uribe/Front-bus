import { Controller } from 'react-hook-form';
import { TextInput, HelperText } from 'react-native-paper';
import { KeyboardTypeOptions, View } from 'react-native';

import { Control, FieldError } from 'react-hook-form';

interface CustomTextInputProps {
  control: Control<any>;
  name: string;
  label: string;
  error?: FieldError;
  icon: string;
  keyboardType?: KeyboardTypeOptions;
}

export const CustomTextInput = ({ control, name, label, error, icon, keyboardType = "default" }: CustomTextInputProps) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value } }) => (
      <View style={{ marginBottom: 10 }}>
        <TextInput
          mode="outlined"
          label={label} 
          value={value}
          onChangeText={onChange}
          keyboardType={keyboardType}
          right={<TextInput.Icon icon={icon} />}
          error={!!error}
        />
        <HelperText type="error" visible={!!error}>
          {error?.message}
        </HelperText>
      </View>
    )}
  />
);
