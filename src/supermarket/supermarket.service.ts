import { Injectable } from '@nestjs/common';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { SupermarketDTO } from './supermarket.dto';
import { Supermarket } from './supermarket.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SupermarketService {
  constructor(
    @InjectRepository(Supermarket)
    private readonly supermarketRepository: Repository<Supermarket>,
  ) {}

  async findAll(): Promise<SupermarketDTO[]> {
    return await this.supermarketRepository.find({ loadRelationIds: true });
  }

  async findOne(id: string): Promise<SupermarketDTO> {
    const supermarket = await this.supermarketRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
    if (!supermarket)
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return supermarket;
  }

  async create(supermarketDTO: SupermarketDTO): Promise<SupermarketDTO> {
    const supermarket = new Supermarket();

    if (!isValidLength(supermarketDTO.name))
      throw new BusinessLogicException(
        'The supermarket name has less than 10 characters',
        BusinessError.BAD_REQUEST,
      );

    supermarket.name = supermarketDTO.name;
    supermarket.longitude = supermarketDTO.longitude;
    supermarket.latitude = supermarketDTO.latitude;
    supermarket.web_page = supermarketDTO.web_page;

    return await this.supermarketRepository.save(supermarket);
  }

  async update(
    id: string,
    supermarketDTO: SupermarketDTO,
  ): Promise<SupermarketDTO> {
    const supermarket = await this.supermarketRepository.findOne({
      where: { id },
    });
    if (!supermarket)
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    if (!isValidLength(supermarketDTO.name))
      throw new BusinessLogicException(
        'The supermarket name has less than 10 characters',
        BusinessError.BAD_REQUEST,
      );

    supermarket.name = supermarketDTO.name;
    supermarket.longitude = supermarketDTO.longitude;
    supermarket.latitude = supermarketDTO.latitude;
    supermarket.web_page = supermarketDTO.web_page;

    await this.supermarketRepository.save(supermarket);
    return supermarket;
  }

  async delete(id: string) {
    const supermarket = await this.supermarketRepository.findOne({
      where: { id },
    });
    if (!supermarket)
      throw new BusinessLogicException(
        'The supermarket with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return await this.supermarketRepository.remove(supermarket);
  }
}

function isValidLength(supermarketName: string): boolean {
  return supermarketName.length > 10;
}
