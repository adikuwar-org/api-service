import { Request, Post, UseGuards, Controller } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginReponse } from './entities/login-response.entity';
import { SkipAuth } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authSerivce: AuthService) {}

  /**
   * Returns access_token for the user
   */
  @UseGuards(LocalAuthGuard)
  @SkipAuth()
  @ApiBody({
    type: LoginDto,
  })
  @ApiResponse({
    type: LoginReponse,
  })
  @Post('/login')
  async login(@Request() req) {
    return this.authSerivce.login(req.user);
  }
}
