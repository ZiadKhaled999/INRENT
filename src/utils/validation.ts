// Validation utilities for InRent application

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Basic phone validation - adjust regex based on your requirements
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone.trim());
};

export const validateRentAmount = (amount: number): { isValid: boolean; error?: string } => {
  if (amount <= 0) {
    return { isValid: false, error: 'Rent amount must be greater than zero' };
  }
  if (amount > 1000000) {
    return { isValid: false, error: 'Rent amount seems unreasonably high' };
  }
  return { isValid: true };
};

export const validateDueDay = (day: number): { isValid: boolean; error?: string } => {
  if (day < 1 || day > 28) {
    return { isValid: false, error: 'Due day must be between 1 and 28' };
  }
  return { isValid: true };
};

export const validateHouseholdName = (name: string): { isValid: boolean; error?: string } => {
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    return { isValid: false, error: 'Household name cannot be empty' };
  }
  if (trimmedName.length > 100) {
    return { isValid: false, error: 'Household name is too long (max 100 characters)' };
  }
  return { isValid: true };
};

export const validateDisplayName = (name: string): { isValid: boolean; error?: string } => {
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    return { isValid: false, error: 'Display name cannot be empty' };
  }
  if (trimmedName.length > 50) {
    return { isValid: false, error: 'Display name is too long (max 50 characters)' };
  }
  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};