import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CProdCertificatesController } from './controllers/prod-certificates.controller';
import { SProdCertificatesService } from './services/prod-certificates.service';
import { RProdCertificateRepository } from './repositories/prod-certificates.repo';

@Module({
  imports: [ConfigModule],
  controllers: [CProdCertificatesController],
  providers: [SProdCertificatesService, RProdCertificateRepository],
})
export class ProdCertificatesModule {}
