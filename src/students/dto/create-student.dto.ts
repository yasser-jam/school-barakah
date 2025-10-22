import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { Gender } from '../../../generated/prisma';

export class CreateStudentDto {
  @ApiProperty({
    description: 'Student first name',
    example: 'Alice',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Student last name',
    example: 'Johnson',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    description: 'Date of birth',
    example: '2010-05-15',
  })
  @IsOptional()
  bod?: Date;

  @ApiPropertyOptional({
    description: 'Notes about the student',
    example: 'Excellent student, needs extra attention in math',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Longitude coordinate',
    example: -74.006,
  })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional({
    description: 'Latitude coordinate',
    example: 40.7128,
  })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({
    description: 'Image URL',
    example: 'https://example.com/student-image.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'Gender',
    enum: Gender,
    example: Gender.FEMALE,
  })
  @IsEnum(Gender)
  gender: Gender;
}

