import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardResponseDto, DashboardMetricsDto, AttendanceEvolutionDto, CourseAttendanceDto, TeacherSessionsSummaryDto } from './dto/dashboard-response.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(organizationId: number): Promise<DashboardResponseDto> {
    // Get basic metrics
    const [
      coursesCount,
      studentsCount,
      teachersCount,
      classRoomsCount,
      busesCount,
      activeTeachersCount,
      inactiveTeachersCount,
    ] = await Promise.all([
      this.prisma.course.count({ where: { organizationId } }),
      this.prisma.student.count({ where: { organizationId } }),
      this.prisma.teacher.count({ where: { organizationId } }),
      this.prisma.classRoom.count({ where: { organizationId } }),
      this.prisma.bus.count({ where: { organizationId } }),
      this.prisma.teacher.count({ where: { organizationId, isActive: true } }),
      this.prisma.teacher.count({ where: { organizationId, isActive: false } }),
    ]);

    const metrics: DashboardMetricsDto = {
      coursesCount,
      studentsCount,
      teachersCount,
      classRoomsCount,
      busesCount,
      activeTeachersCount,
      inactiveTeachersCount,
    };

    // Get attendance evolution (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const attendanceEvolution = await this.getAttendanceEvolution(organizationId, thirtyDaysAgo, new Date());

    // Get course attendance data
    const courseAttendance = await this.getCourseAttendance(organizationId);

    // Get teacher sessions summary
    const teacherSessionsSummary = await this.getTeacherSessionsSummary(organizationId);

    return {
      metrics,
      attendanceEvolution,
      courseAttendance,
      teacherSessionsSummary,
    };
  }

  async getStudentsCount(organizationId: number): Promise<number> {
    return await this.prisma.student.count({ where: { organizationId } });
  }

  async getTeachersCount(organizationId: number): Promise<number> {
    return await this.prisma.teacher.count({ where: { organizationId } });
  }

  async getCoursesCount(organizationId: number): Promise<number> {
    return await this.prisma.course.count({ where: { organizationId } });
  }

  async getClassRoomsCount(organizationId: number): Promise<number> {
    return await this.prisma.classRoom.count({ where: { organizationId } });
  }

  async getBusesCount(organizationId: number): Promise<number> {
    return await this.prisma.bus.count({ where: { organizationId } });
  }

  async getAttendanceEvolution(organizationId: number, startDate: Date, endDate: Date): Promise<AttendanceEvolutionDto[]> {
    const sessions = await this.prisma.courseSession.findMany({
      where: {
        course: { organizationId },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        studentAttendance: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const dailyData = new Map<string, { totalSessions: number; attendedSessions: number }>();

    sessions.forEach(session => {
      const date = session.createdAt.toISOString().split('T')[0];
      const existing = dailyData.get(date) || { totalSessions: 0, attendedSessions: 0 };
      
      existing.totalSessions += 1;
      existing.attendedSessions += session.studentAttendance.filter(att => att.attendanceType === 'ATTEND').length;
      
      dailyData.set(date, existing);
    });

    return Array.from(dailyData.entries()).map(([date, data]) => ({
      date,
      attendanceRate: data.totalSessions > 0 ? (data.attendedSessions / data.totalSessions) * 100 : 0,
      totalSessions: data.totalSessions,
      attendedSessions: data.attendedSessions,
    }));
  }

  async getCourseAttendance(organizationId: number): Promise<CourseAttendanceDto[]> {
    const courses = await this.prisma.course.findMany({
      where: { organizationId },
      include: {
        courseSessions: {
          include: {
            studentAttendance: true,
          },
        },
      },
    });

    return courses.map(course => {
      const allSessions = course.courseSessions;
      const totalSessions = allSessions.length;
      const totalAttendanceRecords = allSessions.reduce((sum, session) => sum + session.studentAttendance.length, 0);
      const attendedRecords = allSessions.reduce((sum, session) => 
        sum + session.studentAttendance.filter(att => att.attendanceType === 'ATTEND').length, 0
      );

      return {
        courseId: course.id,
        courseTitle: course.title,
        averageAttendanceRate: totalAttendanceRecords > 0 ? (attendedRecords / totalAttendanceRecords) * 100 : 0,
        totalSessions,
      };
    });
  }

  async getTeacherSessionsSummary(organizationId: number): Promise<TeacherSessionsSummaryDto[]> {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const teachers = await this.prisma.teacher.findMany({
      where: { organizationId },
      include: {
        courses: {
          include: {
            courseSessions: {
              where: {
                createdAt: {
                  gte: currentMonth,
                },
              },
              include: {
                sessionPayments: true,
              },
            },
          },
        },
      },
    });

    return teachers.map(teacher => {
      const sessionsThisMonth = teacher.courses.reduce((sum, course) => sum + course.courseSessions.length, 0);
      const totalPayments = teacher.courses.reduce((sum, course) => 
        sum + course.courseSessions.reduce((sessionSum, session) => 
          sessionSum + session.sessionPayments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0), 0
        ), 0
      );

      return {
        teacherId: teacher.id,
        teacherName: `${teacher.firstName} ${teacher.lastName}`,
        sessionsCountThisMonth: sessionsThisMonth,
        totalPaymentsThisMonth: totalPayments,
      };
    });
  }
}

