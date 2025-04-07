// src/utils/date.utils.ts
import { format, parseISO, isValid, formatDistance } from 'date-fns';


export const formatDate = (dateString: string, formatStr: string = 'MMM dd, yyyy'): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '';
    return format(date, formatStr);
  } catch (error) {
    return '';
  }
};


export const formatDateTime = (dateString: string, formatStr: string = 'MMM dd, yyyy HH:mm'): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '';
    return format(date, formatStr);
  } catch (error) {
    return '';
  }
};


export const getRelativeTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '';
    return formatDistance(date, new Date(), { addSuffix: true });
  } catch (error) {
    return '';
  }
};


export const toISOString = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
};


export const toDate = (dateString: string): Date | null => {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
  } catch (error) {
    return null;
  }
};