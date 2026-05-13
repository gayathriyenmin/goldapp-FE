import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address');
export const phoneSchema = z.string().min(10, 'Phone number must be at least 10 digits');
export const requiredSchema = (field: string) => z.string().min(1, `${field} is required`);
