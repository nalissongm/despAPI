import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
