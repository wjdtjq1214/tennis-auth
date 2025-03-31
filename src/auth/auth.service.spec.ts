import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/user/user.repository';
import { JwtProvider } from './jwt.provider';
import { RedisProvider } from './redis.provider';
import { AuthRefreshReqDto } from './dto/auth.refresh-req.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthService - refresh', () => {
  let authService: AuthService;
  let jwtProvider: jest.Mocked<JwtProvider>;
  let redisProvider: jest.Mocked<RedisProvider>;

  beforeEach(async () => {
    const mockJwtProvider = {
      refreshTokenVerify: jest.fn(),
      accessTokenSign: jest.fn(),
    };

    const mockRedisProvider = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: {} }, // Mock UserRepository if needed
        { provide: JwtProvider, useValue: mockJwtProvider },
        { provide: RedisProvider, useValue: mockRedisProvider },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtProvider = module.get<JwtProvider>(JwtProvider) as jest.Mocked<JwtProvider>;
    redisProvider = module.get<RedisProvider>(RedisProvider) as jest.Mocked<RedisProvider>;
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(jwtProvider).toBeDefined();
    expect(redisProvider).toBeDefined();
  });

  describe('refresh', () => {
    it('should return a new access token if the refresh token is valid', async () => {
      const mockPayload = { userUuid: 'test-uuid' };
      const mockRefreshToken = 'valid-refresh-token';
      const mockAccessToken = 'new-access-token';

      const authRefreshReqDto: AuthRefreshReqDto = {
        refreshToken: mockRefreshToken,
      };

      jwtProvider.refreshTokenVerify.mockReturnValue(mockPayload);
      redisProvider.get.mockResolvedValue(mockRefreshToken);
      jwtProvider.accessTokenSign.mockReturnValue(mockAccessToken);

      const result = await authService.refresh(authRefreshReqDto);

      expect(jwtProvider.refreshTokenVerify).toHaveBeenCalledWith(mockRefreshToken);
      expect(redisProvider.get).toHaveBeenCalledWith(mockPayload.userUuid);
      expect(jwtProvider.accessTokenSign).toHaveBeenCalledWith(mockPayload);
      expect(result).toEqual({ accessToken: mockAccessToken });
    });

    it('should throw an error if the refresh token is invalid', async () => {
      const authRefreshReqDto: AuthRefreshReqDto = {
        refreshToken: 'invalid-refresh-token',
      };

      jwtProvider.refreshTokenVerify.mockImplementation(() => {
        throw new Error('Invalid Refresh Token');
      });

      await expect(authService.refresh(authRefreshReqDto)).rejects.toThrow(
        new HttpException('Invalid Refresh Token', HttpStatus.UNAUTHORIZED),
      );

      expect(jwtProvider.refreshTokenVerify).toHaveBeenCalledWith('invalid-refresh-token');
      expect(redisProvider.get).not.toHaveBeenCalled();
    });

    it('should throw an error if the refresh token does not match the stored token', async () => {
      const mockPayload = { userUuid: 'test-uuid' };
      const authRefreshReqDto: AuthRefreshReqDto = {
        refreshToken: 'mismatched-refresh-token',
      };

      jwtProvider.refreshTokenVerify.mockReturnValue(mockPayload);
      redisProvider.get.mockResolvedValue('stored-refresh-token');

      await expect(authService.refresh(authRefreshReqDto)).rejects.toThrow(
        new HttpException('Invalid Refresh Token', HttpStatus.UNAUTHORIZED),
      );

      expect(jwtProvider.refreshTokenVerify).toHaveBeenCalledWith('mismatched-refresh-token');
      expect(redisProvider.get).toHaveBeenCalledWith(mockPayload.userUuid);
    });

    it('should throw an internal server error if an unexpected error occurs', async () => {
      const authRefreshReqDto: AuthRefreshReqDto = {
        refreshToken: 'valid-refresh-token',
      };

      jwtProvider.refreshTokenVerify.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      await expect(authService.refresh(authRefreshReqDto)).rejects.toThrow(
        new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR),
      );

      expect(jwtProvider.refreshTokenVerify).toHaveBeenCalledWith('valid-refresh-token');
    });
  });
});