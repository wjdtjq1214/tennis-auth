import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UserCreateUpdateUserReqDto } from './dto/user.create-update-user-req.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const mockUserRepository = {
      findUserByUuid: jest.fn(),
      updateUser: jest.fn(),
      createUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(
      UserRepository,
    ) as jest.Mocked<UserRepository>;
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('getUser', () => {
    it('should return user details if the user exists', async () => {
      const mockUser = new User();

      userRepository.findUserByUuid.mockResolvedValue(mockUser);

      const result = await userService.getUser('test-uuid');

      expect(userRepository.findUserByUuid).toHaveBeenCalledWith('test-uuid');
      expect(result).toEqual({
        userUuid: mockUser.uuid,
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        phone: mockUser.phone,
        createdTime: mockUser.createdTime,
      });
    });

    it('should throw an error if the user does not exist', async () => {
      userRepository.findUserByUuid.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(userService.getUser('test-uuid')).rejects.toThrow(
        new HttpException('User not found', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('updateUser', () => {
    it('should update and return the user UUID', async () => {
      const mockUser = new User();
      const mockUserCreateUpdateUserReqDto: UserCreateUpdateUserReqDto = {
        id: 'updated-id',
        pw: 'updated-password',
        name: 'Updated User',
        email: 'updated@example.com',
        phone: '9876543210',
      };

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(
          (password: string, salt: string) => 'hashed-password',
        );

      userRepository.updateUser.mockResolvedValue(mockUser);

      const result = await userService.updateUser(
        'test-uuid',
        mockUserCreateUpdateUserReqDto,
      );

      expect(bcrypt.hash).toHaveBeenCalledWith(
        'updated-password',
        expect.any(String),
      );

      expect(userRepository.updateUser).toHaveBeenCalledWith('test-uuid', {
        ...mockUserCreateUpdateUserReqDto,
        pw: 'hashed-password',
      });
      expect(result).toEqual({ userUuid: mockUser.uuid });
    });

    it('should throw an error if the update fails', async () => {
      const mockUserCreateUpdateUserReqDto: UserCreateUpdateUserReqDto = {
        id: 'updated-id',
        pw: 'updated-password',
        name: 'Updated User',
        email: 'updated@example.com',
        phone: '9876543210',
      };

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(
          (password: string, salt: string) => 'hashed-password',
        );

      userRepository.updateUser.mockRejectedValue(new Error('Update failed'));

      await expect(
        userService.updateUser('test-uuid', mockUserCreateUpdateUserReqDto),
      ).rejects.toThrow(
        new HttpException('Update failed', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('createUser', () => {
    it('should hash the password, create the user, and return the user UUID', async () => {
      const mockUser = { uuid: 'test-uuid' } as User;
      const mockUserCreateUpdateUserReqDto: UserCreateUpdateUserReqDto = {
        id: 'test-id',
        pw: 'test-password',
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
      };

      userRepository.createUser.mockResolvedValue(mockUser);

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(
          (password: string, salt: string) => 'hashed-password',
        );

      const result = await userService.createUser(
        mockUserCreateUpdateUserReqDto,
      );

      expect(bcrypt.hash).toHaveBeenCalledWith(
        'test-password',
        expect.any(String),
      );
      expect(userRepository.createUser).toHaveBeenCalledWith({
        ...mockUserCreateUpdateUserReqDto,
        pw: 'hashed-password',
      });
      expect(result).toEqual({ userUuid: mockUser.uuid });
    });

    it('should throw an error if user creation fails', async () => {
      const mockUserCreateUpdateUserReqDto: UserCreateUpdateUserReqDto = {
        id: 'test-id',
        pw: 'test-password',
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
      };

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(
          (password: string, salt: string) => 'hashed-password',
        );

      userRepository.createUser.mockRejectedValue(new Error('Create failed'));

      await expect(
        userService.createUser(mockUserCreateUpdateUserReqDto),
      ).rejects.toThrow(
        new HttpException('Create failed', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });
});
