import { forwardRef, Module } from '@nestjs/common'
import { MeetingService } from './meeting.service'
import { MeetingController } from './meeting.controller'
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [MeetingController],
  providers: [MeetingService],
  exports: [MeetingService],
})
export class ApplicationModule {}
