import { Type } from 'class-transformer';
import { IsDateString, IsOptional, IsString, isString } from 'class-validator';

export class CreateTodoDTO {
  @IsString()
  title: string;
  @IsOptional()
  @IsDateString()
  dueDate?: string;
  assignedTo?: string;
}
