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
import { CityDTO } from './city.dto';
import { City } from './city.entity';
import { CityService } from './city.service';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  async findAll() {
    return await this.cityService.findAll();
  }

  @Get(':cityId')
  async findOne(@Param('cityId') cityId: string) {
    return await this.cityService.findOne(cityId);
  }

  @Post()
  async create(@Body() cityDTO: CityDTO) {
    const city: City = plainToInstance(City, cityDTO);
    return await this.cityService.create(city);
  }

  @Put(':cityId')
  async update(@Param('cityId') cityId: string, @Body() cityDTO: CityDTO) {
    const city: City = plainToInstance(City, cityDTO);
    return await this.cityService.update(cityId, city);
  }

  @Delete(':cityId')
  @HttpCode(204)
  async delete(@Param('cityId') cityId: string) {
    return await this.cityService.delete(cityId);
  }
}
