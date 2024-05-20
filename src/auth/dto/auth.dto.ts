import { IsEmail, IsString, MinLength } from "class-validator"

export class LoginDto {
  @MinLength(3, {
    message: 'Неправильно указана почта'
  })
  @IsEmail()
  email: string;

  @IsString()
  password: string

}

export class RegisterDto {
  @MinLength(3, {
    message: 'Неправильно указана почта'
  })
  @IsEmail()
  email: string

  @IsString()
  username: string

  @MinLength(6, {
    message: 'Password cannot be less than 6 characters!'
  })
  @IsString()
  password: string

}