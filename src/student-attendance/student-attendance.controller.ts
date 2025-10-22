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
import { StudentAttendanceService } from './student-attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { BulkAttendanceDto } from './dto/bulk-attendance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizationManagerGuard } from '../common/guards/organization-manager.guard';
import { OrganizationId } from '../common/decorators/organization-id.decorator';

@ApiTags('Student Attendance')
@Controller('student-attendance')
@UseGuards(JwtAuthGuard, OrganizationManagerGuard)
@ApiBearerAuth('JWT-auth')
export class StudentAttendanceController {
  constructor(private readonly studentAttendanceService: StudentAttendanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new attendance record' })
  @ApiResponse({ status: 201, description: 'Attendance record created successfully' })
  @ApiResponse({ status: 400, description: 'Student, session not found or attendance already exists' })
  create(@Body() createAttendanceDto: CreateAttendanceDto, @OrganizationId() organizationId: number) {
    return this.studentAttendanceService.create(createAttendanceDto, organizationId);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple attendance records at once' })
  @ApiResponse({ status: 201, description: 'Bulk attendance records created successfully' })
  @ApiResponse({ status: 400, description: 'One or more students/sessions not found' })
  createBulk(@Body() bulkAttendanceDto: BulkAttendanceDto, @OrganizationId() organizationId: number) {
    return this.studentAttendanceService.createBulk(bulkAttendanceDto, organizationId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendance records for the organization' })
  @ApiResponse({ status: 200, description: 'Attendance records retrieved successfully' })
  findAll(@OrganizationId() organizationId: number) {
    return this.studentAttendanceService.findAll(organizationId);
  }

  @Get('session/:sessionId')
  @ApiOperation({ summary: 'Get all attendance records for a specific session' })
  @ApiResponse({ status: 200, description: 'Session attendance records retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  getSessionAttendance(@Param('sessionId', ParseIntPipe) sessionId: number, @OrganizationId() organizationId: number) {
    return this.studentAttendanceService.getSessionAttendance(sessionId, organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an attendance record by ID' })
  @ApiResponse({ status: 200, description: 'Attendance record retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  findOne(@Param('id', ParseIntPipe) id: number, @OrganizationId() organizationId: number) {
    return this.studentAttendanceService.findOne(id, organizationId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an attendance record' })
  @ApiResponse({ status: 200, description: 'Attendance record updated successfully' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
    @OrganizationId() organizationId: number,
  ) {
    return this.studentAttendanceService.update(id, updateAttendanceDto, organizationId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an attendance record' })
  @ApiResponse({ status: 200, description: 'Attendance record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  remove(@Param('id', ParseIntPipe) id: number, @OrganizationId() organizationId: number) {
    return this.studentAttendanceService.remove(id, organizationId);
  }
}

