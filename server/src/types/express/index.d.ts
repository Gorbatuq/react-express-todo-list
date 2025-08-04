import { UserPayload } from "../auth/UserPayload"; 

declare global {
  namespace Express {
    interface Request {
      user: UserPayload;
    }
  }
}
