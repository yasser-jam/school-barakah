import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto, organizationId: number) {
    const { studentIds, ...courseData } = createCourseDto;

    // Verify teacher belongs to organization
    const teacher = await this.prisma.teacher.findFirst({
      where: { 
        id: createCourseDto.teacherId,
        organizationId,
      },
    });

    if (!teacher) {
      throw new BadRequestException('Teacher not found or does not belong to organization');
    }

    // Verify classroom belongs to organization
    const classRoom = await this.prisma.classRoom.findFirst({
      where: { 
        id: createCourseDto.classRoomId,
        organizationId,
      },
    });

    if (!classRoom) {
      throw new BadRequestException('Classroom not found or does not belong to organization');
    }

    // Verify students belong to organization
    const students = await this.prisma.student.findMany({
      where: { 
        id: { in: studentIds },
        organizationId,
      },
    });

    if (students.length !== studentIds.length) {
      throw new BadRequestException('One or more students not found or do not belong to organization');
    }

    return await this.prisma.course.create({
      data: {
        ...courseData,
        organizationId,
        students: {
          create: studentIds.map(studentId => ({
            studentId,
          })),
        },
      },
      include: {
        teacher: {
          include: {
            subject: true,
          },
        },
        classRoom: true,
        students: {
          include: {
            student: true,
          },
        },
        courseSessions: true,
      },
    });
  }

  async findAll(organizationId: number) {
    return await this.prisma.course.findMany({
      where: { organizationId },
      include: {
        teacher: {
          include: {
            subject: true,
          },
        },
        classRoom: true,
        students: {
          include: {
            student: true,
          },
        },
        courseSessions: true,
      },
      orderBy: { title: 'asc' },
    });
  }

  async findOne(id: number, organizationId: number) {
    const course = await this.prisma.course.findFirst({
      where: { 
        id,
        organizationId,
      },
      include: {
        teacher: {
          include: {
            subject: true,
          },
        },
        classRoom: true,
        students: {
          include: {
            student: true,
          },
        },
        courseSessions: {
          include: {
            studentAttendance: {
              include: {
                student: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto, organizationId: number) {
    try {
      const { studentIds, ...courseData } = updateCourseDto;

      // If studentIds are provided, update the many-to-many relationship
      if (studentIds) {
        // Verify students belong to organization
        const students = await this.prisma.student.findMany({
          where: { 
            id: { in: studentIds },
            organizationId,
          },
        });

        if (students.length !== studentIds.length) {
          throw new BadRequestException('One or more students not found or do not belong to organization');
        }

        // Update course with new student relationships
        return await this.prisma.course.update({
          where: { 
            id,
            organizationId,
          },
          data: {
            ...courseData,
            students: {
              deleteMany: {},
              create: studentIds.map(studentId => ({
                studentId,
              })),
            },
          },
          include: {
            teacher: {
              include: {
                subject: true,
              },
            },
            classRoom: true,
            students: {
              include: {
                student: true,
              },
            },
            courseSessions: true,
          },
        });
      }

      return await this.prisma.course.update({
        where: { 
          id,
          organizationId,
        },
        data: courseData,
        include: {
          teacher: {
            include: {
              subject: true,
            },
          },
          classRoom: true,
          students: {
            include: {
              student: true,
            },
          },
          courseSessions: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number, organizationId: number) {
    try {
      return await this.prisma.course.delete({
        where: { 
          id,
          organizationId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getTeacherCourses(teacherId: number, organizationId: number) {
    return await this.prisma.course.findMany({
      where: { 
        teacherId,
        organizationId,
      },
      include: {
        teacher: {
          include: {
            subject: true,
          },
        },
        classRoom: true,
        students: {
          include: {
            student: true,
          },
        },
        courseSessions: true,
      },
    });
  }
}

