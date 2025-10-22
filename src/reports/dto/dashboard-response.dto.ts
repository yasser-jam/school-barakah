import { ApiProperty } from '@nestjs/swagger';

export class DashboardMetricsDto {
  @ApiProperty({ description: 'Total courses count', example: 15 })
  coursesCount: number;

  @ApiProperty({ description: 'Total students count', example: 120 })
  studentsCount: number;

  @ApiProperty({ description: 'Total teachers count', example: 8 })
  teachersCount: number;

  @ApiProperty({ description: 'Total classrooms count', example: 10 })
  classRoomsCount: number;

  @ApiProperty({ description: 'Total buses count', example: 3 })
  busesCount: number;

  @ApiProperty({ description: 'Active teachers count', example: 7 })
  activeTeachersCount: number;

  @ApiProperty({ description: 'Inactive teachers count', example: 1 })
  inactiveTeachersCount: number;
}

export class AttendanceEvolutionDto {
  @ApiProperty({ description: 'Date', example: '2024-01-15' })
  date: string;

  @ApiProperty({ description: 'Attendance rate percentage', example: 85.5 })
  attendanceRate: number;

  @ApiProperty({ description: 'Total sessions', example: 20 })
  totalSessions: number;

  @ApiProperty({ description: 'Attended sessions', example: 17 })
  attendedSessions: number;
}

export class CourseAttendanceDto {
  @ApiProperty({ description: 'Course ID', example: 1 })
  courseId: number;

  @ApiProperty({ description: 'Course title', example: 'Advanced Mathematics' })
  courseTitle: string;

  @ApiProperty({ description: 'Average attendance rate', example: 88.5 })
  averageAttendanceRate: number;

  @ApiProperty({ description: 'Total sessions', example: 25 })
  totalSessions: number;
}

export class TeacherSessionsSummaryDto {
  @ApiProperty({ description: 'Teacher ID', example: 1 })
  teacherId: number;

  @ApiProperty({ description: 'Teacher name', example: 'John Doe' })
  teacherName: string;

  @ApiProperty({ description: 'Sessions count this month', example: 20 })
  sessionsCountThisMonth: number;

  @ApiProperty({ description: 'Total payments this month', example: 1000.0 })
  totalPaymentsThisMonth: number;
}

export class DashboardResponseDto {
  @ApiProperty({ description: 'Dashboard metrics', type: DashboardMetricsDto })
  metrics: DashboardMetricsDto;

  @ApiProperty({ description: 'Attendance evolution data', type: [AttendanceEvolutionDto] })
  attendanceEvolution: AttendanceEvolutionDto[];

  @ApiProperty({ description: 'Course attendance data', type: [CourseAttendanceDto] })
  courseAttendance: CourseAttendanceDto[];

  @ApiProperty({ description: 'Teacher sessions summary', type: [TeacherSessionsSummaryDto] })
  teacherSessionsSummary: TeacherSessionsSummaryDto[];
}

