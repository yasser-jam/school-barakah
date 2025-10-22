import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async create(createTeacherDto: CreateTeacherDto, organizationId: number) {
    try {
      const { password, ...teacherData } = createTeacherDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      return await this.prisma.teacher.create({
        data: {
          ...teacherData,
          password: hashedPassword,
          organizationId,
        },
        include: {
          subject: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Teacher with this email already exists');
      }
      throw error;
    }
  }

  async findAll(organizationId: number) {
    return await this.prisma.teacher.findMany({
      where: { organizationId },
      include: {
        subject: true,
      },
      orderBy: { firstName: 'asc' },
    });
  }

  async findOne(id: number, organizationId: number) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { 
        id,
        organizationId,
      },
      include: {
        subject: true,
        courses: {
          include: {
            classRoom: true,
            students: {
              include: {
                student: true,
              },
            },
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    return teacher;
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto, organizationId: number) {
    try {
      const { password, ...teacherData } = updateTeacherDto;
      const updateData: any = { ...teacherData };

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      return await this.prisma.teacher.update({
        where: { 
          id,
          organizationId,
        },
        data: updateData,
        include: {
          subject: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Teacher with ID ${id} not found`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Teacher with this email already exists');
      }
      throw error;
    }
  }

  async remove(id: number, organizationId: number) {
    try {
      return await this.prisma.teacher.delete({
        where: { 
          id,
          organizationId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Teacher with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getTeacherCourses(teacherId: number, organizationId: number) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { 
        id: teacherId,
        organizationId,
      },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    return await this.prisma.course.findMany({
      where: { 
        teacherId,
        organizationId,
      },
      include: {
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

