import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TeachersModule } from './teachers/teachers.module';
import { ManagersModule } from './managers/managers.module';
import { StudentsModule } from './students/students.module';
import { ClassRoomsModule } from './classrooms/classrooms.module';
import { CoursesModule } from './courses/courses.module';
import { BusesModule } from './buses/buses.module';
import { CourseSessionsModule } from './course-sessions/course-sessions.module';
import { StudentAttendanceModule } from './student-attendance/student-attendance.module';
import { ReportsModule } from './reports/reports.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule,
    SubjectsModule,
    TeachersModule,
    ManagersModule,
    StudentsModule,
    ClassRoomsModule,
    CoursesModule,
    BusesModule,
    CourseSessionsModule,
    StudentAttendanceModule,
    ReportsModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
