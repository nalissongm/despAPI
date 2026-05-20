import { IsNotEmpty, IsString, IsOptional, IsUUID, IsJSON } from 'class-validator';

export class CreateInstructorProfileDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  specialty?: string;

  @IsJSON()
  @IsOptional()
  socialLinks?: any;

  @IsString()
  @IsOptional()
  crm?: string;

  @IsString()
  @IsOptional()
  crmUf?: string;
}
