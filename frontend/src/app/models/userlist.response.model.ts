import { User } from "./user.model";

export interface UserListResponse {
  success: boolean,
  message: User[],
}

