import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ManagersService {
  constructor(private prisma: PrismaService) {}

  async create(createManagerDto: CreateManagerDto, organizationId: number) {
    try {
      const { password, ...managerData } = createManagerDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      return await this.prisma.manager.create({
        data: {
          ...managerData,
          password: hashedPassword,
          organizationId,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Manager with this email already exists');
      }
      throw error;
    }
  }

  async findAll(organizationId: number) {
    return await this.prisma.manager.findMany({
      where: { organizationId },
      orderBy: { firstName: 'asc' },
    });
  }

  async findOne(id: number, organizationId: number) {
    const manager = await this.prisma.manager.findFirst({
      where: { 
        id,
        organizationId,
      },
    });

    if (!manager) {
      throw new NotFoundException(`Manager with ID ${id} not found`);
    }

    return manager;
  }

  async update(id: number, updateManagerDto: UpdateManagerDto, organizationId: number) {
    try {
      const { password, ...managerData } = updateManagerDto;
      const updateData: any = { ...managerData };

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      return await this.prisma.manager.update({
        where: { 
          id,
          organizationId,
        },
        data: updateData,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Manager with ID ${id} not found`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Manager with this email already exists');
      }
      throw error;
    }
  }

  async remove(id: number, organizationId: number) {
    try {
      return await this.prisma.manager.delete({
        where: { 
          id,
          organizationId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Manager with ID ${id} not found`);
      }
      throw error;
    }
  }
}

