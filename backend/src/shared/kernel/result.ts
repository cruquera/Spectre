export type Result<T, E = AppError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export class AppError extends Error {
  public constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ error, ok: false });

export function toIpcResult<T>(result: Result<T, AppError>): { success: true; data: T } | { success: false; error: { code: string; message: string } } {
  if (result.ok) {
    return { data: result.value, success: true as const };
  }

  return {
    error: { code: result.error.code, message: result.error.message },
    success: false as const,
  };
}
