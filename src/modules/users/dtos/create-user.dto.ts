import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsDateString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  @Length(11, 11, { message: 'CPF must be exactly 11 characters' })
  cpf?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
