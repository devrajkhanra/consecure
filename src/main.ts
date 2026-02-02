import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend requests
  app.enableCors();

  app.setGlobalPrefix('api'); // Set global prefix to /api

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,               // Strips away fields not in the DTO
    forbidNonWhitelisted: true,    // Throws error if extra fields are sent
    transform: true,               // Automatically converts types
  }));

  // Create the Swagger Configuration
  const config = new DocumentBuilder().setTitle('Consecure API').setDescription('API Description').setVersion('1.0').build();

  // Generate the document
  const document = SwaggerModule.createDocument(app, config);

  // Setup the Swagger module (optional, but good for quick checking)
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
