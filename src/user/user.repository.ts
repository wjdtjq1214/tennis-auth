import {
  // ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserCreateUpdateUserReqDto } from './dto/user.create-update-user-req.dto';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authSignupReqDto: UserCreateUpdateUserReqDto): Promise<User> {
    try {
      return await this.save(this.create(authSignupReqDto));;
    } catch (e: unknown) {
      if (e instanceof Error) {
        // if (e.code === '23505') throw new ConflictException('Existing User');
        // else throw new InternalServerErrorException(e.message);
        throw new InternalServerErrorException(e.message);
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  async findUserById(id: string): Promise<User> {
    try {
      const user = await this.findOne({
        where: { id },
      });

      if (!user) throw new UnauthorizedException(`${id} User is not found`);

      return user;
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new InternalServerErrorException(e.message);
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  async findUserByUuid(uuid: string): Promise<User> {
    try {
      const user = await this.findOne({
        where: { uuid },
      });

      if (!user)
        throw new InternalServerErrorException(`${uuid} User is not found`);

      return user;
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new InternalServerErrorException(e.message);
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  async updateUser(
    uuid: string,
    userCreateUpdateUserReqDto: UserCreateUpdateUserReqDto,
  ): Promise<User> {
    try {
      const user = await this.findOne({
        where: { uuid },
      });

      if (!user)
        throw new InternalServerErrorException(`${uuid} User is not found`);

      user.id = userCreateUpdateUserReqDto.id;
      user.pw = userCreateUpdateUserReqDto.pw;
      user.name = userCreateUpdateUserReqDto.name;
      user.email = userCreateUpdateUserReqDto.email;
      user.phone = userCreateUpdateUserReqDto.phone;

      await user.save();

      return user;
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new InternalServerErrorException(e.message);
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }
}
