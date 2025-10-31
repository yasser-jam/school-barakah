import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerOrganization(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    // Check if organization already exists
    const existingOrg = await this.prisma.organization.findUnique({
      where: { email },
    });

    if (existingOrg) {
      throw new ConflictException('Organization with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create organization
    const organization = await this.prisma.organization.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Generate token
    const token = this.generateToken(organization, 'ORGANIZATION', organization.id);

    return {
      access_token: token,
      user: {
        id: organization.id,
        email: organization.email,
        name: organization.name,
        userType: 'ORGANIZATION',
        role: 'organization',
        organizationId: organization.id,
      },
    };
  }

  async loginOrganization(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Try to find organization first
    const organization = await this.prisma.organization.findUnique({
      where: { email },
    });

    if (organization) {
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, organization.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate token
      const token = this.generateToken(organization, 'ORGANIZATION', organization.id);

      return {
        access_token: token,
        user: {
          id: organization.id,
          email: organization.email,
          name: organization.name,
          userType: 'ORGANIZATION',
          role: 'organization',
          organizationId: organization.id,
        },
      };
    }

    // If not organization, try to find teacher
    const teacher = await this.prisma.teacher.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (teacher) {
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, teacher.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate token
      const token = this.generateToken(teacher, 'TEACHER', teacher.organizationId);

      return {
        access_token: token,
        user: {
          id: teacher.id,
          email: teacher.email,
          name: `${teacher.firstName} ${teacher.lastName}`,
          userType: 'TEACHER',
          role: 'teacher',
          organizationId: teacher.organizationId,
        },
      };
    }

    // If neither found, throw error
    throw new UnauthorizedException('Invalid credentials');
  }

  async loginManager(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find manager
    const manager = await this.prisma.manager.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!manager) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, manager.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(manager, 'MANAGER', manager.organizationId);

    return {
      access_token: token,
      user: {
        id: manager.id,
        email: manager.email,
        name: `${manager.firstName} ${manager.lastName}`,
        userType: 'MANAGER',
        role: 'manager',
        organizationId: manager.organizationId,
      },
    };
  }

  async loginTeacher(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find teacher
    const teacher = await this.prisma.teacher.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!teacher) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, teacher.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(teacher, 'TEACHER', teacher.organizationId);

    return {
      access_token: token,
      user: {
        id: teacher.id,
        email: teacher.email,
        name: `${teacher.firstName} ${teacher.lastName}`,
        userType: 'TEACHER',
        role: 'teacher',
        organizationId: teacher.organizationId,
      },
    };
  }

  private generateToken(user: any, userType: 'ORGANIZATION' | 'MANAGER' | 'TEACHER', organizationId: number) {
    const payload = {
      email: user.email,
      name: user.firstName ? `${user.firstName} ${user.lastName}` : user.name,
      userType,
      organizationId,
      sub: user.id,
    };

    return this.jwtService.sign(payload);
  }
}

