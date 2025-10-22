import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EducationLevel, Gender } from '../../../generated/prisma';

export class ManagerResponseDto {
  @ApiProperty({ description: 'Manager ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'First name', example: 'Jane' })
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Smith' })
  lastName: string;

  @ApiProperty({ description: 'Email address', example: 'jane.smith@school.com' })
  email: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+1234567890' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Image URL', example: 'https://example.com/image.jpg' })
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Notes', example: 'Experienced administrator' })
  notes?: string;

  @ApiPropertyOptional({ description: 'Date of birth', example: '1985-01-01' })
  bod?: Date;

  @ApiPropertyOptional({ description: 'Education level', enum: EducationLevel })
  educationLevel?: EducationLevel;

  @ApiPropertyOptional({ description: 'University degree', example: 'Master of Education Administration' })
  universityDegree?: string;

  @ApiPropertyOptional({ description: 'Years of experience', example: 10 })
  yearsOfExperience?: number;

  @ApiProperty({ description: 'Is active', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Gender', enum: Gender })
  gender: Gender;

  @ApiProperty({ description: 'Organization ID', example: 1 })
  organizationId: number;

  @ApiProperty({ description: 'Created at', example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

