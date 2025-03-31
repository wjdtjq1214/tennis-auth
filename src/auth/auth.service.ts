import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UserRepository } from 'src/user/user.repository';

import { AuthPayloadDto } from './dto/auth.payload.dto';
import { AuthRefreshReqDto } from './dto/auth.refresh-req.dto';
import { AuthRefreshResDto } from './dto/auth.refresh-res.dto';
import { AuthSigninReqDto } from './dto/auth.signin-req.dto';
import { AuthSigninResDto } from './dto/auth.signin-res.dto';
import { AuthSignupReqDto } from './dto/auth.signup-req.dto';
import { AuthSignupResDto } from './dto/auth.signup-res.dto';
import { JwtProvider } from './jwt.provider';
import { RedisProvider } from './redis.provider';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtProvider: JwtProvider,
    private redisProvider: RedisProvider,
  ) {}

  async signUp(authSignupReqDto: AuthSignupReqDto): Promise<AuthSignupResDto> {
    try {
      authSignupReqDto.pw = await bcrypt.hash(
        authSignupReqDto.pw,
        await bcrypt.genSalt(),
      );

      const user = await this.userRepository.createUser(authSignupReqDto);

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

  async signIn(authSigninDto: AuthSigninReqDto): Promise<AuthSigninResDto> {
    try {
      const user = await this.userRepository.findUserById(authSigninDto.id);

      if (!user) {
        throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
      }

      const isMatch = await bcrypt.compare(authSigninDto.pw, user.pw);

      if (!isMatch) {
        throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
      }

      const payload: AuthPayloadDto = { userUuid: user.uuid };
      const accessToken = this.jwtProvider.accessTokenSign(payload);
      const refreshToken = this.jwtProvider.refreshTokenSign(payload);

      this.redisProvider.set(user.uuid, refreshToken);

      return {
        refreshToken,
        accessToken,
        userUuid: user.uuid,
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

  async refresh(
    authRefreshReqDto: AuthRefreshReqDto,
  ): Promise<AuthRefreshResDto> {
    try {
      const payload = this.jwtProvider.refreshTokenVerify(
        authRefreshReqDto.refreshToken,
      );

      if (!payload) {
        throw new HttpException(
          'Invalid Refresh Token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const refreshToken = await this.redisProvider.get(payload.userUuid);

      if (!refreshToken || refreshToken !== authRefreshReqDto.refreshToken) {
        throw new HttpException(
          'Invalid Refresh Token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const accessToken = this.jwtProvider.accessTokenSign(payload);

      return { accessToken };
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
