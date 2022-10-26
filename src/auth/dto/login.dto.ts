import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  /**
   * Username
   * @example jsmith
   */
  @IsNotEmpty()
  @IsString()
  readonly userName: string;

  /**
   * Password
   */
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
