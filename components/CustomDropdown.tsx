import { Controller, FieldError } from 'react-hook-form';
import { Dropdown } from 'react-native-paper-dropdown';
import { View } from 'react-native';
import { HelperText } from 'react-native-paper';

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
          label={label}
          mode="outlined"
          options={options}
          value={value}
          onSelect={onChange}
          hideMenuHeader={true}
          error={!!error}
        />
        <HelperText type="error" visible={!!error}>
          {error?.message}
        </HelperText>
      </View>
    )}
  />
);
