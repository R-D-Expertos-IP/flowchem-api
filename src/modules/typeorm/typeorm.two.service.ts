import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Servicio de configuración de TypeORM para el sistema FlowChemical.
 * Este servicio implementa la interfaz TypeOrmOptionsFactory y proporciona la configuración de TypeORM para la base de datos secundaria.
 * @author Santiago Ruiz  - desarrollo3@expertosip.com
 * @copyright ExpertosIp 2024
 */
@Injectable()
export class SecondTypeormService implements TypeOrmOptionsFactory {
  private readonly logger = new Logger(SecondTypeormService.name);

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const options = {
      type: 'mssql' as const,
      host: process.env.SECOND_DB_HOST,
      username: process.env.SECOND_DB_USERNAME,
      password: process.env.SECOND_DB_PASSWORD,
      port: Number(process.env.SECOND_DB_PORT),
      database: process.env.SECOND_DB_DATABASE,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      retryAttempts: 3,
      extra: {
        encrypt: false,
        trustServerCertificate: true,
      },
    };

    this.logger.log(
      `Conectado a la segunda base de datos: ${process.env.SECOND_DB_DATABASE}`,
    );
    return options;
  }
}
