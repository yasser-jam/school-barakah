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
import { ManagersService } from './managers.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { ManagerResponseDto } from './dto/manager-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizationGuard } from '../common/guards/organization.guard';
import { OrganizationId } from '../common/decorators/organization-id.decorator';

@ApiTags('Managers')
@Controller('managers')
@UseGuards(JwtAuthGuard, OrganizationGuard)
@ApiBearerAuth('JWT-auth')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new manager' })
  @ApiResponse({ status: 201, description: 'Manager created successfully', type: ManagerResponseDto })
  @ApiResponse({ status: 409, description: 'Manager with this email already exists' })
  create(@Body() createManagerDto: CreateManagerDto, @OrganizationId() organizationId: number) {
    return this.managersService.create(createManagerDto, organizationId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all managers for the organization' })
  @ApiResponse({ status: 200, description: 'Managers retrieved successfully', type: [ManagerResponseDto] })
  findAll(@OrganizationId() organizationId: number) {
    return this.managersService.findAll(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a manager by ID' })
  @ApiResponse({ status: 200, description: 'Manager retrieved successfully', type: ManagerResponseDto })
  @ApiResponse({ status: 404, description: 'Manager not found' })
  findOne(@Param('id', ParseIntPipe) id: number, @OrganizationId() organizationId: number) {
    return this.managersService.findOne(id, organizationId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a manager' })
  @ApiResponse({ status: 200, description: 'Manager updated successfully', type: ManagerResponseDto })
  @ApiResponse({ status: 404, description: 'Manager not found' })
  @ApiResponse({ status: 409, description: 'Manager with this email already exists' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateManagerDto: UpdateManagerDto,
    @OrganizationId() organizationId: number,
  ) {
    return this.managersService.update(id, updateManagerDto, organizationId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a manager' })
  @ApiResponse({ status: 200, description: 'Manager deleted successfully' })
  @ApiResponse({ status: 404, description: 'Manager not found' })
  remove(@Param('id', ParseIntPipe) id: number, @OrganizationId() organizationId: number) {
    return this.managersService.remove(id, organizationId);
  }
}

