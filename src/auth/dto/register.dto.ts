import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Organization name',
    example: 'ABC School',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Organization email address',
    example: 'admin@abcschool.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Organization password',
    example: 'SecurePassword123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

