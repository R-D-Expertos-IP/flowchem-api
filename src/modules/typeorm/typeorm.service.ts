import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Servicio de configuración de TypeORM para el sistema FlowChemical.
 * Este servicio implementa la interfaz TypeOrmOptionsFactory y proporciona la configuración de TypeORM para la base de datos principal.
 * @author Santiago Ruiz  - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
  private readonly logger = new Logger(TypeormService.name);

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const options = {
      type: 'mssql' as const,
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      retryAttempts: 3,
      synchronize: true,
      extra: {
        encrypt: false,
        trustServerCertificate: true,
      },
    };

    this.logger.log(`Conectado a la base de datos: ${process.env.DB_DATABASE}`);
    return options;
  }
}
