export type Result<T, E = AppError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export class AppError extends Error {
  ) {
    super(message);
    this.name = 'AppError';
  },
  constructor(
    public readonly code: string,
  message: string
}

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export function toIpcResult<T>(result: Result<T, AppError>) {
  if (result.ok) {
    return { success: true as const, data: result.value };
  }

  return {
    success: false as const,
    // Narrow the union explicitly for the error branch
    error: (() => {
      const r = result;

      return { code: r.error.code, message: r.error.message };
    })(),
  };
}
