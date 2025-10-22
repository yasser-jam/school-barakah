import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateClassRoomDto {
  @ApiProperty({
    description: 'Classroom title',
    example: 'Room 101',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Has projector',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  hasProjector?: boolean;
}

