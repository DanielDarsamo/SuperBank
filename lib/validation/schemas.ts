import { z } from 'zod';

export const phoneSchema = z.string()
  .min(9, 'Phone number must be at least 9 digits')
  .max(15, 'Phone number must be at most 15 digits')
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

export const pinSchema = z.string()
  .length(4, 'PIN must be exactly 4 digits')
  .regex(/^\d{4}$/, 'PIN must contain only numbers');

export const otpSchema = z.string()
  .length(6, 'Verification code must be 6 digits')
  .regex(/^\d{6}$/, 'Verification code must contain only numbers');

export const loginSchema = z.object({
  phone: phoneSchema,
});

export const pinSetupSchema = z.object({
  pin: pinSchema,
  confirmPin: pinSchema,
}).refine((data) => data.pin === data.confirmPin, {
  message: "PINs don't match",
  path: ["confirmPin"],
});

export const pinVerifySchema = z.object({
  pin: pinSchema,
});

export const otpVerifySchema = z.object({
  otp: otpSchema,
});

export const accountApplicationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  idNumber: z.string().min(8, 'ID number must be at least 8 characters'),
  nuit: z.string().min(9, 'NUIT must be at least 9 digits').max(9, 'NUIT must be exactly 9 digits'),
  idDocument: z.instanceof(File).optional(),
  incomeDocument: z.instanceof(File).optional(),
});

export const queueJoinSchema = z.object({
  branchId: z.string().min(1, 'Please select a branch'),
  serviceType: z.string().min(1, 'Please select a service'),
});

export const transferSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  recipientAccount: z.string().min(10, 'Invalid account number'),
  description: z.string().optional(),
});