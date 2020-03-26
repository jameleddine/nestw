import { CustomHttpExceptionFilter } from './filters/custom-http-exception.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  app.useGlobalFilters(new CustomHttpExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('WADAPP api documentation')
    .setDescription('')
    .setVersion('1.0')
    .addTag('wadapp')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
