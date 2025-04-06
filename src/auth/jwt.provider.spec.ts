import { JwtProvider } from './jwt.provider';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/auth.payload.dto';

describe('JwtProvider', () => {
  let jwtProvider: JwtProvider;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    jwtProvider = new JwtProvider(mockJwtService as unknown as JwtService);
    jwtService = mockJwtService as unknown as jest.Mocked<JwtService>;
  });

  it('should be defined', () => {
    expect(jwtProvider).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('accessTokenSign', () => {
    it('should sign the access token with the correct payload and options', () => {
      const mockPayload: AuthPayloadDto = { userUuid: 'test-uuid' };
      const mockAccessToken = 'access-token';

      jwtService.sign.mockReturnValue(mockAccessToken);

      const result = jwtProvider.accessTokenSign(mockPayload);

      expect(jwtService.sign).toHaveBeenCalledWith(mockPayload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRATION ?? '1800'),
      });
      expect(result).toBe(mockAccessToken);
    });
  });

  describe('refreshTokenSign', () => {
    it('should sign the refresh token with the correct payload and options', () => {
      const mockPayload: AuthPayloadDto = { userUuid: 'test-uuid' };
      const mockRefreshToken = 'refresh-token';

      jwtService.sign.mockReturnValue(mockRefreshToken);

      const result = jwtProvider.refreshTokenSign(mockPayload);

      expect(jwtService.sign).toHaveBeenCalledWith(mockPayload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRATION ?? '1209600'),
      });
      expect(result).toBe(mockRefreshToken);
    });
  });

  describe('refreshTokenVerify', () => {
    it('should verify the refresh token and return the payload', () => {
      const mockRefreshToken = 'refresh-token';
      const mockPayload: AuthPayloadDto = { userUuid: 'test-uuid' };

      jwtService.verify.mockReturnValue(mockPayload);

      const result = jwtProvider.refreshTokenVerify(mockRefreshToken);

      expect(jwtService.verify).toHaveBeenCalledWith(mockRefreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      expect(result).toEqual(mockPayload);
    });

    it('should throw an error if the refresh token is invalid', () => {
      const mockRefreshToken = 'invalid-refresh-token';

      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => jwtProvider.refreshTokenVerify(mockRefreshToken)).toThrow(
        'Invalid token',
      );
      expect(jwtService.verify).toHaveBeenCalledWith(mockRefreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    });
  });
});
