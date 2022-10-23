import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { UsersErrors, UsersService } from './users.service';
import { CreateUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

class UserNameUniquenessException extends HttpException {
  constructor(userName) {
    super(
      `User with username '${userName}' already exist`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

class UserInvalidObjectIdException extends HttpException {
  constructor(id) {
    super(`User id : ${id} is invalid`, HttpStatus.BAD_REQUEST);
  }
}

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Creates User
   * @param createUserDto Request Body to create user
   * @returns created user
   */
  @Post()
  async create(@Body() createUserDto: CreateUser): Promise<User> {
    this.logger.log('Creating User');

    // hash password
    const hashRounds: number = Number.parseInt(
      this.configService.get<string>('HASH_ROUNDS'),
    );
    if (Number.isNaN(hashRounds)) {
      this.logger.error('Invalid value for HashRounds : NaN');
      throw new InternalServerErrorException();
    }

    this.logger.debug(`Hashing password using hashRounds : ${hashRounds}`);
    const password = createUserDto.password;

    try {
      createUserDto.password = await bcrypt.hash(password, hashRounds);
    } catch (error) {
      this.logger.error('Failed to hash the password', error);
      throw new InternalServerErrorException();
    }

    let createdUser = null;
    try {
      createdUser = await this.usersService.create(createUserDto);
    } catch (error) {
      this.logger.error('Failed to create user', error);
      if (error.message === UsersErrors.userNameUniquenessError) {
        throw new UserNameUniquenessException(createUserDto.userName);
      } else {
        throw error;
      }
    }

    this.logger.debug(`User created with id : ${createdUser.id}`);
    return new User(createdUser);
  }

  /**
   * Fetches list of series
   * @returns list of series
   */
  @Get()
  async findAll(): Promise<User[]> {
    this.logger.log('Fetching users');
    const usersList = await this.usersService.findAll();
    this.logger.debug(`Fetched ${usersList.length} users`);
    return usersList.map((users) => new User(users));
  }

  /**
   * Fetches User specified by Id
   * @param id of the User to be fetched
   * @returns User for the spcified id
   */
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Id of the user to be fetched',
    example: '62ed1c0022738d3d35b23712',
  })
  async findOne(@Param('id') id: string): Promise<User> {
    this.logger.debug(`Fetching user with id : ${id}`);

    let user;

    try {
      user = await this.usersService.findOne(id);
    } catch (error) {
      this.logger.error(`Failed  to fetch user with id : ${id}`);
      switch (error.message) {
        case UsersErrors.InvalidObjectId:
          throw new UserInvalidObjectIdException(id);
        default:
          throw error;
      }
    }

    // check if user exist

    if (user) {
      this.logger.debug(`Fetched user with id : ${id}`);
      return new User(user);
    } else {
      throw new NotFoundException();
    }
  }

  /**
   * Updates properties of a User
   * @param id Id of the user to be updated
   * @param updateUserDto Body of the request
   * @returns updated user
   */
  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'Id of the user to be updated',
    example: '62ed1c0022738d3d35b23712',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    this.logger.debug(`Updating user with id : ${id}`);

    let updatedUser;
    try {
      updatedUser = await this.usersService.update(id, updateUserDto);
    } catch (error) {
      this.logger.error(`Failed to update user with id : ${id}`);
      this.logger.error('Due to error : ', error);
      switch (error.message) {
        case UsersErrors.NotFound:
          throw new NotFoundException();
        case UsersErrors.InvalidObjectId:
          throw new UserInvalidObjectIdException(id);
        default:
          throw error;
      }
    }

    this.logger.debug(`updated user with id : ${id}`);
    return new User(updatedUser);
  }

  /**
   * Deletes a user
   * @param id Id of the user to be deleted
   * @returns deleted user
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.debug(`Deleting user with id : ${id}`);

    let deletedUser;

    try {
      deletedUser = await this.usersService.remove(id);
    } catch (error) {
      this.logger.error(`Failed to delete user with id : ${id}`);
      switch (error.message) {
        case UsersErrors.InvalidObjectId:
          throw new UserInvalidObjectIdException(id);
        default:
          throw error;
      }
    }

    if (deletedUser) {
      this.logger.debug(`Delete user with id : ${id}`);
    } else {
      this.logger.error(`User with id : ${id} do not exists`);
      throw new NotFoundException();
    }
  }
}
