import { IsString, IsOptional, IsEnum, IsInt, IsUrl, Matches } from 'class-validator'
import { ApplicationStatus } from '@prisma/client'
import { Transform } from 'class-transformer'

export class UpdateApplication {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : value))
  company: string

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : value))
  position: string

  @IsEnum(ApplicationStatus)
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : value))
  status?: ApplicationStatus

  @IsOptional()
  @IsUrl()
  @Transform(({ value }) => (value === undefined ? undefined : value))
  link?: string

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === undefined ? undefined : value))
  notes?: string

  @IsOptional()

  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  order: number

  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, { message: 'userId must be a string containing a number' })
  @Transform(({ value }) => (value === undefined ? undefined : value))
  userId: number
}
