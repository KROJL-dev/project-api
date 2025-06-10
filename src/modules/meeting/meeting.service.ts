import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

import { AddMeetingDto } from './dto/add-meeting-dto'

@Injectable()
export class MeetingService {
  constructor(private prismaService: PrismaService) {}

  async getMeetingByLink(meetingLink: string) {
    return this.prismaService.meeting.findFirst({
      where: { link: meetingLink },
      include: { application: true },
    })
  }

  async addMeeting(applicationId: string, meeting: AddMeetingDto) {
    const application = await this.prismaService.application.findUnique({
      where: { id: Number(applicationId) },
    })
    const newMeeting = await this.prismaService.meeting.create({
      data: { ...meeting, status: application?.status, applicationId: Number(applicationId) },
    })
    return this.prismaService.application.update({
      where: { id: Number(applicationId) },
      data: { meeting: { connect: { id: newMeeting.id } } },
    })
  }
}
