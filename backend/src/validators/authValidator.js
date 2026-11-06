/**
 * TraceAI Auth Validation Schemas (Zod)
 */

import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Valid email address required'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  role: z.enum(['analyst', 'senior_analyst', 'admin']).optional()
});

export const loginSchema = z.object({
  email: z.string().email('Valid email address required'),
  password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  email: z.string().email().optional(),
  role: z.string().optional(),
  organization: z.string().max(120).optional()
});
