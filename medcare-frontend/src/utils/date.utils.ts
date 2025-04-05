// src/utils/date.utils.ts
import { format, parseISO, isValid, formatDistance } from 'date-fns';

/**
 * Format a date string to a readable format
 * @param dateString ISO date string
 * @param formatStr Date format string (default: 'MMM dd, yyyy')
 * @returns Formatted date string or empty string if invalid
 */
export const formatDate = (dateString: string, formatStr: string = 'MMM dd, yyyy'): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '';
    return format(date, formatStr);
  } catch (error) {
    return '';
  }
};

/**
 * Format a date and time string to a readable format
 * @param dateString ISO date string
 * @param formatStr Date format string (default: 'MMM dd, yyyy HH:mm')
 * @returns Formatted date and time string or empty string if invalid
 */
export const formatDateTime = (dateString: string, formatStr: string = 'MMM dd, yyyy HH:mm'): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '';
    return format(date, formatStr);
  } catch (error) {
    return '';
  }
};

/**
 * Get a relative time string (e.g., "2 days ago")
 * @param dateString ISO date string
 * @returns Relative time string or empty string if invalid
 */
export const getRelativeTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '';
    return formatDistance(date, new Date(), { addSuffix: true });
  } catch (error) {
    return '';
  }
};

/**
 * Format a Date object to ISO string (yyyy-MM-dd'T'HH:mm:ss)
 * @param date Date object
 * @returns ISO date string
 */
export const toISOString = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
};

/**
 * Convert a date string to a Date object
 * @param dateString ISO date string
 * @returns Date object or null if invalid
 */
export const toDate = (dateString: string): Date | null => {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
  } catch (error) {
    return null;
  }
};