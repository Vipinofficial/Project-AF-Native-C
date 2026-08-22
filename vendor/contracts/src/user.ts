import { z } from 'zod';
import { LocalizedStringSchema } from './localized.ts';

export const USER_ROLES = ['customer', 'merchant'] as const;
export const UserRoleSchema = z.enum(USER_ROLES);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.number().int().positive(),
  phone: z.string(),
  role: UserRoleSchema,
  name: LocalizedStringSchema,
  shopName: LocalizedStringSchema.nullable(),
  pincode: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;

/** POST /api/auth/demo-login body. */
export const DemoLoginSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  role: UserRoleSchema.default('customer'),
});

export type DemoLogin = z.infer<typeof DemoLoginSchema>;
