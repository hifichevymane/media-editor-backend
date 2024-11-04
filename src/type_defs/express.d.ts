import type { HydratedDocument } from "mongoose";
import type { IUser } from "../database/schemas/User";

declare global {
  namespace Express {
    interface User extends HydratedDocument<IUser> { }
  }
}
