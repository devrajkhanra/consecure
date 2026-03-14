import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend requests with configurable origins
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3001', 'http://localhost:3000'];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api'); // Set global prefix to /api

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,               // Strips away fields not in the DTO
    forbidNonWhitelisted: true,    // Throws error if extra fields are sent
    transform: true,               // Automatically converts types
  }));

  // Create the Swagger Configuration with JWT auth
  const config = new DocumentBuilder()
    .setTitle('Consecure API')
    .setDescription('Enterprise-grade construction management API with RBAC')
    .setVersion('2.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  // Generate the document
  const document = SwaggerModule.createDocument(app, config);

  // Setup the Swagger module
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
