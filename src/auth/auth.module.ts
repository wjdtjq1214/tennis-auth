import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserRepository } from 'src/user/user.repository';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtProvider } from './jwt.provider';
import { JwtStrategy } from './jwt.strategy';
import { RedisProvider } from './redis.provider';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtProvider,
    RedisProvider,
    UserRepository,
    JwtStrategy,
  ],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}
