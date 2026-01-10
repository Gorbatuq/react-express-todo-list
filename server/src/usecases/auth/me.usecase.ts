import { AppError } from "../../errors/AppError";
import { userRepo } from "../../repositories/userRepo";
import { toUserDto } from "../../dto/userDto";

export async function meUsecase(userId: string) {
  const user = await userRepo.findById(userId);
  if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found");
  return toUserDto(user);
}
