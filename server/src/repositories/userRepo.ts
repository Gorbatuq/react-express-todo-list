import { User } from "../models/User";

export const userRepo = {
  findById(id: string) {
    return User.findById(id);
  },
  findByEmail(email: string) {
    return User.findOne({ email });
  },
  findByGoogleSub(googleSub: string) {
    return User.findOne({ googleSub });
  },
  async upsertFromGoogle(input: {
    googleSub: string;
    email: string;
    name: string | null;
    avatar: string | null;
  }) {
    return User.findOneAndUpdate(
      { googleSub: input.googleSub },
      {
        $set: {
          email: input.email,
          username: input.name,
          avatar: input.avatar,
        },
        $setOnInsert: { googleSub: input.googleSub },
      },
      { new: true, upsert: true },
    );
  },
};
