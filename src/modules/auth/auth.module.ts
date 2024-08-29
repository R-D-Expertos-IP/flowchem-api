import { Module } from '@nestjs/common';
import { CAuthController } from './controllers/auth.controller';
import { SAuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { BcryptModule } from '../bcrypt/bcrypt.module';
import { RAuthRepository } from './repositories/auth.repo';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    UsersModule,
    BcryptModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [CAuthController],
  providers: [SAuthService, RAuthRepository],
})
export class AuthModule {}
