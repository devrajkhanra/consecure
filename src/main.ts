import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Create the Swagger Configuration
  const config = new DocumentBuilder().setTitle('Consecure API').setDescription('API Description').setVersion('1.0').build();

  // Generate the document
  const document = SwaggerModule.createDocument(app, config);

  // Setup the Swagger module (optional, but good for quick checking)
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
