import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/interceptor';
import { SupermarketDTO } from './supermarket.dto';
import { Supermarket } from './supermarket.entity';
import { SupermarketService } from './supermarket.service';

@Controller('supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermarketController {
  constructor(private readonly supermarketService: SupermarketService) {}

  @Get()
  async findAll() {
    return await this.supermarketService.findAll();
  }

  @Get(':supermarketId')
  async findOne(@Param('supermarketId') supermarketId: string) {
    return await this.supermarketService.findOne(supermarketId);
  }

  @Post()
  async create(@Body() supermarketDTO: SupermarketDTO) {
    const supermarket: Supermarket = plainToInstance(Supermarket, supermarketDTO);
    return await this.supermarketService.create(supermarket);
  }

  @Put(':supermarketId')
  async update(@Param('supermarketId') supermarketId: string, @Body() supermarketDTO: SupermarketDTO) {
    const supermarket: Supermarket = plainToInstance(Supermarket, supermarketDTO);
    return await this.supermarketService.update(supermarketId, supermarket);
  }

  @Delete(':supermarketId')
  @HttpCode(204)
  async delete(@Param('supermarketId') supermarketId: string) {
    return await this.supermarketService.delete(supermarketId);
  }
}
