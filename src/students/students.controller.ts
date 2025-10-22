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
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentResponseDto } from './dto/student-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizationManagerGuard } from '../common/guards/organization-manager.guard';
import { OrganizationId } from '../common/decorators/organization-id.decorator';

@ApiTags('Students')
@Controller('students')
@UseGuards(JwtAuthGuard, OrganizationManagerGuard)
@ApiBearerAuth('JWT-auth')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({ status: 201, description: 'Student created successfully', type: StudentResponseDto })
  create(@Body() createStudentDto: CreateStudentDto, @OrganizationId() organizationId: number) {
    return this.studentsService.create(createStudentDto, organizationId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all students for the organization' })
  @ApiResponse({ status: 200, description: 'Students retrieved successfully', type: [StudentResponseDto] })
  findAll(@OrganizationId() organizationId: number) {
    return this.studentsService.findAll(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiResponse({ status: 200, description: 'Student retrieved successfully', type: StudentResponseDto })
  @ApiResponse({ status: 404, description: 'Student not found' })
  findOne(@Param('id', ParseIntPipe) id: number, @OrganizationId() organizationId: number) {
    return this.studentsService.findOne(id, organizationId);
  }

  @Get(':id/courses')
  @ApiOperation({ summary: 'Get courses for a student' })
  @ApiResponse({ status: 200, description: 'Student courses retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  getStudentCourses(@Param('id', ParseIntPipe) id: number, @OrganizationId() organizationId: number) {
    return this.studentsService.getStudentCourses(id, organizationId);
  }

  @Get(':id/attendance-summary')
  @ApiOperation({ summary: 'Get attendance summary for a student' })
  @ApiResponse({ status: 200, description: 'Student attendance summary retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  getStudentAttendanceSummary(@Param('id', ParseIntPipe) id: number, @OrganizationId() organizationId: number) {
    return this.studentsService.getStudentAttendanceSummary(id, organizationId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student' })
  @ApiResponse({ status: 200, description: 'Student updated successfully', type: StudentResponseDto })
  @ApiResponse({ status: 404, description: 'Student not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
    @OrganizationId() organizationId: number,
  ) {
    return this.studentsService.update(id, updateStudentDto, organizationId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student' })
  @ApiResponse({ status: 200, description: 'Student deleted successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  remove(@Param('id', ParseIntPipe) id: number, @OrganizationId() organizationId: number) {
    return this.studentsService.remove(id, organizationId);
  }
}

