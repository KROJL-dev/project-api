import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateUserDto) {
    return this.prisma.user.create({ data })
  }

  findAll() {
    return this.prisma.user.findMany()
  }

  findOneById(id: number) {
    return this.prisma.user.findUnique({ where: { id } })
  }

  findOne(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  update(id: number, data: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data })
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } })
  }
}
