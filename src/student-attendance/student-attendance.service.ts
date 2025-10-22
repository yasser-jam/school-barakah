import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { BulkAttendanceDto } from './dto/bulk-attendance.dto';

@Injectable()
export class StudentAttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(createAttendanceDto: CreateAttendanceDto, organizationId: number) {
    // Verify student belongs to organization
    const student = await this.prisma.student.findFirst({
      where: { 
        id: createAttendanceDto.studentId,
        organizationId,
      },
    });

    if (!student) {
      throw new BadRequestException('Student not found or does not belong to organization');
    }

    // Verify session belongs to organization
    const session = await this.prisma.courseSession.findFirst({
      where: { 
        id: createAttendanceDto.sessionId,
        course: {
          organizationId,
        },
      },
    });

    if (!session) {
      throw new BadRequestException('Session not found or does not belong to organization');
    }

    try {
      return await this.prisma.studentAttendance.create({
        data: createAttendanceDto,
        include: {
          student: true,
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
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Attendance record already exists for this student and session');
      }
      throw error;
    }
  }

  async findAll(organizationId: number) {
    return await this.prisma.studentAttendance.findMany({
      where: {
        student: {
          organizationId,
        },
      },
      include: {
        student: true,
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
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, organizationId: number) {
    const attendance = await this.prisma.studentAttendance.findFirst({
      where: { 
        id,
        student: {
          organizationId,
        },
      },
      include: {
        student: true,
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

    if (!attendance) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }

    return attendance;
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto, organizationId: number) {
    try {
      return await this.prisma.studentAttendance.update({
        where: { 
          id,
          student: {
            organizationId,
          },
        },
        data: updateAttendanceDto,
        include: {
          student: true,
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
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Attendance record with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number, organizationId: number) {
    try {
      return await this.prisma.studentAttendance.delete({
        where: { 
          id,
          student: {
            organizationId,
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Attendance record with ID ${id} not found`);
      }
      throw error;
    }
  }

  async createBulk(bulkAttendanceDto: BulkAttendanceDto, organizationId: number) {
    const { attendanceRecords } = bulkAttendanceDto;

    // Verify all students belong to organization
    const studentIds = [...new Set(attendanceRecords.map(record => record.studentId))];
    const students = await this.prisma.student.findMany({
      where: { 
        id: { in: studentIds },
        organizationId,
      },
    });

    if (students.length !== studentIds.length) {
      throw new BadRequestException('One or more students not found or do not belong to organization');
    }

    // Verify all sessions belong to organization
    const sessionIds = [...new Set(attendanceRecords.map(record => record.sessionId))];
    const sessions = await this.prisma.courseSession.findMany({
      where: { 
        id: { in: sessionIds },
        course: {
          organizationId,
        },
      },
    });

    if (sessions.length !== sessionIds.length) {
      throw new BadRequestException('One or more sessions not found or do not belong to organization');
    }

    try {
      return await this.prisma.studentAttendance.createMany({
        data: attendanceRecords,
        skipDuplicates: true,
      });
    } catch (error) {
      throw new BadRequestException('Error creating bulk attendance records');
    }
  }

  async getSessionAttendance(sessionId: number, organizationId: number) {
    // Verify session belongs to organization
    const session = await this.prisma.courseSession.findFirst({
      where: { 
        id: sessionId,
        course: {
          organizationId,
        },
      },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    return await this.prisma.studentAttendance.findMany({
      where: { sessionId },
      include: {
        student: true,
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
  }
}

