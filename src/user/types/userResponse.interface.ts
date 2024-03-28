import { UserTypes } from './user.type';

export interface UserResponseInterface {
  user: UserTypes & { token: string };
}
