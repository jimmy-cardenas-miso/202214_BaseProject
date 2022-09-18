import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitySupermarketService } from './city-supermarket.service';
import { CitySupermarketController } from './city-supermarket.controller';
import { Supermarket } from '../supermarket/supermarket.entity';
import { City } from '../city/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supermarket, City])],
  providers: [CitySupermarketService],
  controllers: [CitySupermarketController],
})
export class CitySupermarketModule {}
