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
import { ClassRoomsService } from './classrooms.service';
import { CreateClassRoomDto } from './dto/create-classroom.dto';
import { UpdateClassRoomDto } from './dto/update-classroom.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizationManagerGuard } from '../common/guards/organization-manager.guard';
import { OrganizationId } from '../common/decorators/organization-id.decorator';

@ApiTags('ClassRooms')
@Controller('classrooms')
@UseGuards(JwtAuthGuard, OrganizationManagerGuard)
@ApiBearerAuth('JWT-auth')
export class ClassRoomsController {
  constructor(private readonly classRoomsService: ClassRoomsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new classroom' })
  @ApiResponse({ status: 201, description: 'Classroom created successfully' })
  create(@Body() createClassRoomDto: CreateClassRoomDto, @OrganizationId() organizationId: number) {
    return this.classRoomsService.create(createClassRoomDto, organizationId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all classrooms for the organization' })
  @ApiResponse({ status: 200, description: 'Classrooms retrieved successfully' })
  findAll(@OrganizationId() organizationId: number) {
    return this.classRoomsService.findAll(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a classroom by ID' })
  @ApiResponse({ status: 200, description: 'Classroom retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  findOne(@Param('id', ParseIntPipe) id: number, @OrganizationId() organizationId: number) {
    return this.classRoomsService.findOne(id, organizationId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a classroom' })
  @ApiResponse({ status: 200, description: 'Classroom updated successfully' })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClassRoomDto: UpdateClassRoomDto,
    @OrganizationId() organizationId: number,
  ) {
    return this.classRoomsService.update(id, updateClassRoomDto, organizationId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a classroom' })
  @ApiResponse({ status: 200, description: 'Classroom deleted successfully' })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  remove(@Param('id', ParseIntPipe) id: number, @OrganizationId() organizationId: number) {
    return this.classRoomsService.remove(id, organizationId);
  }
}

