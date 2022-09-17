import {
  Controller,
  Delete,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/interceptor';
import { CitySupermarketService } from './city-supermarket.service';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CitySupermarketController {
  constructor(
    private readonly citySupermarketService: CitySupermarketService,
  ) {}

  @Post(':cityId/supermarkets/:supermarketId')
  async addSupermarketCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    return await this.citySupermarketService.associateSupermarketCity(
      cityId,
      supermarketId,
    );
  }

  @Delete(':cityId/supermarkets/:supermarketId')
  async removeSupermarketCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    return await this.citySupermarketService.disassociateSupermarketCity(
      cityId,
      supermarketId,
    );
  }
}
