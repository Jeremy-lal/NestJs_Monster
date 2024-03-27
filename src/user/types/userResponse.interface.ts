import { UserTypes } from './user.type';

export interface UserResponse {
  user: UserTypes & { token: string };
}
