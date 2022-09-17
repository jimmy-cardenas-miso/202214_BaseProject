import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/interceptor';
import { CitySupermarketService } from './city-supermarket.service';
import { plainToInstance } from 'class-transformer';
import { Supermarket } from '../supermarket/supermarket.entity';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CitySupermarketController {
  constructor(
    private readonly citySupermarketService: CitySupermarketService,
  ) {}

  @Post(':cityId/supermarkets/:supermarketId')
  async addSupermarketToCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    return await this.citySupermarketService.addSupermarketToCity(
      cityId,
      supermarketId,
    );
  }

  @Get(':cityId/supermarkets')
  async findSupermarketsFromCity(@Param('cityId') cityId: string) {
    return await this.citySupermarketService.findSupermarketsFromCity(cityId);
  }

  @Get(':cityId/supermarkets/:supermarketId')
  async findSupermarketFromCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    return await this.citySupermarketService.findSupermarketFromCity(
      cityId,
      supermarketId,
    );
  }

  @Put(':cityId/supermarkets')
  async updateSupermarketsFromCity(
    @Param('cityId') cityId: string,
    @Body() supermarketDTO: Supermarket[],
  ) {
    const supermarkets: Supermarket[] = plainToInstance(
      Supermarket,
      supermarketDTO,
    );
    return await this.citySupermarketService.updateSupermarketFromCity(
      cityId,
      supermarkets,
    );
  }

  @Delete(':cityId/supermarkets/:supermarketId')
  async deleteSupermarketFromCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    return await this.citySupermarketService.deleteSupermarketFromCity(
      cityId,
      supermarketId,
    );
  }
}
