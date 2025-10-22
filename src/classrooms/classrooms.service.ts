import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassRoomDto } from './dto/create-classroom.dto';
import { UpdateClassRoomDto } from './dto/update-classroom.dto';

@Injectable()
export class ClassRoomsService {
  constructor(private prisma: PrismaService) {}

  async create(createClassRoomDto: CreateClassRoomDto, organizationId: number) {
    return await this.prisma.classRoom.create({
      data: {
        ...createClassRoomDto,
        organizationId,
      },
    });
  }

  async findAll(organizationId: number) {
    return await this.prisma.classRoom.findMany({
      where: { organizationId },
      orderBy: { title: 'asc' },
    });
  }

  async findOne(id: number, organizationId: number) {
    const classRoom = await this.prisma.classRoom.findFirst({
      where: { 
        id,
        organizationId,
      },
    });

    if (!classRoom) {
      throw new NotFoundException(`ClassRoom with ID ${id} not found`);
    }

    return classRoom;
  }

  async update(id: number, updateClassRoomDto: UpdateClassRoomDto, organizationId: number) {
    try {
      return await this.prisma.classRoom.update({
        where: { 
          id,
          organizationId,
        },
        data: updateClassRoomDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`ClassRoom with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number, organizationId: number) {
    try {
      return await this.prisma.classRoom.delete({
        where: { 
          id,
          organizationId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`ClassRoom with ID ${id} not found`);
      }
      throw error;
    }
  }
}

