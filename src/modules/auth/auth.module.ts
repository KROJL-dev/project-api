import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

import { JwtAtStrategy, JwtRtStrategy, LocalStrategy } from './strategy'

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UserModule), // 👈 если потенциально есть циклическая зависимость
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
        algorithm: 'HS384',
      },
      verifyOptions: {
        algorithms: ['HS384'],
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtRtStrategy, JwtAtStrategy, LocalStrategy],
  // ❌ exports: [UserModule], — убрать
})
export class AuthModule {}
