import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProfileType } from './types/profile.type';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowEntity } from './entities/follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getProfile(
    userId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({
      where: { username: profileUsername },
    });

    if (!profile) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const follow = await this.followRepository.findOne({
      where: { followerId: userId, followingId: profile.id },
    });

    return { ...profile, following: Boolean(follow) };
  }

  async followProfile(
    userId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({
      where: { username: profileUsername },
    });

    if (!profile) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (profile.id === userId) {
      throw new HttpException(
        'Follower and following user cannot be the same',
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepository.findOne({
      where: { followerId: userId, followingId: profile.id },
    });

    if (follow) {
      throw new HttpException('User already followed', HttpStatus.BAD_REQUEST);
    }

    const followToCreate = new FollowEntity();
    followToCreate.followerId = userId;
    followToCreate.followingId = profile.id;

    await this.followRepository.save(followToCreate);

    return { ...profile, following: true };
  }

  async unfollowProfile(
    userId: number,
    profileUsername: string,
  ): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({
      where: { username: profileUsername },
    });

    if (!profile) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (profile.id === userId) {
      throw new HttpException(
        'Follower and following user cannot be the same',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.followRepository.delete({
      followerId: userId,
      followingId: profile.id,
    });

    return { ...profile, following: false };
  }

  buildProfileResponse(profile: any) {
    delete profile.email;
    return { profile };
  }
}
