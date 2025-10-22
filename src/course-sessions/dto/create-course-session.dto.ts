import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateCourseSessionDto {
  @ApiProperty({
    description: 'Session title',
    example: 'Introduction to Algebra',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Duration in minutes',
    example: 90,
  })
  @IsNumber()
  @IsPositive()
  duration: number;

  @ApiProperty({
    description: 'Course ID',
    example: 1,
  })
  @IsNumber()
  courseId: number;
}

