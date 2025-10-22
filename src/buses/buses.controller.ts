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
import { BusesService } from './buses.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrganizationManagerGuard } from '../common/guards/organization-manager.guard';
import { OrganizationId } from '../common/decorators/organization-id.decorator';

@ApiTags('Buses')
@Controller('buses')
@UseGuards(JwtAuthGuard, OrganizationManagerGuard)
@ApiBearerAuth('JWT-auth')
export class BusesController {
  constructor(private readonly busesService: BusesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bus' })
  @ApiResponse({ status: 201, description: 'Bus created successfully' })
  @ApiResponse({ status: 400, description: 'One or more students not found' })
  create(@Body() createBusDto: CreateBusDto, @OrganizationId() organizationId: number) {
    return this.busesService.create(createBusDto, organizationId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all buses for the organization' })
  @ApiResponse({ status: 200, description: 'Buses retrieved successfully' })
  findAll(@OrganizationId() organizationId: number) {
    return this.busesService.findAll(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a bus by ID with students list and locations' })
  @ApiResponse({ status: 200, description: 'Bus retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Bus not found' })
  findOne(@Param('id', ParseIntPipe) id: number, @OrganizationId() organizationId: number) {
    return this.busesService.findOne(id, organizationId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a bus' })
  @ApiResponse({ status: 200, description: 'Bus updated successfully' })
  @ApiResponse({ status: 404, description: 'Bus not found' })
  @ApiResponse({ status: 400, description: 'One or more students not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBusDto: UpdateBusDto,
    @OrganizationId() organizationId: number,
  ) {
    return this.busesService.update(id, updateBusDto, organizationId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bus' })
  @ApiResponse({ status: 200, description: 'Bus deleted successfully' })
  @ApiResponse({ status: 404, description: 'Bus not found' })
  remove(@Param('id', ParseIntPipe) id: number, @OrganizationId() organizationId: number) {
    return this.busesService.remove(id, organizationId);
  }
}

