import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles, Users, UsersDocument } from './schemas/users.schema';
import * as bcrypt from 'bcrypt';

export enum UsersErrors {
  userNameUniquenessError = 'USERNAME_UNIQUENESS_ERROR',
  InvalidObjectId = 'INVALID_OBJECT_ID',
  NotFound = 'NOT_FOUND',
}

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    // check Initial Administrator user is present or not

    const userName: string = this.configService.get<string>('ADMIN_USERNAME');

    if (!userName) {
      const userNameError = 'Administrator userName is not configured';
      this.logger.error(userNameError);
      throw new Error(userNameError);
    }

    this.logger.log('Checking Initial Administrator is present or not');
    const existingAdministrator = await this.usersModel
      .findOne({
        userName,
      })
      .exec();

    if (existingAdministrator) {
      this.logger.log('Initial Administrator user is present');
    } else {
      // create Initial Administrator user
      this.logger.log('Creating Initial Administrator user');

      const firstName: string =
        this.configService.get<string>('ADMIN_FIRST_NAME');

      if (!firstName) {
        const firstNameError = 'Administrator first name is not configured';
        this.logger.error(firstNameError);
        throw new Error(firstNameError);
      }

      const lastName: string =
        this.configService.get<string>('ADMIN_LAST_NAME');

      if (!lastName) {
        const lastNameError = 'Administrator last name is not configured';
        this.logger.error(lastNameError);
        throw new Error(lastNameError);
      }

      let password: string = this.configService.get<string>('ADMIN_PASSWORD');

      if (!password) {
        const passwordError = 'Administrator password is not configured';
        this.logger.error(passwordError);
        throw new Error(passwordError);
      }

      // hash password
      const hashRounds: number = Number.parseInt(
        this.configService.get<string>('HASH_ROUNDS'),
      );
      if (Number.isNaN(hashRounds)) {
        const invalidHashRoundError = 'Invalid value for HashRounds : NaN';
        this.logger.error(invalidHashRoundError);
        throw new Error(invalidHashRoundError);
      }

      this.logger.debug(`Hashing password using hashRounds : ${hashRounds}`);

      try {
        password = await bcrypt.hash(password, hashRounds);
      } catch (error) {
        this.logger.error('Failed to hash the password', error);
        throw error;
      }

      const userDto: CreateUser = {
        firstName,
        lastName,
        userName,
        password,
        role: Roles.Administrator,
      };

      await this.usersModel.create(userDto);
    }
  }

  private isValidObjectId(objectId: string): boolean {
    return mongoose.Types.ObjectId.isValid(objectId);
  }

  async create(createUserDto: CreateUser) {
    this.logger.log('Creating user');
    // Verify username uniqueness
    const userName: string = createUserDto.userName;
    this.logger.debug(
      `Verifying user with username : ${userName} do not exist`,
    );

    const existingUser = await this.usersModel
      .findOne({
        userName,
      })
      .exec();

    if (existingUser) {
      this.logger.error(`User with username : ${userName} already exist`);
      throw new Error(UsersErrors.userNameUniquenessError);
    } else {
      this.logger.debug(`Username : ${userName} is unique`);
    }

    // create user
    return this.usersModel.create(createUserDto);
  }

  async findAll(): Promise<UsersDocument[]> {
    this.logger.log(`Fetching users`);
    return this.usersModel.find().exec();
  }

  async findOne(id: string): Promise<UsersDocument> {
    this.logger.debug(`Validating user id : ${id} is valid`);
    if (this.isValidObjectId(id)) {
      this.logger.debug(`User id : ${id} is valid`);
    } else {
      this.logger.error(`User id ${id} is invalid`);
      throw new Error(UsersErrors.InvalidObjectId);
    }

    this.logger.debug(`Fetching user with id : ${id}`);
    return this.usersModel.findById(id).exec();
  }

  async findOneWithUserName(userName: string): Promise<UsersDocument> {
    this.logger.debug(`Fetching user with userName : ${userName}`);
    return this.usersModel
      .findOne({
        userName,
      })
      .exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UsersDocument> {
    this.logger.debug(`Updating user with id : ${id}`);

    // verify id is valid
    if (this.isValidObjectId(id)) {
      this.logger.debug(`User id : ${id} is valid`);
    } else {
      this.logger.error(`User id : ${id} is not valid`);
      throw new Error(UsersErrors.InvalidObjectId);
    }

    // verify user exists
    this.logger.debug(`Verifying user with id : ${id} exists`);

    const exsistingUser = await this.usersModel.findById(id).exec();

    if (exsistingUser) {
      this.logger.debug(`User with id : ${id} exists`);
    } else {
      this.logger.error(`User with id ${id} does not exists`);
      throw new Error(UsersErrors.NotFound);
    }

    this.logger.debug(`Updating user with id : ${id}`);

    return await this.usersModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
      })
      .exec();
  }

  async remove(id: string): Promise<UsersDocument> {
    // verify user id is valid
    if (this.isValidObjectId(id)) {
      this.logger.debug(`User id ${id} is valid`);
    } else {
      this.logger.error(`User id ${id} is invalid`);
      throw new Error(UsersErrors.InvalidObjectId);
    }

    this.logger.debug(`Removing user with id : ${id}`);
    return this.usersModel.findByIdAndDelete(id).exec();
  }
}
