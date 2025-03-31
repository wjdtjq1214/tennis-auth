import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthPayloadDto } from './dto/auth.payload.dto';

@Injectable()
export class JwtProvider {
  constructor(private jwtService: JwtService) {}

  accessTokenSign(payload: AuthPayloadDto): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRATION ?? '1800'),
    });
  }

  refreshTokenSign(payload: AuthPayloadDto): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRATION ?? '1209600'),
    });
  }

  refreshTokenVerify(refreshToken: string): AuthPayloadDto {
    const payload: AuthPayloadDto = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return { userUuid: payload.userUuid };
  }
}
