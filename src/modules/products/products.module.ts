import { Module } from '@nestjs/common';
import { CProductsController } from './controllers/products.controller';
import { SProductsService } from './services/products.service';
import { RProductRepository } from './repositories/products.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EProduct } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EProduct])],
  controllers: [CProductsController],
  providers: [SProductsService, RProductRepository],
  exports: [RProductRepository, TypeOrmModule],
})
export class ProductsModule {}
