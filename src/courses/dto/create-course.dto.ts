import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsArray, IsDateString, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Course title',
    example: 'Advanced Mathematics',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Start date',
    example: '2024-01-15',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date',
    example: '2024-06-15',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Course days',
    example: ['Monday', 'Wednesday', 'Friday'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  days: string[];

  @ApiProperty({
    description: 'Start time',
    example: '09:00',
  })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty({
    description: 'End time',
    example: '11:00',
  })
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @ApiProperty({
    description: 'Teacher ID',
    example: 1,
  })
  @IsNumber()
  teacherId: number;

  @ApiProperty({
    description: 'Classroom ID',
    example: 1,
  })
  @IsNumber()
  classRoomId: number;

  @ApiProperty({
    description: 'Student IDs',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  studentIds: number[];
}

