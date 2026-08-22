import { z } from 'zod';
import {
  ListingSchema, CreateListingSchema, type Listing, type CreateListing,
  OrderSchema, CreateOrderSchema, type Order, type CreateOrder,
  UserSchema, DemoLoginSchema, type User, type DemoLogin,
  LocalizedStringSchema,
} from '@arli/contracts';
import { ApiError } from './errors.ts';

export interface ApiClientOptions {
  /** Injected by each app — see the deployment section of ARCHITECTURE-PLAN.md.
   *  Web passes `import.meta.env.VITE_API_URL`, native passes
   *  `process.env.EXPO_PUBLIC_API_URL`. This package never reads env itself,
   *  because Vite and Expo inline their vars at build time and Node reads them
   *  at runtime — no single expression works on all three. */
  baseUrl: string;
  /** Defaults to global fetch; injectable for tests. */
  fetch?: typeof globalThis.fetch;
  /** Request timeout in ms. Default 15s. */
  timeoutMs?: number;
}

export interface ApiClient {
  health(): Promise<{ status: string; message: string; dbTime: string }>;
  listings: {
    list(): Promise<Listing[]>;
    create(input: CreateListing): Promise<Listing>;
  };
  orders: {
    list(): Promise<Order[]>;
    create(input: CreateOrder): Promise<Order>;
  };
  auth: {
    demoLogin(input: DemoLogin): Promise<User>;
  };
}

const HealthSchema = z.object({
  status: z.string(),
  message: z.string(),
  dbTime: z.string(),
});

/**
 * TEMPORARY. `POST /api/auth/demo-login` returns the raw Postgres row —
 * snake_case, with `created_at` — while every other endpoint returns a mapped
 * camelCase object. Adapting here keeps clients working against the contract
 * until Phase 5 gives the backend a mapper; delete this once it does.
 */
const RawUserSchema = z.object({
  id: z.number().int().positive(),
  phone: z.string(),
  role: z.enum(['customer', 'merchant']),
  name: LocalizedStringSchema,
  shop_name: LocalizedStringSchema.nullable().optional(),
  pincode: z.string().nullable().optional(),
});

export function createApiClient(options: ApiClientOptions): ApiClient {
  const { baseUrl, fetch: fetchImpl = globalThis.fetch, timeoutMs = 15_000 } = options;

  if (!baseUrl) {
    throw new Error(
      'createApiClient: baseUrl is required. Pass import.meta.env.VITE_API_URL (web) ' +
      'or process.env.EXPO_PUBLIC_API_URL (native).',
    );
  }

  const root = baseUrl.replace(/\/+$/, '');

  async function request<T>(
    path: string,
    schema: z.ZodType<T>,
    init?: RequestInit,
  ): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;
    try {
      response = await fetchImpl(`${root}${path}`, {
        ...init,
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', ...init?.headers },
      });
    } catch (cause) {
      const aborted = cause instanceof Error && cause.name === 'AbortError';
      throw new ApiError(
        'network',
        aborted ? `Request to ${path} timed out after ${timeoutMs}ms` : `Could not reach ${root}`,
        { cause },
      );
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      // The API returns { error: string } on failure.
      const detail = await response.json().catch(() => null) as { error?: string } | null;
      throw new ApiError('http', detail?.error ?? `${response.status} ${response.statusText}`, {
        status: response.status,
      });
    }

    const payload = await response.json().catch((cause) => {
      throw new ApiError('parse', `${path} did not return valid JSON`, { cause });
    });

    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      throw new ApiError('parse', `${path} returned an unexpected shape: ${parsed.error.message}`, {
        cause: parsed.error,
      });
    }
    return parsed.data;
  }

  const json = (body: unknown): RequestInit => ({
    method: 'POST',
    body: JSON.stringify(body),
  });

  return {
    health: () => request('/api/health', HealthSchema),

    listings: {
      list: () => request('/api/listings', z.array(ListingSchema)),
      create: (input) =>
        request('/api/listings', ListingSchema, json(CreateListingSchema.parse(input))),
    },

    orders: {
      list: () => request('/api/orders', z.array(OrderSchema)),
      create: (input) =>
        request('/api/orders', OrderSchema, json(CreateOrderSchema.parse(input))),
    },

    auth: {
      demoLogin: async (input) => {
        const raw = await request(
          '/api/auth/demo-login',
          RawUserSchema,
          json(DemoLoginSchema.parse(input)),
        );
        return UserSchema.parse({
          id: raw.id,
          phone: raw.phone,
          role: raw.role,
          name: raw.name,
          shopName: raw.shop_name ?? null,
          pincode: raw.pincode ?? null,
        });
      },
    },
  };
}
