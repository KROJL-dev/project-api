import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateApplicationDto } from './dto/create-application-dto'
import { ApplicationStatus } from '@prisma/client'
import { UpdateApplication } from './dto/patch-order-application-dto'

@Injectable()
export class ApplicationService {
  constructor(private prismaService: PrismaService) {}

  findAll(userId: number) {
    return this.prismaService.application.findMany({
      where: { userId: Number(userId) },
      include: {
        meeting: true,
      },
    })
  }

  getAllStatuses() {
    return Object.values(ApplicationStatus)
  }

  create(application: CreateApplicationDto) {
    return this.prismaService.application.create({
      data: { ...application, userId: Number(application.userId) },
    })
  }

  patch(id: string, data: UpdateApplication) {
    return this.prismaService.application.update({ where: { id: Number(id) }, data })
  }
}
