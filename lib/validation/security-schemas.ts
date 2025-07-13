import { z } from 'zod';

// Password validation schema
export const passwordSchema = z.string()
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
  .refine((password) => {
    // Check for common patterns
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /admin/i,
      /letmein/i
    ];
    return !commonPatterns.some(pattern => pattern.test(password));
  }, 'Password contains common patterns and is not secure');

// Username validation schema
export const usernameSchema = z.string()
  .min(8, 'Username must be at least 8 characters')
  .max(30, 'Username must be less than 30 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
  .refine((username) => {
    // Ensure it doesn't start with a number
    return !/^[0-9]/.test(username);
  }, 'Username cannot start with a number');

// Government ID validation
export const governmentIdSchema = z.object({
  type: z.enum(['passport', 'drivers_license', 'national_id']),
  number: z.string().min(6, 'ID number must be at least 6 characters'),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .refine((date) => new Date(date) > new Date(), 'ID must not be expired')
});

// Address validation schema
export const addressSchema = z.object({
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  proofOfResidence: z.instanceof(File).optional()
});

// Complete registration schema
export const registrationSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    middleName: z.string().optional(),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    dateOfBirth: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in MM/DD/YYYY format')
      .refine((date) => {
        const [month, day, year] = date.split('/').map(Number);
        const birthDate = new Date(year, month - 1, day);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        return age >= 18 && age <= 120;
      }, 'Must be between 18 and 120 years old'),
    governmentId: governmentIdSchema
  }),
  contactInfo: z.object({
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
    address: addressSchema
  }),
  credentials: z.object({
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  }),
  twoFactorMethod: z.enum(['sms', 'email', 'authenticator']),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions')
});

// Login schema with security features
export const loginSchema = z.object({
  identifier: z.string().min(1, 'Username or account number is required'),
  password: z.string().min(1, 'Password is required'),
  captcha: z.string().optional(),
  twoFactorCode: z.string().optional()
});

// Transaction authorization schema
export const transactionAuthSchema = z.object({
  transactionId: z.string(),
  authMethod: z.enum(['2fa', 'biometric', 'pin']),
  authCode: z.string().min(6, 'Authorization code must be at least 6 characters'),
  deviceFingerprint: z.string()
});

// Password reset schema
export const passwordResetSchema = z.object({
  identifier: z.string().min(1, 'Email or phone number is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
  resetToken: z.string(),
  twoFactorCode: z.string().min(6, '2FA code is required')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});