import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import * as chalk from 'chalk';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api/');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: true,
      transform: true,
      skipMissingProperties: true,
    }),
  );

 app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Servir archivos estáticos desde la carpeta 'src/resources'
  app.useStaticAssets(path.join(__dirname, '..', 'src/resources'));

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth() // Si estás usando autenticación JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000; // Añadir un valor por defecto
  await app.listen(port);

  Logger.log(
    chalk.bold.blue(process.env.APPLICATION_NAME) +
      chalk.bold.yellow(' Running On Port ') +
      chalk.bold.green(`http://localhost:${port}`),
    'Bootstrap',
  );

  Logger.log(
    chalk.bold.cyan('Empresa: Expertos Ip') +
      chalk.bold.magenta(' Email: desarrollo3@expertosip.com'),
    'Información de la empresa',
  );

  Logger.log(
    chalk.bold.green('¡La aplicación se ejecutó exitosamente...!'),
    'Éxito',
  );
}
bootstrap();
