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
import { Tokens } from './types/Tokens'

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
    const { email, password } = user

    const existingUser = await this.usersService.findOne(email)
    if (!existingUser) {
      throw new UnauthorizedException('incorrect email')
    }
    console.log('existingUser', existingUser)
    // return { access_token: '', refresh_token: '' }
    return this.signToken(existingUser?.id, password)
  }

  async register(user: RegisterRequestDto): Promise<AccessToken> {
    console.log('user', user)
    const existingUser = await this.usersService.findOne(user.email)

    console.log('existingUser', existingUser)
    console.log('bcrypt', bcrypt)
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

  async signToken(userId: number, email: string): Promise<Tokens> {
    const payLoad = {
      sub: userId,
      email,
    }
    const at_secret = this.configService.get<string>('JWT_AT_SECRET')
    const rt_secret = this.configService.get<string>('JWT_RT_SECRET')

    const at_token = await this.jwtService.signAsync(payLoad, {
      expiresIn: '15min',
      secret: at_secret,
    })

    const rt_token = await this.jwtService.signAsync(payLoad, {
      expiresIn: '7d',
      secret: rt_secret,
    })

    return {
      access_token: at_token,
      refresh_token: rt_token,
    }
  }
}
