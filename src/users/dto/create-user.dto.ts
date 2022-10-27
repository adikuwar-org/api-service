import { IsNotEmpty, IsString } from 'class-validator';
import { Roles } from '../schemas/users.schema';

export class CreateUser {
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

  /**
   * First Name of the user
   * @example John
   */
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  /**
   * Last Name of the user
   * @example Smith
   */

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  /**
   * Role of the User
   */
  @IsNotEmpty()
  readonly role: Roles;
}
