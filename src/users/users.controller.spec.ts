import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUser } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersErrors, UsersService } from './users.service';
import * as _ from 'lodash';
import mongoose from 'mongoose';

describe('UsersController', () => {
  let controller: UsersController;
  let hashRounds;
  const existingUsers = [
    {
      firstName: 'firstName1',
      lastName: 'lastName1',
      userName: 'userName1',
      password: 'password1',
      _id: '62ee91648e835835481d53fa',
    },
    {
      firstName: 'firstName2',
      lastName: 'lastName2',
      userName: 'userName2',
      password: 'password2',
      _id: '62ee91648e835835481d53fb',
    },
    {
      firstName: 'firstName3',
      lastName: 'lastName3',
      userName: 'userName3',
      password: 'password3',
      _id: '62ee91648e835835481d53fc',
    },
  ];

  beforeEach(async () => {
    hashRounds = 10;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockImplementation((user: CreateUser) => {
              const existingUser = _.find(existingUsers, (existingUser) => {
                if (user.userName === existingUser.userName) {
                  return existingUser;
                }
              });

              if (existingUser) {
                throw new Error(UsersErrors.userNameUniquenessError);
              }
              return Promise.resolve({
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                password: user.password,
                _id: '62ee91648e835835481d53fd',
                id: '62ee91648e835835481d53fd',
              });
            }),
            findAll: jest.fn().mockResolvedValue(_.cloneDeep(existingUsers)),
            findOne: jest.fn().mockImplementation((id: string) => {
              if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error(UsersErrors.InvalidObjectId);
              }

              const index = existingUsers.findIndex((user) => user._id === id);

              if (index < 0) {
                return Promise.resolve(null);
              } else {
                return Promise.resolve(existingUsers[index]);
              }
            }),
            update: jest.fn().mockImplementation((id: string, update: any) => {
              if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error(UsersErrors.InvalidObjectId);
              }

              const index = existingUsers.findIndex((user) => user._id === id);

              if (index < 0) {
                throw new Error(UsersErrors.NotFound);
              } else {
                return Promise.resolve(
                  _.assign(_.cloneDeep(existingUsers[index]), update),
                );
              }
            }),
            remove: jest.fn().mockImplementation((id: string) => {
              if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error(UsersErrors.InvalidObjectId);
              }

              const index = existingUsers.findIndex((user) => user._id === id);

              if (index < 0) {
                return Promise.resolve(null);
              } else {
                return Promise.resolve(existingUsers[index]);
              }
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              if (key === 'HASH_ROUNDS') {
                return hashRounds;
              }
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('UsersController.create', () => {
    it('should create user', async () => {
      const createdUser: User = await controller.create({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        password: 'password',
      });

      const expectedUser: User = {
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        id: '62ee91648e835835481d53fd',
      };

      expect(createdUser).toEqual(expectedUser);
    });

    it('should return error if hashRounds is not configured', async () => {
      hashRounds = null;
      expect(
        controller.create({
          firstName: 'firstName',
          lastName: 'lastName',
          userName: 'userName',
          password: 'password',
        }),
      ).rejects.toThrow('Internal Server Error');
    });

    it('should return error', async () => {
      hashRounds = 'invalid_value';
      expect(
        controller.create({
          firstName: 'firstName',
          lastName: 'lastName',
          userName: 'userName',
          password: 'password',
        }),
      ).rejects.toThrow('Internal Server Error');
    });

    it('should return errorif userName is not unique', async () => {
      return expect(
        controller.create({
          firstName: 'firstName1',
          lastName: 'lastName1',
          userName: 'userName1',
          password: 'password1',
        }),
      ).rejects.toThrow(`User with username 'userName1' already exist`);
    });
  });

  describe('UsersController.findAll', () => {
    it('should return all users', async () => {
      const users = await controller.findAll();
      const expectedUsers = [
        {
          firstName: 'firstName1',
          lastName: 'lastName1',
          userName: 'userName1',
          id: '62ee91648e835835481d53fa',
        },
        {
          firstName: 'firstName2',
          lastName: 'lastName2',
          userName: 'userName2',
          id: '62ee91648e835835481d53fb',
        },
        {
          firstName: 'firstName3',
          lastName: 'lastName3',
          userName: 'userName3',
          id: '62ee91648e835835481d53fc',
        },
      ];
      expect(users).toEqual(expectedUsers);
    });
  });

  describe('UsersController.findOne', () => {
    it('should return user', async () => {
      const existingUser = existingUsers[0];
      const user = await controller.findOne(existingUser._id);
      const expectedUser = {
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        userName: existingUser.userName,
        id: existingUser._id,
      };
      expect(user).toEqual(expectedUser);
    });

    it('should return error when id is invalid', async () => {
      return expect(controller.findOne('invalid')).rejects.toThrow(
        'User id : invalid is invalid',
      );
    });

    it('should return error when user does not exist', async () => {
      return expect(
        controller.findOne('62ee91648e835835481d53fd'),
      ).rejects.toThrow('Not Found');
    });
  });

  describe('UsersController.update', () => {
    it('should update user', async () => {
      const existingUser = existingUsers[0];
      const updatedUser = await controller.update(existingUser._id, {
        firstName: 'firstNameUpdated',
      });

      const expectedUser: User = {
        firstName: 'firstNameUpdated',
        lastName: existingUser.lastName,
        userName: existingUser.userName,
        id: existingUser._id,
      };

      expect(updatedUser).toEqual(expectedUser);
    });

    it('should throw error if user not found', async () => {
      return expect(
        controller.update('62ee91648e835835481d53fd', {
          firstName: 'firstNameUpdated',
        }),
      ).rejects.toThrow('Not Found');
    });

    it('should throw error if id is invalid', async () => {
      return expect(
        controller.update('invalid', {
          firstName: 'firstNameUpdated',
        }),
      ).rejects.toThrow('User id : invalid is invalid');
    });
  });

  describe('UsersController.remove', () => {
    it('should delete user', async () => {
      return expect(
        controller.remove(existingUsers[0]._id),
      ).resolves.toBeUndefined();
    });

    it('should throw error when id is invalid', async () => {
      return expect(controller.remove('invalid')).rejects.toThrow(
        'User id : invalid is invalid',
      );
    });

    it('should throw error when user is not found', async () => {
      return expect(
        controller.remove('62ee91648e835835481d53fd'),
      ).rejects.toThrow('Not Found');
    });
  });
});
