import { Injectable } from '@nestjs/common';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from '../city/city.entity';
import { Supermarket } from '../supermarket/supermarket.entity';

@Injectable()
export class CitySupermarketService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,

    @InjectRepository(Supermarket)
    private readonly supermarketRepository: Repository<Supermarket>,
  ) {}

  async associateSupermarketCity(
    cityId: string,
    supermarketId: string,
  ): Promise<City> {
    const supermarket: Supermarket = await this.supermarketRepository.findOne({
      where: { id: supermarketId },
    });

    if (!supermarket)
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const city: City = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });

    if (!city)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    city.supermarkets = [...city.supermarkets, supermarket];
    return await this.cityRepository.save(city);
  }

  async disassociateSupermarketCity(
    cityId: string,
    supermarketId: string,
  ): Promise<City> {
    const supermarket: Supermarket = await this.supermarketRepository.findOne({
      where: { id: supermarketId },
    });

    if (!supermarket)
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const city: City = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });

    if (!city)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    city.supermarkets = city.supermarkets.filter(
      (supermarket) => supermarket.id != supermarketId,
    );
    return await this.cityRepository.save(city);
  }
}
