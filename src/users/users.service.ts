import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users, UsersDocument } from './schemas/users.schema';

export enum UsersErrors {
  userNameUniquenessError = 'USERNAME_UNIQUENESS_ERROR',
  InvalidObjectId = 'INVALID_OBJECT_ID',
  NotFound = 'NOT_FOUND',
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
  ) {}

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
    return this.usersModel.findByIdAndDelete(id);
  }
}
