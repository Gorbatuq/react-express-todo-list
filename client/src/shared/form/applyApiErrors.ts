import type { FieldValues, UseFormSetError } from "react-hook-form";
import { ApiError } from "../../api/core/errors";

export function applyApiErrors<T extends FieldValues>(
  err: ApiError,
  setError: UseFormSetError<T>
) {
  if (!err.fields) return;

  for (const [field, messages] of Object.entries(err.fields)) {
    const msg = Array.isArray(messages) ? messages[0] : String(messages);
    setError(field as any, { type: "server", message: msg });
  }
}
