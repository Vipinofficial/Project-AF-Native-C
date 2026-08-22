/**
 * One error type for every failure mode. The old code did
 * `.catch(() => setListings([]))` in four places, so a network outage, a 500 and
 * a malformed payload were all indistinguishable from "no results".
 */
export class ApiError extends Error {
  readonly kind: 'network' | 'http' | 'parse';
  readonly status?: number;
  readonly cause?: unknown;

  constructor(
    kind: 'network' | 'http' | 'parse',
    message: string,
    options: { status?: number; cause?: unknown } = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = options.status;
    this.cause = options.cause;
  }

  /** True when retrying might plausibly succeed. */
  get isRetryable(): boolean {
    return this.kind === 'network' || (this.status !== undefined && this.status >= 500);
  }
}
