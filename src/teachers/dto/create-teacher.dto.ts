import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional, IsEnum, MinLength } from 'class-validator';
import { EducationLevel, Gender } from '../../../generated/prisma';

export class CreateTeacherDto {
  @ApiProperty({
    description: 'Teacher first name',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Teacher last name',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Teacher email address',
    example: 'john.doe@school.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Teacher password',
    example: 'SecurePassword123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Salary per session',
    example: 50.0,
  })
  @IsNumber()
  salaryPerSession: number;

  @ApiProperty({
    description: 'Subject ID',
    example: 1,
  })
  @IsNumber()
  subjectId: number;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Image URL',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Notes about the teacher',
    example: 'Excellent teaching skills',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Date of birth',
    example: '1990-04-01T16:48:00.531Z',
  })
  @IsOptional()
  bod?: Date;

  @ApiPropertyOptional({
    description: 'Education level',
    enum: EducationLevel,
    example: EducationLevel.UNIVERSITY,
  })
  @IsOptional()
  @IsEnum(EducationLevel)
  educationLevel?: EducationLevel;

  @ApiPropertyOptional({
    description: 'University degree (if applicable)',
    example: 'Bachelor of Science in Mathematics',
  })
  @IsOptional()
  @IsString()
  universityDegree?: string;

  @ApiPropertyOptional({
    description: 'Years of experience',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;

  @ApiPropertyOptional({
    description: 'Is teacher active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Gender',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsEnum(Gender)
  gender: Gender;
}

