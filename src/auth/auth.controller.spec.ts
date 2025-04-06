import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSignupReqDto } from './dto/auth.signup-req.dto';
import { AuthSignupResDto } from './dto/auth.signup-res.dto';
import { AuthSigninReqDto } from './dto/auth.signin-req.dto';
import { AuthSigninResDto } from './dto/auth.signin-res.dto';
import { AuthRefreshReqDto } from './dto/auth.refresh-req.dto';
import { AuthRefreshResDto } from './dto/auth.refresh-res.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      signUp: jest.fn(),
      signIn: jest.fn(),
      refresh: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(
      AuthService,
    ) as jest.Mocked<AuthService>;
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    it('should call AuthService.signUp and return the result', async () => {
      const mockSignupReqDto: AuthSignupReqDto = {
        id: 'test-id',
        pw: 'test-password',
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
      };

      const mockSignupResDto: AuthSignupResDto = { userUuid: 'test-uuid' };

      authService.signUp.mockResolvedValue(mockSignupResDto);

      const result = await authController.signUp(mockSignupReqDto);

      expect(authService.signUp).toHaveBeenCalledWith(mockSignupReqDto);
      expect(result).toEqual(mockSignupResDto);
    });
  });

  describe('signIn', () => {
    it('should call AuthService.signIn and return the result', async () => {
      const mockSigninReqDto: AuthSigninReqDto = {
        id: 'test-id',
        pw: 'test-password',
      };

      const mockSigninResDto: AuthSigninResDto = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        userUuid: 'test-uuid',
      };

      authService.signIn.mockResolvedValue(mockSigninResDto);

      const result = await authController.signIn(mockSigninReqDto);

      expect(authService.signIn).toHaveBeenCalledWith(mockSigninReqDto);
      expect(result).toEqual(mockSigninResDto);
    });
  });

  describe('refresh', () => {
    it('should call AuthService.refresh and return the result', async () => {
      const mockRefreshReqDto: AuthRefreshReqDto = {
        refreshToken: 'valid-refresh-token',
      };

      const mockRefreshResDto: AuthRefreshResDto = {
        accessToken: 'new-access-token',
      };

      authService.refresh.mockResolvedValue(mockRefreshResDto);

      const result = await authController.refresh(mockRefreshReqDto);

      expect(authService.refresh).toHaveBeenCalledWith(mockRefreshReqDto);
      expect(result).toEqual(mockRefreshResDto);
    });
  });
});
