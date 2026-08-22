import { z } from 'zod';
import { LocalizedStringSchema } from './localized.ts';

/**
 * Order status is stored as a smallint. The old code compared bare numbers
 * (`status >= 2`) with the meaning living only in a comment, so the labels and
 * the ordering now live here with the type.
 */
export const ORDER_STATUS = {
  Placed: 0,
  Accepted: 1,
  InProgress: 2,
  Ready: 3,
  Delivered: 4,
} as const;

export const ORDER_STATUS_VALUES = [0, 1, 2, 3, 4] as const;
export const OrderStatusSchema = z.union([
  z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4),
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

/** i18n keys for each status, resolved against `@arli/i18n` common namespace. */
export const ORDER_STATUS_I18N_KEY = {
  0: 'stPlaced',
  1: 'stAccepted',
  2: 'stProgress',
  3: 'stReady',
  4: 'stDelivered',
} as const satisfies Record<OrderStatus, string>;

export const OrderSchema = z.object({
  /** Human-readable id, e.g. "ARL-4821". Not a serial. */
  id: z.string(),
  cust: LocalizedStringSchema,
  item: LocalizedStringSchema,
  qty: z.number().int().positive(),
  amt: z.number().nonnegative(),
  /** Whether customer measurements are attached to this order. */
  meas: z.boolean(),
  status: OrderStatusSchema,
});

export type Order = z.infer<typeof OrderSchema>;

/** POST /api/orders body. */
export const CreateOrderSchema = z.object({
  cust: LocalizedStringSchema.optional(),
  item: LocalizedStringSchema.optional(),
  qty: z.number().int().positive().default(1),
  amt: z.number().nonnegative().default(0),
  meas: z.boolean().default(false),
  status: OrderStatusSchema.default(0),
});

export type CreateOrder = z.infer<typeof CreateOrderSchema>;
