import { IsString, IsNotEmpty, IsUUID, IsOptional, MaxLength } from 'class-validator';

export class CreateCourseDto {
  @IsUUID()
  @IsNotEmpty()
  instructorId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;
}
