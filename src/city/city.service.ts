import { Injectable } from '@nestjs/common';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CityDTO } from './city.dto';
import { City } from './city.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async findAll(): Promise<CityDTO[]> {
    return await this.cityRepository.find({ loadRelationIds: true });
  }

  async findOne(id: string): Promise<CityDTO> {
    const city = await this.cityRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
    if (!city)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return city;
  }

  async create(cityDTO: CityDTO): Promise<CityDTO> {
    const city = new City();

    if (!isValidCity(cityDTO.country))
      throw new BusinessLogicException(
        'The city is not includes in Argentina, Ecuador or Paraguay',
        BusinessError.BAD_REQUEST,
      );

    city.name = cityDTO.name;
    city.country = cityDTO.country;
    city.population = cityDTO.population;

    return await this.cityRepository.save(city);
  }

  async update(id: string, cityDTO: CityDTO): Promise<CityDTO> {
    const city = await this.cityRepository.findOne({ where: { id } });
    if (!city)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    if (!isValidCity(cityDTO.country))
      throw new BusinessLogicException(
        'The city is not includes in Argentina, Ecuador or Paraguay',
        BusinessError.BAD_REQUEST,
      );

    city.name = cityDTO.name;
    city.country = cityDTO.country;
    city.population = cityDTO.population;

    await this.cityRepository.save(city);
    return city;
  }

  async delete(id: string) {
    const city = await this.cityRepository.findOne({ where: { id } });
    if (!city)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return await this.cityRepository.remove(city);
  }
}

function isValidCity(city: string): boolean {
  return ['Argentina', 'Ecuador', 'Paraguay'].includes(city);
}
