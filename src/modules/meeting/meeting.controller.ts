import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'

import { MeetingService } from './meeting.service'

import { AddMeetingDto } from './dto/add-meeting-dto'

@Controller('meetings')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Get(':meetingLink')
  getMeetingByLink(@Param('meetingLink') meetingLink: string) {
    return this.meetingService.getMeetingByLink(meetingLink)
  }

  @Post(':applicationId/meeting')
  addMeeting(@Param('applicationId') applicationId: string, @Body() meeting: AddMeetingDto) {
    return this.meetingService.addMeeting(applicationId, meeting)
  }
}
