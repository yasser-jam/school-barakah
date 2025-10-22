import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';

@Injectable()
export class BusesService {
  constructor(private prisma: PrismaService) {}

  async create(createBusDto: CreateBusDto, organizationId: number) {
    const { studentIds, ...busData } = createBusDto;

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

    return await this.prisma.bus.create({
      data: {
        ...busData,
        organizationId,
        students: {
          create: studentIds.map(studentId => ({
            studentId,
          })),
        },
      },
      include: {
        students: {
          include: {
            student: true,
          },
        },
      },
    });
  }

  async findAll(organizationId: number) {
    return await this.prisma.bus.findMany({
      where: { organizationId },
      include: {
        students: {
          include: {
            student: true,
          },
        },
      },
      orderBy: { driverName: 'asc' },
    });
  }

  async findOne(id: number, organizationId: number) {
    const bus = await this.prisma.bus.findFirst({
      where: { 
        id,
        organizationId,
      },
      include: {
        students: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!bus) {
      throw new NotFoundException(`Bus with ID ${id} not found`);
    }

    return bus;
  }

  async update(id: number, updateBusDto: UpdateBusDto, organizationId: number) {
    try {
      const { studentIds, ...busData } = updateBusDto;

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

        // Update bus with new student relationships
        return await this.prisma.bus.update({
          where: { 
            id,
            organizationId,
          },
          data: {
            ...busData,
            students: {
              deleteMany: {},
              create: studentIds.map(studentId => ({
                studentId,
              })),
            },
          },
          include: {
            students: {
              include: {
                student: true,
              },
            },
          },
        });
      }

      return await this.prisma.bus.update({
        where: { 
          id,
          organizationId,
        },
        data: busData,
        include: {
          students: {
            include: {
              student: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Bus with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number, organizationId: number) {
    try {
      return await this.prisma.bus.delete({
        where: { 
          id,
          organizationId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Bus with ID ${id} not found`);
      }
      throw error;
    }
  }
}

