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
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizationManagerGuard } from '../common/guards/organization-manager.guard';
import { TeacherGuard } from '../common/guards/teacher.guard';
import { OrganizationId } from '../common/decorators/organization-id.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Courses')
@Controller('courses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(OrganizationManagerGuard)
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid teacher, classroom, or students' })
  create(@Body() createCourseDto: CreateCourseDto, @OrganizationId() organizationId: number) {
    return this.coursesService.create(createCourseDto, organizationId);
  }

  @Get()
  @UseGuards(OrganizationManagerGuard)
  @ApiOperation({ summary: 'Get all courses for the organization' })
  @ApiResponse({ status: 200, description: 'Courses retrieved successfully' })
  findAll(@OrganizationId() organizationId: number) {
    return this.coursesService.findAll(organizationId);
  }

  @Get('my-courses')
  @UseGuards(TeacherGuard)
  @ApiOperation({ summary: 'Get courses for the current teacher' })
  @ApiResponse({ status: 200, description: 'Teacher courses retrieved successfully' })
  getMyCourses(@CurrentUser() user: any) {
    return this.coursesService.getTeacherCourses(user.userId, user.organizationId);
  }

  @Get(':id')
  @UseGuards(OrganizationManagerGuard)
  @ApiOperation({ summary: 'Get a course by ID with full details' })
  @ApiResponse({ status: 200, description: 'Course retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findOne(@Param('id', ParseIntPipe) id: number, @OrganizationId() organizationId: number) {
    return this.coursesService.findOne(id, organizationId);
  }

  @Patch(':id')
  @UseGuards(OrganizationManagerGuard)
  @ApiOperation({ summary: 'Update a course' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 400, description: 'Invalid teacher, classroom, or students' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
    @OrganizationId() organizationId: number,
  ) {
    return this.coursesService.update(id, updateCourseDto, organizationId);
  }

  @Delete(':id')
  @UseGuards(OrganizationManagerGuard)
  @ApiOperation({ summary: 'Delete a course' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  remove(@Param('id', ParseIntPipe) id: number, @OrganizationId() organizationId: number) {
    return this.coursesService.remove(id, organizationId);
  }
}

