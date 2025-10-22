import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseSessionDto } from './dto/create-course-session.dto';
import { UpdateCourseSessionDto } from './dto/update-course-session.dto';
import { CreateSessionPaymentDto } from './dto/create-session-payment.dto';

@Injectable()
export class CourseSessionsService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseSessionDto: CreateCourseSessionDto, organizationId: number) {
    // Verify course belongs to organization
    const course = await this.prisma.course.findFirst({
      where: { 
        id: createCourseSessionDto.courseId,
        organizationId,
      },
    });

    if (!course) {
      throw new BadRequestException('Course not found or does not belong to organization');
    }

    return await this.prisma.courseSession.create({
      data: createCourseSessionDto,
      include: {
        course: {
          include: {
            teacher: true,
            classRoom: true,
          },
        },
        studentAttendance: {
          include: {
            student: true,
          },
        },
        sessionPayments: true,
      },
    });
  }

  async findAll(organizationId: number) {
    return await this.prisma.courseSession.findMany({
      where: {
        course: {
          organizationId,
        },
      },
      include: {
        course: {
          include: {
            teacher: true,
            classRoom: true,
          },
        },
        studentAttendance: {
          include: {
            student: true,
          },
        },
        sessionPayments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, organizationId: number) {
    const session = await this.prisma.courseSession.findFirst({
      where: { 
        id,
        course: {
          organizationId,
        },
      },
      include: {
        course: {
          include: {
            teacher: true,
            classRoom: true,
          },
        },
        studentAttendance: {
          include: {
            student: true,
          },
        },
        sessionPayments: true,
      },
    });

    if (!session) {
      throw new NotFoundException(`Course session with ID ${id} not found`);
    }

    return session;
  }

  async update(id: number, updateCourseSessionDto: UpdateCourseSessionDto, organizationId: number) {
    try {
      return await this.prisma.courseSession.update({
        where: { 
          id,
          course: {
            organizationId,
          },
        },
        data: updateCourseSessionDto,
        include: {
          course: {
            include: {
              teacher: true,
              classRoom: true,
            },
          },
          studentAttendance: {
            include: {
              student: true,
            },
          },
          sessionPayments: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Course session with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number, organizationId: number) {
    try {
      return await this.prisma.courseSession.delete({
        where: { 
          id,
          course: {
            organizationId,
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Course session with ID ${id} not found`);
      }
      throw error;
    }
  }

  async createSessionPayment(sessionId: number, createSessionPaymentDto: CreateSessionPaymentDto, organizationId: number) {
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
      throw new NotFoundException(`Course session with ID ${sessionId} not found`);
    }

    // Verify teacher belongs to organization
    const teacher = await this.prisma.teacher.findFirst({
      where: { 
        id: createSessionPaymentDto.teacherId,
        organizationId,
      },
    });

    if (!teacher) {
      throw new BadRequestException('Teacher not found or does not belong to organization');
    }

    return await this.prisma.sessionPayment.create({
      data: {
        ...createSessionPaymentDto,
        sessionId,
      },
      include: {
        teacher: true,
        session: {
          include: {
            course: true,
          },
        },
      },
    });
  }

  async getSessionPayments(sessionId: number, organizationId: number) {
    const session = await this.prisma.courseSession.findFirst({
      where: { 
        id: sessionId,
        course: {
          organizationId,
        },
      },
    });

    if (!session) {
      throw new NotFoundException(`Course session with ID ${sessionId} not found`);
    }

    return await this.prisma.sessionPayment.findMany({
      where: { sessionId },
      include: {
        teacher: true,
        session: {
          include: {
            course: true,
          },
        },
      },
    });
  }
}

