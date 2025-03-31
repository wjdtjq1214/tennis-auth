import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';

import { AuthPayloadDto } from './dto/auth.payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      secretOrKey: process.env.JWT_ACCESS_SECRET ?? 'test',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: AuthPayloadDto): Promise<User> {
    const user: User = await this.userRepository.findUserByUuid(
      payload.userUuid,
    );

    if (!user) throw new UnauthorizedException(``);

    return user;
  }
}
