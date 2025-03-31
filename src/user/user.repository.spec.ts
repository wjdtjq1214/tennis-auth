import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UserCreateUpdateUserReqDto } from './dto/user.create-update-user-req.dto';
import {
  InternalServerErrorException
} from '@nestjs/common';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockDataSource: Partial<DataSource>;

  beforeEach(async () => {
    mockDataSource = {
      createEntityManager: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    it('should create and save a user successfully', async () => {
      const mockUser = new User();
      const mockUserCreateUpdateUserReqDto = new UserCreateUpdateUserReqDto()

      jest.spyOn(userRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await userRepository.createUser(mockUserCreateUpdateUserReqDto);

      expect(userRepository.create).toHaveBeenCalledWith(mockUserCreateUpdateUserReqDto);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw an InternalServerErrorException on error', async () => {
      const mockUserCreateUpdateUserReqDto = new UserCreateUpdateUserReqDto()

      jest.spyOn(userRepository, 'save').mockRejectedValue(new Error('Save error'));

      await expect(userRepository.createUser(mockUserCreateUpdateUserReqDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findUserById', () => {
    it('should return a user if found', async () => {
      const mockUser = new User();
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await userRepository.findUserById('test-id');

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 'test-id' } });
      expect(result).toEqual(mockUser);
    });

    it('should throw an UnauthorizedException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(userRepository.findUserById('test-id')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findUserByUuid', () => {
    it('should return a user if found', async () => {
      const mockUser = new User();
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await userRepository.findUserByUuid('test-uuid');

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { uuid: 'test-uuid' } });
      expect(result).toEqual(mockUser);
    });

    it('should throw an InternalServerErrorException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(userRepository.findUserByUuid('test-uuid')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update and return the user', async () => {
      const mockUser = new User();
      const mockUserCreateUpdateUserReqDto = new UserCreateUpdateUserReqDto();

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(mockUser, 'save').mockResolvedValue(mockUser);

      const result = await userRepository.updateUser('test-uuid', mockUserCreateUpdateUserReqDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { uuid: 'test-uuid' } });
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw an InternalServerErrorException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const mockUserCreateUpdateUserReqDto = new UserCreateUpdateUserReqDto()

      await expect(
        userRepository.updateUser('test-uuid', mockUserCreateUpdateUserReqDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});