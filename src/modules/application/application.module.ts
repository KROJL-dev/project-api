import { forwardRef, Module } from '@nestjs/common'
import { ApplicationService } from './application.service'
import { ApplicationController } from './application.controller'
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
