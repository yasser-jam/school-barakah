import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins
  app.enableCors({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('School Management System API')
    .setDescription(
      'Comprehensive API documentation for the School Management System - A SaaS application for managing schools, teachers, students, courses, attendance, and more.',
    )
    .setVersion('1.0')
    .addTag('Organization Auth', 'Organization authentication endpoints')
    .addTag('Manager Auth', 'Manager authentication endpoints')
    .addTag('Teacher Auth', 'Teacher authentication endpoints')
    .addTag('Subjects', 'Subject management (global subjects)')
    .addTag('Teachers', 'Teacher management and operations')
    .addTag('Managers', 'Manager management and operations')
    .addTag('Students', 'Student management and operations')
    .addTag('ClassRooms', 'Classroom management')
    .addTag('Courses', 'Course management with student assignments')
    .addTag('Buses', 'Bus management with student assignments')
    .addTag('Course Sessions', 'Course session management and payment tracking')
    .addTag('Student Attendance', 'Attendance tracking and management')
    .addTag('Reports', 'Dashboard and analytics reports')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token for authentication',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // ✅ Use CDN-based Swagger UI to avoid missing assets on Vercel
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customJs: [
      'https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js',
    ],
    customCssUrl: 'https://unpkg.com/swagger-ui-dist/swagger-ui.css',
    customSiteTitle: 'School Management System API Docs',
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 School Management System API is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📚 API Documentation available at: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
bootstrap();
