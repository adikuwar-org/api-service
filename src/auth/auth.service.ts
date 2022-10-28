import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userName: string, password: string): Promise<any> {
    const user = await this.userService.findOneWithUserName(userName);

    if (user) {
      this.logger.verbose(`Validating user : ${userName}`);
      const validPassword = await bcrypt.compareSync(password, user.password);
      if (validPassword) {
        return new User(user);
      }
      this.logger.error(`Password of user : ${userName} does not match`);
    } else {
      this.logger.error(`Failed to validate user : ${userName}`);
      this.logger.error(`Failed to find user with userName : ${userName}`);
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      username: user.userName,
      sub: user.id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
