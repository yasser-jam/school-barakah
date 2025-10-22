import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  constructor(private prisma: PrismaService) {}

  async seed() {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await this.clearDatabase();

    // Create subjects first (needed for teachers)
    await this.createSubjects();

    // Create organizations with their data
    await this.createOrganizations();

    console.log('✅ Database seeding completed successfully!');
  }

  private async clearDatabase() {
    console.log('🧹 Clearing existing data...');
    
    // Delete in reverse order of dependencies
    await this.prisma.sessionPayment.deleteMany();
    await this.prisma.studentAttendance.deleteMany();
    await this.prisma.courseSession.deleteMany();
    await this.prisma.courseStudent.deleteMany();
    await this.prisma.busStudent.deleteMany();
    await this.prisma.course.deleteMany();
    await this.prisma.bus.deleteMany();
    await this.prisma.classRoom.deleteMany();
    await this.prisma.student.deleteMany();
    await this.prisma.teacher.deleteMany();
    await this.prisma.manager.deleteMany();
    await this.prisma.organization.deleteMany();
    await this.prisma.subject.deleteMany();
  }

  private async createSubjects() {
    console.log('📚 Creating subjects...');
    
    const subjects = [
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'English Literature',
      'History',
      'Geography',
      'Computer Science',
      'Art',
      'Physical Education'
    ];

    for (const subjectName of subjects) {
      await this.prisma.subject.create({
        data: {
          name: subjectName,
        },
      });
    }
  }

  private async createOrganizations() {
    console.log('🏢 Creating organizations and their data...');

    const organizations = [
      {
        name: 'Al-Noor Academy',
        email: 'alnoor@academy.com',
        phone: '0912345678'
      },
      {
        name: 'Bright Future School',
        email: 'bright@future.com',
        phone: '0923456789'
      },
      {
        name: 'Knowledge Hub',
        email: 'knowledge@hub.com',
        phone: '0934567890'
      },
      {
        name: 'Excellence Center',
        email: 'excellence@center.com',
        phone: '0945678901'
      },
      {
        name: 'Wisdom Institute',
        email: 'wisdom@institute.com',
        phone: '0956789012'
      }
    ];

    for (const orgData of organizations) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const organization = await this.prisma.organization.create({
        data: {
          name: orgData.name,
          email: orgData.email,
          password: hashedPassword,
        },
      });

      // Create manager for this organization
      await this.createManager(organization.id, orgData.phone);

      // Create 2 classrooms
      await this.createClassrooms(organization.id);

      // Create 2 teachers
      await this.createTeachers(organization.id);

      // Create 30 students
      await this.createStudents(organization.id);

      // Create one course with 3 sessions
      await this.createCourseWithSessions(organization.id);

      console.log(`✅ Created organization: ${orgData.name}`);
    }
  }

  private async createManager(organizationId: number, phone: string) {
    const hashedPassword = await bcrypt.hash('manager123', 10);
    
    await this.prisma.manager.create({
      data: {
        firstName: 'Manager',
        lastName: 'Admin',
        email: `manager@org${organizationId}.com`,
        password: hashedPassword,
        phone: phone,
        gender: 'MALE',
        organizationId: organizationId,
        educationLevel: 'BACHELORS',
        universityDegree: 'Business Administration',
        yearsOfExperience: 5,
      },
    });
  }

  private async createClassrooms(organizationId: number) {
    const classrooms = [
      { title: 'Classroom A', hasProjector: true },
      { title: 'Classroom B', hasProjector: false }
    ];

    for (const classroom of classrooms) {
      await this.prisma.classRoom.create({
        data: {
          title: classroom.title,
          hasProjector: classroom.hasProjector,
          organizationId: organizationId,
        },
      });
    }
  }

  private async createTeachers(organizationId: number) {
    const subjects = await this.prisma.subject.findMany();
    
    const teachers = [
      {
        firstName: 'Ahmed',
        lastName: 'Hassan',
        email: `teacher1@org${organizationId}.com`,
        phone: '0967890123',
        gender: 'MALE' as const,
        salaryPerSession: 150.0,
        educationLevel: 'BACHELORS' as const,
        universityDegree: 'Mathematics',
        yearsOfExperience: 3,
        subjectId: subjects[0].id, // Mathematics
      },
      {
        firstName: 'Fatima',
        lastName: 'Ali',
        email: `teacher2@org${organizationId}.com`,
        phone: '0978901234',
        gender: 'FEMALE' as const,
        salaryPerSession: 140.0,
        educationLevel: 'MASTERS' as const,
        universityDegree: 'English Literature',
        yearsOfExperience: 5,
        subjectId: subjects[4].id, // English Literature
      }
    ];

    for (const teacherData of teachers) {
      const hashedPassword = await bcrypt.hash('teacher123', 10);
      
      await this.prisma.teacher.create({
        data: {
          ...teacherData,
          password: hashedPassword,
          organizationId: organizationId,
        },
      });
    }
  }

  private async createStudents(organizationId: number) {
    const firstNames = [
      'Mohammed', 'Ahmed', 'Ali', 'Omar', 'Hassan', 'Youssef', 'Ibrahim', 'Khalid',
      'Fatima', 'Aisha', 'Maryam', 'Zainab', 'Khadija', 'Amina', 'Hafsa', 'Safiya',
      'Abdullah', 'Yasin', 'Tariq', 'Nasser', 'Salma', 'Layla', 'Nour', 'Rana',
      'Mahmoud', 'Saeed', 'Waleed', 'Faisal', 'Nadia', 'Dina'
    ];

    const lastNames = [
      'Al-Rashid', 'Al-Mahmoud', 'Al-Hassan', 'Al-Ali', 'Al-Omar', 'Al-Youssef',
      'Al-Ibrahim', 'Al-Khalid', 'Al-Fatima', 'Al-Aisha', 'Al-Maryam', 'Al-Zainab',
      'Al-Khadija', 'Al-Amina', 'Al-Hafsa', 'Al-Safiya', 'Al-Abdullah', 'Al-Yasin',
      'Al-Tariq', 'Al-Nasser', 'Al-Salma', 'Al-Layla', 'Al-Nour', 'Al-Rana',
      'Al-Mahmoud', 'Al-Saeed', 'Al-Waleed', 'Al-Faisal', 'Al-Nadia', 'Al-Dina'
    ];

    const genders: ('MALE' | 'FEMALE')[] = ['MALE', 'FEMALE'];

    for (let i = 0; i < 30; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      const gender = genders[i % 2];
      const phone = `098${String(i).padStart(7, '0')}`;

      await this.prisma.student.create({
        data: {
          firstName,
          lastName,
          gender,
          bod: new Date(2000 + (i % 10), i % 12, (i % 28) + 1),
          organizationId: organizationId,
          notes: `Student ${i + 1} of organization ${organizationId}`,
        },
      });
    }
  }

  private async createCourseWithSessions(organizationId: number) {
    // Get a teacher and classroom for this organization
    const teacher = await this.prisma.teacher.findFirst({
      where: { organizationId },
    });

    const classroom = await this.prisma.classRoom.findFirst({
      where: { organizationId },
    });

    if (!teacher || !classroom) {
      console.log(`⚠️  No teacher or classroom found for organization ${organizationId}`);
      return;
    }

    // Create course
    const course = await this.prisma.course.create({
      data: {
        title: `Main Course - Organization ${organizationId}`,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-15'),
        days: ['Monday', 'Wednesday', 'Friday'],
        startTime: '09:00',
        endTime: '11:00',
        organizationId: organizationId,
        teacherId: teacher.id,
        classRoomId: classroom.id,
      },
    });

    // Create 3 sessions for this course
    const sessions = [
      { title: 'Introduction Session', duration: 120 },
      { title: 'Advanced Concepts', duration: 120 },
      { title: 'Final Review', duration: 120 }
    ];

    for (const sessionData of sessions) {
      await this.prisma.courseSession.create({
        data: {
          title: sessionData.title,
          duration: sessionData.duration,
          courseId: course.id,
        },
      });
    }

    // Enroll some students in the course (random 10 students)
    const students = await this.prisma.student.findMany({
      where: { organizationId },
      take: 10,
    });

    for (const student of students) {
      await this.prisma.courseStudent.create({
        data: {
          courseId: course.id,
          studentId: student.id,
        },
      });
    }
  }
}
