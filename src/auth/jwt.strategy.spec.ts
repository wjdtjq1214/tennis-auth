import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from 'src/user/user.repository';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.payload.dto';
import { User } from 'src/user/user.entity';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    const mockUserRepository = {
      findUserByUuid: jest.fn(),
    };

    jwtStrategy = new JwtStrategy(mockUserRepository as unknown as UserRepository);
    userRepository = mockUserRepository as unknown as jest.Mocked<UserRepository>;
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('validate', () => {
    it('should return the user if the user exists', async () => {
      const mockPayload: AuthPayloadDto = { userUuid: 'test-uuid' };
      const mockUser: User = {
        uuid: 'test-uuid',
        id: 'test-id',
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        createdTime: new Date(),
      } as User;

      userRepository.findUserByUuid.mockResolvedValue(mockUser);

      const result = await jwtStrategy.validate(mockPayload);

      expect(userRepository.findUserByUuid).toHaveBeenCalledWith('test-uuid');
      expect(result).toEqual(mockUser);
    });

    it('should throw an UnauthorizedException if the user does not exist', async () => {
      const mockPayload: AuthPayloadDto = { userUuid: 'non-existent-uuid' };

      userRepository.findUserByUuid.mockImplementation(() => {
        throw new InternalServerErrorException()
      });

      await expect(jwtStrategy.validate(mockPayload)).rejects.toThrow(
        new InternalServerErrorException(),
      );

      expect(userRepository.findUserByUuid).toHaveBeenCalledWith('non-existent-uuid');
    });
  });
});