import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'

import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from 'src/modules/user/user.module' // Путь к UserModule
import { AuthModule } from './modules/auth/auth.module'

import { APP_GUARD } from '@nestjs/core'
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    PrismaModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
