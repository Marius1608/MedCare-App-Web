// src/components/common/FormElements.tsx
import React from 'react';
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  FormHelperText,
  SelectChangeEvent,
  TextFieldProps
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


interface FormTextFieldProps extends Omit<TextFieldProps, 'error'> {
  name: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  fullWidth?: boolean;
}

export const FormTextField: React.FC<FormTextFieldProps> = ({
  name,
  label,
  value,
  onChange,
  error,
  fullWidth = true,
  ...props
}) => {
  return (
    <TextField
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error}
      fullWidth={fullWidth}
      margin="normal"
      {...props}
    />
  );
};

interface FormSelectProps {
  name: string;
  label: string;
  value: string | number;
  onChange: (e: SelectChangeEvent<string | number>) => void;
  options: { value: string | number; label: string }[];
  error?: string;
  fullWidth?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  value,
  onChange,
  options,
  error,
  fullWidth = true,
}) => {
  return (
    <FormControl fullWidth={fullWidth} margin="normal" error={!!error}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-label`}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

interface FormDateTimePickerProps {
  name: string;
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
  fullWidth?: boolean;
  minDate?: Date;
  disablePast?: boolean;
}

export const FormDateTimePicker: React.FC<FormDateTimePickerProps> = ({
  name,
  label,
  value,
  onChange,
  error,
  fullWidth = true,
  minDate,
  disablePast = false,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label={label}
        value={value}
        onChange={onChange}
        disablePast={disablePast}
        minDate={minDate}
        slotProps={{
          textField: {
            margin: 'normal',
            fullWidth: fullWidth,
            error: !!error,
            helperText: error,
            id: name,
            name: name,
          },
        }}
      />
    </LocalizationProvider>
  );
};