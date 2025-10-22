import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateSessionPaymentDto {
  @ApiProperty({
    description: 'Payment amount',
    example: 50.0,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Teacher ID',
    example: 1,
  })
  @IsNumber()
  teacherId: number;
}

