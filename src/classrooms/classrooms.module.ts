import { Module } from '@nestjs/common';
import { ClassRoomsService } from './classrooms.service';
import { ClassRoomsController } from './classrooms.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClassRoomsController],
  providers: [ClassRoomsService],
  exports: [ClassRoomsService],
})
export class ClassRoomsModule {}

