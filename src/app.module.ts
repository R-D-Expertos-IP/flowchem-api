// Main module
import { Module } from '@nestjs/common';

// App modules
import { UsersModule } from './modules/users/users.module';

// App controllers
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { BcryptModule } from './modules/bcrypt/bcrypt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsModule } from './modules/wallets/wallets.module';
import { ProdCertificatesModule } from './modules/prod-certificates/prod-certificates.module';

// App services
import { AppService } from './app.service';
import { TypeormService } from './modules/typeorm/typeorm.service';
import { SecondTypeormService } from './modules/typeorm/typeorm.two.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeormService,
    }),
    TypeOrmModule.forRootAsync({
      useClass: SecondTypeormService,
      name: 'secondConnection',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/'),
    }),
    UsersModule,
    AuthModule,
    BcryptModule,
    ProductsModule,
    WalletsModule,
    ProdCertificatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
