import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateBusDto {
  @ApiProperty({
    description: 'Driver name',
    example: 'John Smith',
  })
  @IsNotEmpty()
  @IsString()
  driverName: string;

  @ApiProperty({
    description: 'Car number',
    example: 'ABC-123',
  })
  @IsNotEmpty()
  @IsString()
  carNumber: string;

  @ApiProperty({
    description: 'Car model',
    example: 'Toyota Hiace',
  })
  @IsNotEmpty()
  @IsString()
  carModel: string;

  @ApiProperty({
    description: 'Start time',
    example: '07:00',
  })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiPropertyOptional({
    description: 'Start longitude',
    example: -74.006,
  })
  @IsOptional()
  @IsNumber()
  startLng?: number;

  @ApiPropertyOptional({
    description: 'Start latitude',
    example: 40.7128,
  })
  @IsOptional()
  @IsNumber()
  startLat?: number;

  @ApiProperty({
    description: 'Student IDs',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  studentIds: number[];
}

