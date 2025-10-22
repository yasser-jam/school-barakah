import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EducationLevel, Gender } from '../../../generated/prisma';

export class TeacherResponseDto {
  @ApiProperty({ description: 'Teacher ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'First name', example: 'John' })
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  lastName: string;

  @ApiProperty({ description: 'Email address', example: 'john.doe@school.com' })
  email: string;

  @ApiProperty({ description: 'Salary per session', example: 50.0 })
  salaryPerSession: number;

  @ApiPropertyOptional({ description: 'Phone number', example: '+1234567890' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Image URL', example: 'https://example.com/image.jpg' })
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Notes', example: 'Excellent teaching skills' })
  notes?: string;

  @ApiPropertyOptional({ description: 'Date of birth', example: '1990-01-01' })
  bod?: Date;

  @ApiPropertyOptional({ description: 'Education level', enum: EducationLevel })
  educationLevel?: EducationLevel;

  @ApiPropertyOptional({ description: 'University degree', example: 'Bachelor of Science in Mathematics' })
  universityDegree?: string;

  @ApiPropertyOptional({ description: 'Years of experience', example: 5 })
  yearsOfExperience?: number;

  @ApiProperty({ description: 'Is active', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Gender', enum: Gender })
  gender: Gender;

  @ApiProperty({ description: 'Sessions count in month', example: 20 })
  sessionsCountInMonth: number;

  @ApiProperty({ description: 'Organization ID', example: 1 })
  organizationId: number;

  @ApiProperty({ description: 'Subject ID', example: 1 })
  subjectId: number;

  @ApiProperty({ description: 'Created at', example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Subject information' })
  subject?: {
    id: number;
    name: string;
  };
}

