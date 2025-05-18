import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateApplicationDto } from './dto/create-application-dto'
import { ApplicationStatus } from '@prisma/client'

@Injectable()
export class ApplicationService {
  constructor(private prismaService: PrismaService) {}

  findAll(userId: number) {
    console.log('userId', userId)
    return this.prismaService.application.findMany({ where: { userId: Number(userId) } })
  }

  getAllStatuses() {
    return Object.values(ApplicationStatus)
  }

  create(application: CreateApplicationDto) {
    return this.prismaService.application.create({
      data: { ...application, userId: Number(application.userId) },
    })
  }
}
