import { IsEmail, IsNotEmpty } from 'class-validator'

export class RegisterRequestDto {
  @IsNotEmpty()
  firstName: string
  @IsNotEmpty()
  lastName: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string
}
