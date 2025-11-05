// Form validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return {
      valid: false,
      message: 'Password must contain uppercase, lowercase, and number'
    };
  }
  
  return { valid: true };
};

export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || value.toString().trim() === '') {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true };
};

export const validateLength = (value, min, max, fieldName = 'Field') => {
  const length = value ? value.toString().length : 0;
  
  if (length < min || length > max) {
    return {
      valid: false,
      message: `${fieldName} must be between ${min} and ${max} characters`
    };
  }
  
  return { valid: true };
};

export const validateNumber = (value, min, max, fieldName = 'Field') => {
  const num = Number(value);
  
  if (isNaN(num)) {
    return { valid: false, message: `${fieldName} must be a number` };
  }
  
  if (min !== undefined && num < min) {
    return { valid: false, message: `${fieldName} must be at least ${min}` };
  }
  
  if (max !== undefined && num > max) {
    return { valid: false, message: `${fieldName} cannot exceed ${max}` };
  }
  
  return { valid: true };
};

export const validateDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(date.getTime())) {
    return { valid: false, message: 'Invalid date format' };
  }
  
  if (date < today) {
    return { valid: false, message: 'Date cannot be in the past' };
  }
  
  return { valid: true };
};

export const validateUrl = (url) => {
  if (!url) return { valid: true }; // URL is optional
  
  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, message: 'Invalid URL format' };
  }
};

// Sanitize user input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
