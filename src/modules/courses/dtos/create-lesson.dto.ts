import { IsString, IsNotEmpty, IsOptional, IsEnum, MaxLength } from 'class-validator';

export enum LessonContentType {
  VIDEO = 'video',
  TEXT = 'text',
}

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(LessonContentType)
  @IsNotEmpty()
  contentType: LessonContentType;
}
