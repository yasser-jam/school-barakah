import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizationManagerGuard } from '../common/guards/organization-manager.guard';
import { OrganizationId } from '../common/decorators/organization-id.decorator';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, OrganizationManagerGuard)
@ApiBearerAuth('JWT-auth')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get consolidated dashboard data' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully', type: DashboardResponseDto })
  async getDashboard(@OrganizationId() organizationId: number): Promise<DashboardResponseDto> {
    return this.reportsService.getDashboard(organizationId);
  }

  @Get('students-count')
  @ApiOperation({ summary: 'Get students count' })
  @ApiResponse({ status: 200, description: 'Students count retrieved successfully' })
  async getStudentsCount(@OrganizationId() organizationId: number): Promise<number> {
    return this.reportsService.getStudentsCount(organizationId);
  }

  @Get('teachers-count')
  @ApiOperation({ summary: 'Get teachers count' })
  @ApiResponse({ status: 200, description: 'Teachers count retrieved successfully' })
  async getTeachersCount(@OrganizationId() organizationId: number): Promise<number> {
    return this.reportsService.getTeachersCount(organizationId);
  }

  @Get('courses-count')
  @ApiOperation({ summary: 'Get courses count' })
  @ApiResponse({ status: 200, description: 'Courses count retrieved successfully' })
  async getCoursesCount(@OrganizationId() organizationId: number): Promise<number> {
    return this.reportsService.getCoursesCount(organizationId);
  }

  @Get('classrooms-count')
  @ApiOperation({ summary: 'Get classrooms count' })
  @ApiResponse({ status: 200, description: 'Classrooms count retrieved successfully' })
  async getClassRoomsCount(@OrganizationId() organizationId: number): Promise<number> {
    return this.reportsService.getClassRoomsCount(organizationId);
  }

  @Get('buses-count')
  @ApiOperation({ summary: 'Get buses count' })
  @ApiResponse({ status: 200, description: 'Buses count retrieved successfully' })
  async getBusesCount(@OrganizationId() organizationId: number): Promise<number> {
    return this.reportsService.getBusesCount(organizationId);
  }

  @Get('attendance-evolution')
  @ApiOperation({ summary: 'Get attendance evolution data' })
  @ApiResponse({ status: 200, description: 'Attendance evolution data retrieved successfully' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)', example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)', example: '2024-01-31' })
  async getAttendanceEvolution(
    @OrganizationId() organizationId: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    return this.reportsService.getAttendanceEvolution(organizationId, start, end);
  }

  @Get('attendance-by-course')
  @ApiOperation({ summary: 'Get attendance data by course' })
  @ApiResponse({ status: 200, description: 'Course attendance data retrieved successfully' })
  async getAttendanceByCourse(@OrganizationId() organizationId: number) {
    return this.reportsService.getCourseAttendance(organizationId);
  }

  @Get('teacher-sessions-summary')
  @ApiOperation({ summary: 'Get teacher sessions summary' })
  @ApiResponse({ status: 200, description: 'Teacher sessions summary retrieved successfully' })
  async getTeacherSessionsSummary(@OrganizationId() organizationId: number) {
    return this.reportsService.getTeacherSessionsSummary(organizationId);
  }
}

