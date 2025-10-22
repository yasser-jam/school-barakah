import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional, IsEnum, MinLength } from 'class-validator';
import { EducationLevel, Gender } from '../../../generated/prisma';

export class CreateManagerDto {
  @ApiProperty({
    description: 'Manager first name',
    example: 'Jane',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Manager last name',
    example: 'Smith',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Manager email address',
    example: 'jane.smith@school.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Manager password',
    example: 'SecurePassword123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

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
    description: 'Notes about the manager',
    example: 'Experienced administrator',
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
    example: EducationLevel.MASTERS,
  })
  @IsOptional()
  @IsEnum(EducationLevel)
  educationLevel?: EducationLevel;

  @ApiPropertyOptional({
    description: 'University degree (if applicable)',
    example: 'Master of Education Administration',
  })
  @IsOptional()
  @IsString()
  universityDegree?: string;

  @ApiPropertyOptional({
    description: 'Years of experience',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;

  @ApiPropertyOptional({
    description: 'Is manager active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Gender',
    enum: Gender,
    example: Gender.FEMALE,
  })
  @IsEnum(Gender)
  gender: Gender;
}

