import { IsNotEmpty, IsString, IsOptional, IsDateString, Length } from 'class-validator';

export class CompleteProfileDto {
  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  cpf: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
