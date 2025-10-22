import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { AttendanceType } from '../../../generated/prisma';

export class CreateAttendanceDto {
  @ApiProperty({
    description: 'Student ID',
    example: 1,
  })
  @IsNumber()
  studentId: number;

  @ApiProperty({
    description: 'Session ID',
    example: 1,
  })
  @IsNumber()
  sessionId: number;

  @ApiProperty({
    description: 'Attendance type',
    enum: AttendanceType,
    example: AttendanceType.ATTEND,
  })
  @IsEnum(AttendanceType)
  attendanceType: AttendanceType;
}

