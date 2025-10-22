import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '../../../generated/prisma';

export class StudentResponseDto {
  @ApiProperty({ description: 'Student ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'First name', example: 'Alice' })
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Johnson' })
  lastName: string;

  @ApiPropertyOptional({ description: 'Date of birth', example: '2010-05-15' })
  bod?: Date;

  @ApiPropertyOptional({ description: 'Notes', example: 'Excellent student, needs extra attention in math' })
  notes?: string;

  @ApiPropertyOptional({ description: 'Longitude coordinate', example: -74.006 })
  lng?: number;

  @ApiPropertyOptional({ description: 'Latitude coordinate', example: 40.7128 })
  lat?: number;

  @ApiPropertyOptional({ description: 'Image URL', example: 'https://example.com/student-image.jpg' })
  imageUrl?: string;

  @ApiProperty({ description: 'Gender', enum: Gender })
  gender: Gender;

  @ApiProperty({ description: 'Organization ID', example: 1 })
  organizationId: number;

  @ApiProperty({ description: 'Created at', example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

