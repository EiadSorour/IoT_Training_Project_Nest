import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppExceptionFilter } from './utils/app.ExceptionFilter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create server
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS in server to allow frontend make calls to our server
  app.enableCors({
    origin: "*"
  });

  // Use global filters (we will use our custom AppExceptionFilter)
  app.useGlobalFilters(new AppExceptionFilter());

  // Use global pipes (This will help validating DTOs that we get from any request contains body ex: POST requests )
  app.useGlobalPipes(new ValidationPipe({whitelist:true}));

  // Make server listen on port 3001
  await app.listen(3001);
}
bootstrap();
