import { IsEmail, IsNotEmpty } from 'class-validator'

export class UpdateUserDto {
  @IsNotEmpty()
  name: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  password: string
}
