export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  if (email.length > 255) return 'Email must be less than 255 characters';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (password.length > 100) return 'Password must be less than 100 characters';
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name || !name.trim()) return 'Name is required';
  if (name.trim().length > 100) return 'Name must be less than 100 characters';
  return null;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || !value.trim()) return `${fieldName} is required`;
  return null;
};

export const validateNumber = (value: any, fieldName: string): string | null => {
  if (value === null || value === undefined || value === '') return `${fieldName} is required`;
  if (isNaN(Number(value))) return `${fieldName} must be a number`;
  if (Number(value) < 0) return `${fieldName} must be positive`;
  return null;
};
