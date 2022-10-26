import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import * as _ from 'lodash';

describe('AuthService', () => {
  let service: AuthService;
  const existingUser = {
    firstName: 'firstName',
    lastName: 'lastName',
    userName: 'userName',
    password: '$2b$10$mtazwWiosirW6Y.O.LeCF.hjnl4fcKbA6/aeIn4anMED4XtYsy.AG',
    _id: '62ee91648e835835481d53fa',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOneWithUserName: jest
              .fn()
              .mockImplementation((userName: string) => {
                if (userName === 'userName') {
                  return _.cloneDeep(existingUser);
                } else {
                  return null;
                }
              }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('access_token'),
          },
        },
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('AuthService.validateUser', () => {
    it('should validate user', async () => {
      const user = await service.validateUser('userName', 'password');
      const expectedUser = {
        id: existingUser._id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        userName: existingUser.userName,
      };
      expect(user).toEqual(expectedUser);
    });

    it('should not return user is userName does not exist', async () => {
      const user = await service.validateUser('NotExistingUser', 'password');
      expect(user).toBeNull();
    });

    it('should not return user if password does not match', async () => {
      const user = await service.validateUser('userName', 'incorrect_password');
      expect(user).toBeNull();
    });
  });

  describe('AuthService.login', () => {
    it('should return access_token', async () => {
      const user = {
        id: existingUser._id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        userName: existingUser.userName,
      };
      const response = await service.login(user);
      expect(response).toEqual({
        access_token: 'access_token',
      });
    });
  });
});
