import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserCreateUpdateUserReqDto } from './dto/user.create-update-user-req.dto';
import { UserCreateUpdateUserResDto } from './dto/user.creat-update-user-res.dto';
import { UserGetUserResDto } from './dto/user.get-user-res.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const mockUserService = {
      getUser: jest.fn(),
      updateUser: jest.fn(),
      createUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(
      UserService,
    ) as jest.Mocked<UserService>;
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('getUser', () => {
    it('should return user details', async () => {
      const mockUser: UserGetUserResDto = {
        userUuid: 'test-uuid',
        id: 'test-id',
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        createdTime: new Date(),
      };

      userService.getUser.mockResolvedValue(mockUser);

      const result = await userController.getUser('test-uuid');

      expect(userService.getUser).toHaveBeenCalledWith('test-uuid');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update and return user details', async () => {
      const mockRequestDto: UserCreateUpdateUserReqDto = {
        id: 'updated-id',
        pw: 'updated-password',
        name: 'Updated User',
        email: 'updated@example.com',
        phone: '9876543210',
      };

      const mockResponse: UserCreateUpdateUserResDto = {
        userUuid: 'test-uuid',
      };

      userService.updateUser.mockResolvedValue(mockResponse);

      const result = await userController.updateUser(
        'test-uuid',
        mockRequestDto,
      );

      expect(userService.updateUser).toHaveBeenCalledWith(
        'test-uuid',
        mockRequestDto,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createUser', () => {
    it('should create a user and return the user UUID', async () => {
      const mockRequestDto: UserCreateUpdateUserReqDto = {
        id: 'test-id',
        pw: 'test-password',
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
      };

      const mockResponse: UserCreateUpdateUserResDto = {
        userUuid: 'test-uuid',
      };

      userService.createUser.mockResolvedValue(mockResponse);

      const result = await userController.createUser(mockRequestDto);

      expect(userService.createUser).toHaveBeenCalledWith(mockRequestDto);
      expect(result).toEqual(mockResponse);
    });
  });
});
