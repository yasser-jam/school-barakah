import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherResponseDto } from './dto/teacher-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizationManagerGuard } from '../common/guards/organization-manager.guard';
import { OrganizationId } from '../common/decorators/organization-id.decorator';

@ApiTags('Teachers')
@Controller('teachers')
@UseGuards(JwtAuthGuard, OrganizationManagerGuard)
@ApiBearerAuth('JWT-auth')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new teacher' })
  @ApiResponse({ status: 201, description: 'Teacher created successfully', type: TeacherResponseDto })
  @ApiResponse({ status: 409, description: 'Teacher with this email already exists' })
  create(@Body() createTeacherDto: CreateTeacherDto, @OrganizationId() organizationId: number) {
    return this.teachersService.create(createTeacherDto, organizationId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teachers for the organization' })
  @ApiResponse({ status: 200, description: 'Teachers retrieved successfully', type: [TeacherResponseDto] })
  findAll(@OrganizationId() organizationId: number) {
    return this.teachersService.findAll(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a teacher by ID' })
  @ApiResponse({ status: 200, description: 'Teacher retrieved successfully', type: TeacherResponseDto })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  findOne(@Param('id', ParseIntPipe) id: number, @OrganizationId() organizationId: number) {
    return this.teachersService.findOne(id, organizationId);
  }

  @Get(':id/courses')
  @ApiOperation({ summary: 'Get courses assigned to a teacher' })
  @ApiResponse({ status: 200, description: 'Teacher courses retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  getTeacherCourses(@Param('id', ParseIntPipe) id: number, @OrganizationId() organizationId: number) {
    return this.teachersService.getTeacherCourses(id, organizationId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a teacher' })
  @ApiResponse({ status: 200, description: 'Teacher updated successfully', type: TeacherResponseDto })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  @ApiResponse({ status: 409, description: 'Teacher with this email already exists' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeacherDto: UpdateTeacherDto,
    @OrganizationId() organizationId: number,
  ) {
    return this.teachersService.update(id, updateTeacherDto, organizationId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a teacher' })
  @ApiResponse({ status: 200, description: 'Teacher deleted successfully' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  remove(@Param('id', ParseIntPipe) id: number, @OrganizationId() organizationId: number) {
    return this.teachersService.remove(id, organizationId);
  }
}

