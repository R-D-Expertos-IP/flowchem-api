import { CUsersController } from './controllers/users.controller';
import { Module } from '@nestjs/common';
import { SUsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EUser } from './entities/user.entity';
import { RUserRepository } from './repositories/user.repo';
import { BcryptModule } from '../bcrypt/bcrypt.module';

@Module({
  imports: [TypeOrmModule.forFeature([EUser]), BcryptModule],
  controllers: [CUsersController],
  providers: [SUsersService, RUserRepository],
  exports: [RUserRepository, TypeOrmModule],
})
export class UsersModule {}
