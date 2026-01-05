import { Types } from "mongoose";
import { AppError } from "../errors/AppError";

export function ensureObjectId(value: string, name = "id") {
  if (!Types.ObjectId.isValid(value)) {
    throw new AppError(400, "INVALID_ID", `Invalid ${name}`);
  }
}
