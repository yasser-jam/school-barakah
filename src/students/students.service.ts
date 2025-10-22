import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto, organizationId: number) {
    return await this.prisma.student.create({
      data: {
        ...createStudentDto,
        organizationId,
      },
    });
  }

  async findAll(organizationId: number) {
    return await this.prisma.student.findMany({
      where: { organizationId },
      orderBy: { firstName: 'asc' },
    });
  }

  async findOne(id: number, organizationId: number) {
    const student = await this.prisma.student.findFirst({
      where: { 
        id,
        organizationId,
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto, organizationId: number) {
    try {
      return await this.prisma.student.update({
        where: { 
          id,
          organizationId,
        },
        data: updateStudentDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number, organizationId: number) {
    try {
      return await this.prisma.student.delete({
        where: { 
          id,
          organizationId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getStudentCourses(studentId: number, organizationId: number) {
    const student = await this.prisma.student.findFirst({
      where: { 
        id: studentId,
        organizationId,
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return await this.prisma.course.findMany({
      where: { 
        organizationId,
        students: {
          some: {
            studentId,
          },
        },
      },
      include: {
        teacher: {
          include: {
            subject: true,
          },
        },
        classRoom: true,
        courseSessions: true,
      },
    });
  }

  async getStudentAttendanceSummary(studentId: number, organizationId: number) {
    const student = await this.prisma.student.findFirst({
      where: { 
        id: studentId,
        organizationId,
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const attendanceRecords = await this.prisma.studentAttendance.findMany({
      where: {
        studentId,
        session: {
          course: {
            organizationId,
          },
        },
      },
      include: {
        session: {
          include: {
            course: {
              include: {
                teacher: true,
              },
            },
          },
        },
      },
    });

    const summary = {
      totalSessions: attendanceRecords.length,
      attended: attendanceRecords.filter(record => record.attendanceType === 'ATTEND').length,
      absent: attendanceRecords.filter(record => record.attendanceType === 'ABSENT').length,
      delayed: attendanceRecords.filter(record => record.attendanceType === 'DELAY').length,
      attendanceRate: attendanceRecords.length > 0 
        ? (attendanceRecords.filter(record => record.attendanceType === 'ATTEND').length / attendanceRecords.length) * 100 
        : 0,
    };

    return {
      student,
      summary,
      attendanceRecords,
    };
  }
}

