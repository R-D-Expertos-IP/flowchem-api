import { Module } from '@nestjs/common';
import { CWalletsController } from './controllers/wallets.controller';
import { SWalletsService } from './services/wallets.service';
import { SExcelService } from './services/excels.sercice';
import { RWalletRepository } from './repositories/wallets.repo';

@Module({
  controllers: [CWalletsController],
  providers: [SWalletsService, SExcelService, RWalletRepository],
})
export class WalletsModule {}
