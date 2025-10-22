import { Module } from '@nestjs/common';
import { CourseSessionsService } from './course-sessions.service';
import { CourseSessionsController } from './course-sessions.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CourseSessionsController],
  providers: [CourseSessionsService],
  exports: [CourseSessionsService],
})
export class CourseSessionsModule {}

