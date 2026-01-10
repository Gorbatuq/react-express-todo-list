export type FieldErrors = Record<string, string[]>;

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly fields?: FieldErrors
  ) {
    super(message);
  }
}
