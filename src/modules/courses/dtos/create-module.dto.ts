import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;
}
