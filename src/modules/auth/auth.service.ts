import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import { PrismaService } from 'src/prisma/prisma.service'

import * as bcrypt from 'bcrypt'
import { AccessToken } from './types/AccessToken'

import { UserService } from 'src/modules/user/user.service'
import { RegisterRequestDto } from './dtos/register-request.dto'

import { User } from '@prisma/client'

@Injectable({})
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private usersService: UserService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private configService: ConfigService
  ) {}

  async logout(userId: number) {
    await this.prismaService.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    })
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email)
    if (!user) {
      throw new BadRequestException('User not found')
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
      throw new BadRequestException('Password does not match')
    }
    return user
  }

  async updateRtHash(userId: number, rt: string) {
    const argon2 = require('argon2')
    const hash = await argon2.hash(rt)

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    })
  }

  async login(user: Pick<User, 'email' | 'password'>): Promise<AccessToken> {
    const { email } = user

    const existingUser = await this.usersService.findOne(email)
    if (!existingUser) {
      throw new UnauthorizedException('incorrect email')
    }

    return this.signToken(existingUser?.id, email)
  }

  async register(user: RegisterRequestDto): Promise<AccessToken> {
    const existingUser = await this.usersService.findOne(user.email)

    if (existingUser) {
      throw new BadRequestException('email already exists')
    }

    if (!user.password) {
      throw new BadRequestException('email already exists')
    }
    const hashedPassword = await bcrypt.hash(user.password, 10)
    const newUser = { ...user, password: hashedPassword }
    await this.usersService.create(newUser)
    return this.login(newUser)
  }

  async signToken(userId: number, email: string): Promise<AccessToken> {
    const payLoad = {
      id: userId,
      email,
    }
    const at_secret = this.configService.get<string>('JWT_AT_SECRET')
    const rt_secret = this.configService.get<string>('JWT_RT_SECRET')

    const at_token = await this.jwtService.signAsync(payLoad, {
      expiresIn: '1d',
      secret: at_secret,
    })

    const rt_token = await this.jwtService.signAsync(payLoad, {
      expiresIn: '7d',
      secret: rt_secret,
    })

    return {
      accessToken: at_token,
      refreshToken: rt_token,
    }
  }
}
