import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUser } from './create-user.dto';

export class UpdateUserDto {
  /**
   * Username of the user
   * @example jsmith
   */
  @IsNotEmpty()
  @IsString()
  readonly userName: string;

  /**
   * Password of the user
   */
  @IsNotEmpty()
  @IsString()
  password: string;

  hashRounds: number;

  /**
   * First Name of the User
   * @example John
   */
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  /**
   * Last Name of the User
   * @example Smith
   */
}
