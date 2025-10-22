import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createSubjectDto: CreateSubjectDto) {
    try {
      return await this.prisma.subject.create({
        data: createSubjectDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Subject with this name already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.subject.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    return subject;
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    try {
      return await this.prisma.subject.update({
        where: { id },
        data: updateSubjectDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Subject with ID ${id} not found`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Subject with this name already exists');
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.subject.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Subject with ID ${id} not found`);
      }
      throw error;
    }
  }
}

