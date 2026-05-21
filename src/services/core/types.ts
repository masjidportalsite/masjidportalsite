/**
 * Core types for the Service Layer.
 * Standardizes success and error patterns across all domain services.
 */

export type ServiceResult<T> = 
  | { data: T; error: null }
  | { data: null; error: ServiceError };

export interface ServiceError {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Common error codes for the platform.
 */
export const ServiceErrorCodes = {
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  DATABASE_ERROR: 'DATABASE_ERROR',
  TENANT_MISMATCH: 'TENANT_MISMATCH',
  UNKNOWN: 'UNKNOWN'
} as const;

/**
 * Standardizes service responses.
 */
export const createSuccess = <T>(data: T): ServiceResult<T> => ({
  data,
  error: null
});

export const createError = (code: keyof typeof ServiceErrorCodes, message: string, details?: unknown): ServiceResult<never> => ({
  data: null,
  error: { code, message, details }
});
