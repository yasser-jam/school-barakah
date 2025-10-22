# School Management System API Documentation

## Overview
This is a comprehensive School Management System built with NestJS, Prisma, and PostgreSQL. The system provides a complete SaaS solution for managing schools, teachers, students, courses, attendance, and more.

## Base URL
```
coming soon...
```

## Authentication
All endpoints (except authentication endpoints) require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Data Models

### 1. Organization
Represents a school or educational institution.

**Fields:**
- `id` (Int, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relations:**
- One-to-many with Managers
- One-to-many with Teachers
- One-to-many with Students
- One-to-many with ClassRooms
- One-to-many with Courses
- One-to-many with Buses

### 2. Manager
Represents school administrators.

**Fields:**
- `id` (Int, Primary Key)
- `firstName` (String)
- `lastName` (String)
- `email` (String, Unique)
- `password` (String)
- `phone` (String, Optional)
- `imageUrl` (String, Optional)
- `notes` (String, Optional)
- `bod` (DateTime, Optional)
- `educationLevel` (EducationLevel, Optional)
- `universityDegree` (String, Optional)
- `yearsOfExperience` (Int, Optional)
- `isActive` (Boolean, Default: true)
- `gender` (Gender)
- `organizationId` (Int, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relations:**
- Many-to-one with Organization

### 3. Teacher
Represents teaching staff.

**Fields:**
- `id` (Int, Primary Key)
- `firstName` (String)
- `lastName` (String)
- `email` (String, Unique)
- `password` (String)
- `salaryPerSession` (Float)
- `phone` (String, Optional)
- `imageUrl` (String, Optional)
- `notes` (String, Optional)
- `bod` (DateTime, Optional)
- `educationLevel` (EducationLevel, Optional)
- `universityDegree` (String, Optional)
- `yearsOfExperience` (Int, Optional)
- `isActive` (Boolean, Default: true)
- `gender` (Gender)
- `sessionsCountInMonth` (Int, Default: 0)
- `organizationId` (Int, Foreign Key)
- `subjectId` (Int, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relations:**
- Many-to-one with Organization
- Many-to-one with Subject
- One-to-many with Courses
- One-to-many with SessionPayments

### 4. Student
Represents enrolled students.

**Fields:**
- `id` (Int, Primary Key)
- `firstName` (String)
- `lastName` (String)
- `bod` (DateTime, Optional)
- `notes` (String, Optional)
- `lng` (Float, Optional)
- `lat` (Float, Optional)
- `imageUrl` (String, Optional)
- `gender` (Gender)
- `organizationId` (Int, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relations:**
- Many-to-one with Organization
- Many-to-many with Courses (through CourseStudent)
- Many-to-many with Buses (through BusStudent)
- One-to-many with StudentAttendance

### 5. Subject
Represents academic subjects.

**Fields:**
- `id` (Int, Primary Key)
- `name` (String, Unique)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relations:**
- One-to-many with Teachers

### 6. ClassRoom
Represents physical classrooms.

**Fields:**
- `id` (Int, Primary Key)
- `title` (String)
- `hasProjector` (Boolean, Default: false)
- `organizationId` (Int, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relations:**
- Many-to-one with Organization
- One-to-many with Courses

### 7. Course
Represents academic courses.

**Fields:**
- `id` (Int, Primary Key)
- `title` (String)
- `startDate` (DateTime)
- `endDate` (DateTime)
- `days` (String[], Array of day names)
- `startTime` (String, Time format)
- `endTime` (String, Time format)
- `organizationId` (Int, Foreign Key)
- `teacherId` (Int, Foreign Key)
- `classRoomId` (Int, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relations:**
- Many-to-one with Organization
- Many-to-one with Teacher
- Many-to-one with ClassRoom
- Many-to-many with Students (through CourseStudent)
- One-to-many with CourseSessions

### 8. Bus
Represents school transportation.

**Fields:**
- `id` (Int, Primary Key)
- `driverName` (String)
- `carNumber` (String)
- `carModel` (String)
- `startTime` (String, Time format)
- `startLng` (Float, Optional)
- `startLat` (Float, Optional)
- `organizationId` (Int, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relations:**
- Many-to-one with Organization
- Many-to-many with Students (through BusStudent)

### 9. CourseSession
Represents individual class sessions.

**Fields:**
- `id` (Int, Primary Key)
- `title` (String)
- `duration` (Int, Duration in minutes)
- `courseId` (Int, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relations:**
- Many-to-one with Course
- One-to-many with StudentAttendance
- One-to-many with SessionPayments

### 10. StudentAttendance
Represents student attendance records.

**Fields:**
- `id` (Int, Primary Key)
- `attendanceType` (AttendanceType: ATTEND, ABSENT, DELAY)
- `studentId` (Int, Foreign Key)
- `sessionId` (Int, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relations:**
- Many-to-one with Student
- Many-to-one with CourseSession

### 11. SessionPayment
Represents teacher payments for sessions.

**Fields:**
- `id` (Int, Primary Key)
- `amount` (Float)
- `teacherId` (Int, Foreign Key)
- `sessionId` (Int, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Relations:**
- Many-to-one with Teacher
- Many-to-one with CourseSession

### 12. CourseStudent (Join Table)
Many-to-many relationship between Courses and Students.

### 13. BusStudent (Join Table)
Many-to-many relationship between Buses and Students.

## Enums

### EducationLevel
- `BACHELORS`
- `UNIVERSITY`
- `MASTERS`
- `DOCTORATE`

### Gender
- `MALE`
- `FEMALE`

### AttendanceType
- `ATTEND`
- `ABSENT`
- `DELAY`

## API Endpoints

### Authentication Endpoints

#### 1. Organization Authentication
- **POST** `/auth/organization/register` - Register a new organization
- **POST** `/auth/organization/login` - Login organization
- **GET** `/auth/organization/profile` - Get organization profile

#### 2. Manager Authentication
- **POST** `/auth/manager/login` - Login manager
- **GET** `/auth/manager/profile` - Get manager profile

#### 3. Teacher Authentication
- **POST** `/auth/teacher/login` - Login teacher
- **GET** `/auth/teacher/profile` - Get teacher profile

### Management Endpoints

#### Students
- **POST** `/students` - Create a new student
- **GET** `/students` - Get all students for organization
- **GET** `/students/:id` - Get student by ID
- **GET** `/students/:id/courses` - Get courses for a student
- **GET** `/students/:id/attendance-summary` - Get attendance summary for a student
- **PATCH** `/students/:id` - Update a student
- **DELETE** `/students/:id` - Delete a student

**Response Structure:**
```json
{
  "id": 1,
  "firstName": "Alice",
  "lastName": "Johnson",
  "bod": "2010-05-15",
  "notes": "Excellent student",
  "lng": -74.006,
  "lat": 40.7128,
  "imageUrl": "https://example.com/image.jpg",
  "gender": "FEMALE",
  "organizationId": 1,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### Teachers
- **POST** `/teachers` - Create a new teacher
- **GET** `/teachers` - Get all teachers for organization
- **GET** `/teachers/:id` - Get teacher by ID
- **GET** `/teachers/:id/courses` - Get courses assigned to a teacher
- **PATCH** `/teachers/:id` - Update a teacher
- **DELETE** `/teachers/:id` - Delete a teacher

**Response Structure:**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@school.com",
  "salaryPerSession": 50.0,
  "phone": "+1234567890",
  "imageUrl": "https://example.com/image.jpg",
  "notes": "Excellent teaching skills",
  "bod": "1990-01-01",
  "educationLevel": "MASTERS",
  "universityDegree": "Master of Science in Mathematics",
  "yearsOfExperience": 5,
  "isActive": true,
  "gender": "MALE",
  "sessionsCountInMonth": 20,
  "organizationId": 1,
  "subjectId": 1,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "subject": {
    "id": 1,
    "name": "Mathematics"
  }
}
```

#### Managers
- **POST** `/managers` - Create a new manager
- **GET** `/managers` - Get all managers for organization
- **GET** `/managers/:id` - Get manager by ID
- **PATCH** `/managers/:id` - Update a manager
- **DELETE** `/managers/:id` - Delete a manager

**Response Structure:**
```json
{
  "id": 1,
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@school.com",
  "phone": "+1234567890",
  "imageUrl": "https://example.com/image.jpg",
  "notes": "Experienced administrator",
  "bod": "1985-01-01",
  "educationLevel": "MASTERS",
  "universityDegree": "Master of Education Administration",
  "yearsOfExperience": 10,
  "isActive": true,
  "gender": "FEMALE",
  "organizationId": 1,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### Subjects
- **POST** `/subjects` - Create a new subject
- **GET** `/subjects` - Get all subjects
- **GET** `/subjects/:id` - Get subject by ID
- **PATCH** `/subjects/:id` - Update a subject
- **DELETE** `/subjects/:id` - Delete a subject

#### Classrooms
- **POST** `/classrooms` - Create a new classroom
- **GET** `/classrooms` - Get all classrooms for organization
- **GET** `/classrooms/:id` - Get classroom by ID
- **PATCH** `/classrooms/:id` - Update a classroom
- **DELETE** `/classrooms/:id` - Delete a classroom

#### Courses
- **POST** `/courses` - Create a new course
- **GET** `/courses` - Get all courses for organization
- **GET** `/courses/my-courses` - Get courses for current teacher
- **GET** `/courses/:id` - Get course by ID with full details
- **PATCH** `/courses/:id` - Update a course
- **DELETE** `/courses/:id` - Delete a course

#### Buses
- **POST** `/buses` - Create a new bus
- **GET** `/buses` - Get all buses for organization
- **GET** `/buses/:id` - Get bus by ID with students list and locations
- **PATCH** `/buses/:id` - Update a bus
- **DELETE** `/buses/:id` - Delete a bus

#### Course Sessions
- **POST** `/course-sessions` - Create a new course session
- **GET** `/course-sessions` - Get all course sessions for organization
- **GET** `/course-sessions/:id` - Get course session by ID
- **PATCH** `/course-sessions/:id` - Update a course session
- **DELETE** `/course-sessions/:id` - Delete a course session
- **POST** `/course-sessions/:id/payments` - Create payment record for session
- **GET** `/course-sessions/:id/payments` - Get all payments for a session

#### Student Attendance
- **POST** `/student-attendance` - Create a new attendance record
- **POST** `/student-attendance/bulk` - Create multiple attendance records
- **GET** `/student-attendance` - Get all attendance records for organization
- **GET** `/student-attendance/session/:sessionId` - Get attendance for specific session
- **GET** `/student-attendance/:id` - Get attendance record by ID
- **PATCH** `/student-attendance/:id` - Update an attendance record
- **DELETE** `/student-attendance/:id` - Delete an attendance record

### Reports & Analytics

#### Dashboard
- **GET** `/reports/dashboard` - Get consolidated dashboard data
- **GET** `/reports/students-count` - Get students count
- **GET** `/reports/teachers-count` - Get teachers count
- **GET** `/reports/courses-count` - Get courses count
- **GET** `/reports/classrooms-count` - Get classrooms count
- **GET** `/reports/buses-count` - Get buses count
- **GET** `/reports/attendance-evolution` - Get attendance evolution data
- **GET** `/reports/attendance-by-course` - Get attendance data by course
- **GET** `/reports/teacher-sessions-summary` - Get teacher sessions summary

**Dashboard Response Structure:**
```json
{
  "metrics": {
    "coursesCount": 15,
    "studentsCount": 120,
    "teachersCount": 8,
    "classRoomsCount": 10,
    "busesCount": 3,
    "activeTeachersCount": 7,
    "inactiveTeachersCount": 1
  },
  "attendanceEvolution": [
    {
      "date": "2024-01-15",
      "attendanceRate": 85.5,
      "totalSessions": 20,
      "attendedSessions": 17
    }
  ],
  "courseAttendance": [
    {
      "courseId": 1,
      "courseTitle": "Advanced Mathematics",
      "averageAttendanceRate": 88.5,
      "totalSessions": 25
    }
  ],
  "teacherSessionsSummary": [
    {
      "teacherId": 1,
      "teacherName": "John Doe",
      "sessionsCountThisMonth": 20,
      "totalPaymentsThisMonth": 1000.0
    }
  ]
}
```

### Utility Endpoints

#### Seeder
- **POST** `/seeder/seed` - Seed the database with sample data

## Authentication Response Structure

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "name": "John Doe",
    "role": "MEMBER"
  }
}
```

## Error Responses

### Common Error Codes
- `400` - Bad Request (Invalid input data)
- `401` - Unauthorized (Invalid or missing JWT token)
- `404` - Not Found (Resource not found)
- `409` - Conflict (Resource already exists)

### Error Response Structure
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Authorization Levels

### Organization Manager
- Full access to all organization resources
- Can manage students, teachers, managers, courses, classrooms, buses
- Can view reports and analytics

### Teacher
- Limited access to assigned courses
- Can view their own courses and sessions
- Cannot modify other users' data

### Manager
- Can manage organization resources
- Cannot access other organizations' data

## Rate Limiting
No specific rate limiting is implemented in the current version.

## API Versioning
Current version: v1.0

## Swagger Documentation
Interactive API documentation is available at:
```
http://localhost:3000/api
```

## Database
- **Type:** PostgreSQL
- **ORM:** Prisma
- **Connection:** Configured via `DATABASE_URL` environment variable

## Development Setup
1. Install dependencies: `npm install`
2. Set up environment variables
3. Run database migrations: `npx prisma migrate dev`
4. Start the server: `npm run start:dev`
5. Access Swagger docs at: `http://localhost:3000/api`

## Security Features
- JWT-based authentication
- Role-based authorization
- Input validation with class-validator
- Password hashing with bcrypt
- CORS enabled
- Helmet for security headers
