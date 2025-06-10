import { IsISO8601, IsString } from 'class-validator'

export class AddMeetingDto {
  @IsString()
  link?: string
  @IsString()
  title?: string
  @IsString()
  @IsISO8601()
  time?: string
}
