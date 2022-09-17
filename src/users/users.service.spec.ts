import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Users } from './schemas/users.schema';
import { UsersErrors, UsersService } from './users.service';
import * as _ from 'lodash';
import { ConfigService } from '@nestjs/config';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<Users>;
  let hashRounds;
  let adminUserName;
  let adminFirstName;
  let adminLastName;
  let adminPassword;

  const usersArray = [
    {
      firstName: 'firstName',
      lastName: 'lastName',
      userName: 'userName',
      password: 'hashedPassword',
      hashRounds: 10,
      _id: '62ee91648e835835481d53fa',
    },
    {
      firstName: 'firstName1',
      lastName: 'lastName1',
      userName: 'userName1',
      password: 'hashedPassword1',
      hashRounds: 10,
      _id: '62ee91648e835835481d53fb',
    },
    {
      firstName: 'firstName2',
      lastName: 'lastName2',
      userName: 'userName2',
      password: 'hashedPassword2',
      hashRounds: 10,
      _id: '62ee91648e835835481d53fc',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('Users'),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              switch (key) {
                case 'HASH_ROUNDS':
                  return hashRounds;
                case 'ADMIN_USERNAME':
                  return adminUserName;
                case 'ADMIN_FIRST_NAME':
                  return adminFirstName;
                case 'ADMIN_LAST_NAME':
                  return adminLastName;
                case 'ADMIN_PASSWORD':
                  return adminPassword;
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<Users>>(getModelToken('Users'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('UsersService.create', () => {
    beforeEach(() => {
      hashRounds = 10;
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should create user', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      jest.spyOn(model, 'create').mockImplementationOnce((user: any) => {
        user._id = 'id';
        return Promise.resolve(user);
      });
      const user = {
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        password: 'hashedPassword',
        hashRounds: 10,
      };

      const createdUser = await service.create(_.cloneDeep(user));

      const expectedUser = {
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        password: 'hashedPassword',
        hashRounds: 10,
        _id: 'id',
      };

      expect(createdUser).toEqual(expectedUser);
    });

    it('should return error if userName is not unique', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({
          firstName: 'firstName',
          lastName: 'lastName',
          userName: 'userName',
          password: 'hashedPassword',
          hasRounds: 10,
          _id: 'id',
        }),
      } as any);

      const user = {
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        password: 'hashedPassword',
        hashRounds: 10,
      };

      return expect(service.create(user)).rejects.toThrow(
        UsersErrors.userNameUniquenessError,
      );
    });
  });

  describe('UsersService.findAll', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return all users', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(_.cloneDeep(usersArray)),
      } as any);

      const users = await service.findAll();
      expect(users).toEqual(usersArray);
    });
  });

  describe('UsersService.findOne', () => {
    afterEach(() => jest.resetAllMocks());

    it('should return a user', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(_.cloneDeep(usersArray[0])),
      } as any);

      const actualUser = await service.findOne('62ee91648e835835481d53fa');

      expect(actualUser).toEqual(usersArray[0]);
    });

    it('should return error if id is invalid', async () => {
      expect(service.findOne('invalid')).rejects.toThrow(
        UsersErrors.InvalidObjectId,
      );
    });

    it('should update the user', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(_.cloneDeep(usersArray[0])),
      } as any);

      const expectedUser = _.cloneDeep(usersArray[0]);
      expectedUser.firstName = 'firstNameUpdated';
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(expectedUser),
      } as any);

      const update = {
        firstName: 'firstNameUpdated',
      };

      const updatedUser = await service.update(usersArray[0]._id, update);

      expect(updatedUser).toEqual(expectedUser);
    });

    it('should return error when id is invalid', async () => {
      const update = {
        firstName: 'firstNameUpdate',
      };

      expect(service.update('invalid', update)).rejects.toThrow(
        UsersErrors.InvalidObjectId,
      );
    });

    it('should return error when user does not exist', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const update = {
        firstName: 'firstNameUpdated',
      };

      expect(
        service.update('62ee91648e835835481d53fd', update),
      ).rejects.toThrow(UsersErrors.NotFound);
    });
  });

  describe('UsersService.remove', () => {
    afterEach(() => jest.restoreAllMocks());

    it('should delete user', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const deletedUser = await service.remove(usersArray[0]._id);
      expect(deletedUser).toBeNull();
    });

    it('should return error if id is invalid', async () => {
      expect(service.remove('invalid')).rejects.toThrow(
        UsersErrors.InvalidObjectId,
      );
    });
  });

  describe('UserService.onModuleInit', () => {
    beforeEach(() => {
      hashRounds = 10;
      adminUserName = 'Administrator';
      adminFirstName = 'admin';
      adminLastName = 'admin';
      adminPassword = 'password';
    });
    afterEach(() => jest.restoreAllMocks());

    it('should create initial admin user', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve({}));
      await service.onModuleInit();
      return expect(model.create).toHaveBeenCalled();
    });

    it('should throw error if admin userName is not configured', async () => {
      adminUserName = null;
      return expect(service.onModuleInit()).rejects.toThrow(
        'Administrator userName is not configured',
      );
    });

    it('should throw error if admin firstName is not configured', async () => {
      adminFirstName = null;
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      return expect(service.onModuleInit()).rejects.toThrow(
        'Administrator first name is not configured',
      );
    });

    it('should throw error if admin lastName is not configured', async () => {
      adminLastName = null;
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      return expect(service.onModuleInit()).rejects.toThrow(
        'Administrator last name is not configured',
      );
    });

    it('should throw error if admin password is not configured', async () => {
      adminPassword = null;
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      return expect(service.onModuleInit()).rejects.toThrow(
        'Administrator password is not configured',
      );
    });

    it('should not create admin user if already exists', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({}),
      } as any);
      await service.onModuleInit();
      expect(model.findOne).toBeCalled();
      expect(model.create).toBeCalledTimes(0);
    });

    it('should throw error when hashRounds is not a number', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      hashRounds = null;
      return expect(service.onModuleInit()).rejects.toThrow(
        'Invalid value for HashRounds : NaN',
      );
    });

    it('should throw error when failed to create admin user', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.reject(new Error('error')));
      return expect(service.onModuleInit()).rejects.toThrow('error');
    });
  });
});
