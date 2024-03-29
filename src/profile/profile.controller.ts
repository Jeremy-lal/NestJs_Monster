import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { User } from 'src/user/decorators/user.decorator';
import { ProfileService } from './profile.service';
import { AuthGuard } from 'src/user/guards/auth.guard';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async findProfile(
    @User('id') userId,
    @Param('username') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(
      userId,
      profileUsername,
    );

    return this.profileService.buildProfileResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') userId,
    @Param('username') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.followProfile(
      userId,
      profileUsername,
    );

    return this.profileService.buildProfileResponse(profile);
  }

  @Delete(':username/unfollow')
  @UseGuards(AuthGuard)
  async unfollowProfile(
    @User('id') userId,
    @Param('username') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.unfollowProfile(
      userId,
      profileUsername,
    );

    return this.profileService.buildProfileResponse(profile);
  }
}
