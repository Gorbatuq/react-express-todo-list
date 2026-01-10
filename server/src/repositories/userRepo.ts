import { User } from "../models/User";

export const userRepo = {
  findById(id: string) {
    return User.findById(id);
  },
  findByEmail(email: string) {
    return User.findOne({ email });
  },
};
