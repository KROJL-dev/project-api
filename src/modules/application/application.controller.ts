import { Body, Controller, Get, Param, Post } from '@nestjs/common'

import { ApplicationService } from './application.service'
import { CreateApplicationDto } from './dto/create-application-dto'
import { JWTUser } from '../auth/decorators/get-user.decorators'
import { User } from '@prisma/client'

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get('/statuses')
  getAllStatuses() {
    return this.applicationService.getAllStatuses()
  }

  @Get()
  findAll(@JWTUser() user: User) {
    return this.applicationService.findAll(user.id)
  }

  @Post()
  createApplication(@Body() application: Omit<CreateApplicationDto, 'id'>, @JWTUser() user: User) {
    return this.applicationService.create({ ...application, userId: user.id })
  }
}
