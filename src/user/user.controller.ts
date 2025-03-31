import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserCreateUpdateUserReqDto } from './dto/user.create-update-user-req.dto';
import { UserCreateUpdateUserResDto } from './dto/user.creat-update-user-res.dto';
import { UserGetUserResDto } from './dto/user.get-user-res.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:uuid')
  async getUser(@Param('uuid') uuid: string): Promise<UserGetUserResDto> {
    return await this.userService.getUser(uuid);
  }

  @Put('/:uuid')
  async updateUser(
    @Param('uuid') uuid: string,
    @Body(ValidationPipe) userCreateUpdateUserReqDto: UserCreateUpdateUserReqDto,
  ): Promise<UserCreateUpdateUserResDto> {
    return await this.userService.updateUser(uuid, userCreateUpdateUserReqDto);
  }

  @Post()
  async createUser(
    @Body(ValidationPipe) userCreateUpdateUserReqDto: UserCreateUpdateUserReqDto,
  ): Promise<UserCreateUpdateUserResDto> {
    return await this.userService.createUser(userCreateUpdateUserReqDto);
  }
}
