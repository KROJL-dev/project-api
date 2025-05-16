import { BadRequestException, Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'

import { AuthGuard } from '@nestjs/passport'
import { RegisterRequestDto } from './dtos/register-request.dto'
import { LoginResponseDTO } from './dtos/login-response.dto'
import { RegisterResponseDTO } from './dtos/register-response.dto'
import { Public } from './decorators/public.decorators'

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<LoginResponseDTO | BadRequestException> {
    console.log('req', req.body)
    return this.authService.login(req.body)
  }

  @Post('register')
  async register(
    @Body() registerBody: RegisterRequestDto
  ): Promise<RegisterResponseDTO | BadRequestException> {
    return await this.authService.register(registerBody)
  }
}
