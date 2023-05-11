import { Roles } from "./user.roles.model";

export interface User {
  username: string,
  password: string,
  role?: Roles,
}
