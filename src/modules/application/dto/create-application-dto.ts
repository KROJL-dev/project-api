import { IsString, IsOptional, IsEnum, IsInt, IsUrl, Matches } from 'class-validator'
import { ApplicationStatus } from '@prisma/client'

export class CreateApplicationDto {
  @IsString()
  company: string

  @IsString()
  position: string

  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus

  @IsOptional()
  @IsUrl()
  link?: string

  @IsOptional()
  @IsString()
  notes?: string

  @IsString()
  @Matches(/^\d+$/, { message: 'userId must be a string containing a number' })
  userId: number
}
