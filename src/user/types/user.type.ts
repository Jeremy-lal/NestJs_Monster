import { UserEntity } from '../user.entity';

export type UserTypes = Omit<UserEntity, 'hashPassword'>;
