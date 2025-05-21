import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

import { JwtAtStrategy, JwtRtStrategy, LocalStrategy } from './strategy'

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        signOptions: {
          expiresIn: '1h',
          algorithm: 'HS384',
        },
        verifyOptions: {
          algorithms: ['HS384'],
        },
        ...config,
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtRtStrategy, JwtAtStrategy, LocalStrategy],
})
export class AuthModule {}
