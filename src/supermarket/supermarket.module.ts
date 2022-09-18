import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supermarket } from './supermarket.entity';
import { SupermarketService } from './supermarket.service';
import { SupermarketController } from './supermarket.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Supermarket])],
  providers: [SupermarketService],
  controllers: [SupermarketController],
})
export class SupermarketModule {}
