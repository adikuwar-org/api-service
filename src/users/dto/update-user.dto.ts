import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}
