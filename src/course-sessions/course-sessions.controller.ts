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
import { CourseSessionsService } from './course-sessions.service';
import { CreateCourseSessionDto } from './dto/create-course-session.dto';
import { UpdateCourseSessionDto } from './dto/update-course-session.dto';
import { CreateSessionPaymentDto } from './dto/create-session-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizationManagerGuard } from '../common/guards/organization-manager.guard';
import { OrganizationId } from '../common/decorators/organization-id.decorator';

@ApiTags('Course Sessions')
@Controller('course-sessions')
@UseGuards(JwtAuthGuard, OrganizationManagerGuard)
@ApiBearerAuth('JWT-auth')
export class CourseSessionsController {
  constructor(private readonly courseSessionsService: CourseSessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new course session' })
  @ApiResponse({ status: 201, description: 'Course session created successfully' })
  @ApiResponse({ status: 400, description: 'Course not found or does not belong to organization' })
  create(@Body() createCourseSessionDto: CreateCourseSessionDto, @OrganizationId() organizationId: number) {
    return this.courseSessionsService.create(createCourseSessionDto, organizationId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all course sessions for the organization' })
  @ApiResponse({ status: 200, description: 'Course sessions retrieved successfully' })
  findAll(@OrganizationId() organizationId: number) {
    return this.courseSessionsService.findAll(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course session by ID' })
  @ApiResponse({ status: 200, description: 'Course session retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Course session not found' })
  findOne(@Param('id', ParseIntPipe) id: number, @OrganizationId() organizationId: number) {
    return this.courseSessionsService.findOne(id, organizationId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a course session' })
  @ApiResponse({ status: 200, description: 'Course session updated successfully' })
  @ApiResponse({ status: 404, description: 'Course session not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseSessionDto: UpdateCourseSessionDto,
    @OrganizationId() organizationId: number,
  ) {
    return this.courseSessionsService.update(id, updateCourseSessionDto, organizationId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course session' })
  @ApiResponse({ status: 200, description: 'Course session deleted successfully' })
  @ApiResponse({ status: 404, description: 'Course session not found' })
  remove(@Param('id', ParseIntPipe) id: number, @OrganizationId() organizationId: number) {
    return this.courseSessionsService.remove(id, organizationId);
  }

  @Post(':id/payments')
  @ApiOperation({ summary: 'Create a payment record for a course session' })
  @ApiResponse({ status: 201, description: 'Session payment created successfully' })
  @ApiResponse({ status: 404, description: 'Course session not found' })
  @ApiResponse({ status: 400, description: 'Teacher not found or does not belong to organization' })
  createSessionPayment(
    @Param('id', ParseIntPipe) sessionId: number,
    @Body() createSessionPaymentDto: CreateSessionPaymentDto,
    @OrganizationId() organizationId: number,
  ) {
    return this.courseSessionsService.createSessionPayment(sessionId, createSessionPaymentDto, organizationId);
  }

  @Get(':id/payments')
  @ApiOperation({ summary: 'Get all payments for a course session' })
  @ApiResponse({ status: 200, description: 'Session payments retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Course session not found' })
  getSessionPayments(@Param('id', ParseIntPipe) sessionId: number, @OrganizationId() organizationId: number) {
    return this.courseSessionsService.getSessionPayments(sessionId, organizationId);
  }
}

