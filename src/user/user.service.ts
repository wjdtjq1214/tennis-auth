import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UserCreateUpdateUserReqDto } from './dto/user.create-update-user-req.dto';
import { UserCreateUpdateUserResDto } from './dto/user.creat-update-user-res.dto';
import { UserGetUserResDto } from './dto/user.get-user-res.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUser(uuid: string): Promise<UserGetUserResDto> {
    try {
      const user = await this.userRepository.findUserByUuid(uuid);

      return {
        userUuid: user.uuid,
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdTime: user.createdTime,
      };
    } catch (e: unknown) {
      if (e instanceof Error) {
        Logger.error(e.message);
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updateUser(
    uuid: string,
    userCreateUpdateUserReqDto: UserCreateUpdateUserReqDto,
  ): Promise<UserCreateUpdateUserResDto> {
    try {
      userCreateUpdateUserReqDto.pw = await bcrypt.hash(
        userCreateUpdateUserReqDto.pw,
        await bcrypt.genSalt(),
      );

      const user = await this.userRepository.updateUser(
        uuid,
        userCreateUpdateUserReqDto,
      );

      return { userUuid: user.uuid };
    } catch (e: unknown) {
      if (e instanceof Error) {
        Logger.error(e.message);
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async createUser(
    userCreateUpdateUserReqDto: UserCreateUpdateUserReqDto,
  ): Promise<UserCreateUpdateUserResDto> {
    try {
      userCreateUpdateUserReqDto.pw = await bcrypt.hash(
        userCreateUpdateUserReqDto.pw,
        await bcrypt.genSalt(),
      );

      const user = await this.userRepository.createUser(
        userCreateUpdateUserReqDto,
      );

      return { userUuid: user.uuid };
    } catch (e: unknown) {
      if (e instanceof Error) {
        Logger.error(e.message);
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
