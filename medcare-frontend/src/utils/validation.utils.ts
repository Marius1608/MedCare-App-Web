// src/utils/validation.utils.ts
import * as yup from 'yup';

export const nameValidation = yup
  .string()
  .required('Name is required')
  .min(3, 'Name must be at least 3 characters')
  .max(100, 'Name must be at most 100 characters');

export const usernameValidation = yup
  .string()
  .required('Username is required')
  .min(3, 'Username must be at least 3 characters')
  .max(50, 'Username must be at most 50 characters');

export const passwordValidation = yup
  .string()
  .required('Password is required')
  .min(6, 'Password must be at least 6 characters');

export const optionalPasswordValidation = yup
  .string()
  .test(
    'emptyOrMinLength',
    'Password must be at least 6 characters',
    (value) => !value || value.length >= 6
  );

export const priceValidation = yup
  .number()
  .required('Price is required')
  .positive('Price must be positive');

export const durationValidation = yup
  .number()
  .required('Duration is required')
  .positive('Duration must be positive')
  .integer('Duration must be a whole number')
  .max(480, 'Duration cannot exceed 8 hours (480 minutes)');

export const dateTimeValidation = yup
  .date()
  .required('Date and time are required')
  .min(new Date(), 'Date and time must be in the future');

export const specializationValidation = yup
  .string()
  .required('Specialization is required')
  .min(3, 'Specialization must be at least 3 characters')
  .max(100, 'Specialization must be at most 100 characters');

export const workHoursValidation = yup
  .string()
  .required('Work hours are required')
  .matches(
    /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
    'Work hours must be in format HH:MM-HH:MM'
  );

export const parseValidationErrors = (errorMessage: string): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  try {
   
    const errorObj = JSON.parse(errorMessage);
    
    if (Array.isArray(errorObj)) {
      errorObj.forEach(error => {
        if (error.field && error.message) {
          errors[error.field] = error.message;
        }
      });
    } else if (typeof errorObj === 'object') {
      Object.keys(errorObj).forEach(key => {
        errors[key] = errorObj[key];
      });
    }
  } catch (e) {
    const fieldErrors = errorMessage.match(/[a-zA-Z]+: [^,;]+(,|;|$)/g);
    
    if (fieldErrors) {
      fieldErrors.forEach(fieldError => {
        const [field, message] = fieldError.split(': ');
        errors[field.trim()] = message.replace(/[,;]$/, '').trim();
      });
    } else {
      errors.general = errorMessage;
    }
  }
  
  return errors;
};