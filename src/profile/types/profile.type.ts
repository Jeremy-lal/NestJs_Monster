import { UserTypes } from 'src/user/types/user.type';

export type ProfileType = UserTypes & { following: boolean };
