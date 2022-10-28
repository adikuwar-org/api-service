import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Roles } from '../schemas/users.schema';

export class UpdateUserDto {
  /**
   * Password of the user
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  /**
   * First Name of the User
   * @example John
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly firstName?: string;

  /**
   * Last Name of the User
   * @example Smith
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly lastName?: string;

  /**
   * Role of the User
   */
  @IsNotEmpty()
  @IsOptional()
  readonly role?: Roles;
}
