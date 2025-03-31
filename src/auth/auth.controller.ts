import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthRefreshReqDto } from './dto/auth.refresh-req.dto';
import { AuthRefreshResDto } from './dto/auth.refresh-res.dto';
import { AuthSignupReqDto } from './dto/auth.signup-req.dto';
import { AuthSignupResDto } from './dto/auth.signup-res.dto';
import { AuthSigninReqDto } from './dto/auth.signin-req.dto';
import { AuthSigninResDto } from './dto/auth.signin-res.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authSignupReqDto: AuthSignupReqDto,
  ): Promise<AuthSignupResDto> {
    return await this.authService.signUp(authSignupReqDto);
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) authSigninDto: AuthSigninReqDto,
  ): Promise<AuthSigninResDto> {
    return await this.authService.signIn(authSigninDto);
  }

  @Post('/refresh')
  async refresh(
    @Body(ValidationPipe) authRefreshReqDto: AuthRefreshReqDto,
  ): Promise<AuthRefreshResDto> {
    return await this.authService.refresh(authRefreshReqDto);
  }
}
