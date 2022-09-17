import { Injectable } from '@nestjs/common';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from '../city/city.entity';
import { Supermarket } from '../supermarket/supermarket.entity';
import { SupermarketDTO } from '../supermarket/supermarket.dto';

@Injectable()
export class CitySupermarketService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,

    @InjectRepository(Supermarket)
    private readonly supermarketRepository: Repository<Supermarket>,
  ) {}

  async addSupermarketToCity(
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

  async findSupermarketsFromCity(id: string): Promise<Supermarket[]> {
    const city = await this.cityRepository.findOne({
      where: { id },
      relations: ['supermarkets'],
    });
    if (!city)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return city.supermarkets;
  }

  async findSupermarketFromCity(
    cityId: string,
    supermarketId: string,
  ): Promise<SupermarketDTO> {
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

    const supermarketFounded = city.supermarkets.find(
      (item) => item.id === supermarketId,
    );
    if (!supermarketFounded)
      throw new BusinessLogicException(
        'The supermarket not is associate with the given city',
        BusinessError.NOT_FOUND,
      );

    return supermarketFounded;
  }

  async updateSupermarketFromCity(
    cityId: string,
    supermarkets: Supermarket[],
  ): Promise<City> {
    const city: City = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });

    if (!city)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const updatedSupermarket: Supermarket[] = [];

    for (const supermarketEntity of supermarkets) {
      const supermarket: Supermarket = await this.supermarketRepository.findOne(
        {
          where: { id: supermarketEntity.id },
        },
      );
      if (!supermarket)
        throw new BusinessLogicException(
          `The supermarket with the given id ${supermarketEntity.id} was not found`,
          BusinessError.NOT_FOUND,
        );
      updatedSupermarket.push(supermarket);
    }

    city.supermarkets = updatedSupermarket;
    return await this.cityRepository.save(city);
  }

  async deleteSupermarketFromCity(
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
