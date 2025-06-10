import { Module } from '@nestjs/common'

import { ConfigModule } from '@nestjs/config'

import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from 'src/modules/user/user.module' // Путь к UserModule
import { AuthModule } from './modules/auth/auth.module'
import { SpeechModule } from './modules/speech/speech.module'

import { APP_GUARD } from '@nestjs/core'
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard'
import { ApplicationModule } from './modules/application/application.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    ApplicationModule,
    SpeechModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
