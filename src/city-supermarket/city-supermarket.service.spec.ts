/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Supermarket } from '../supermarket/supermarket.entity';
import { Repository } from 'typeorm';
import { City } from '../city/city.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CitySupermarketService } from './city-supermarket.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CitySupermarketService', () => {
  let service: CitySupermarketService;
  let cityRepository: Repository<City>;
  let supermarketRepository: Repository<Supermarket>;
  let city: City;
  let supermarketsList: Supermarket[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CitySupermarketService],
    }).compile();

    service = module.get<CitySupermarketService>(CitySupermarketService);
    cityRepository = module.get<Repository<City>>(
      getRepositoryToken(City),
    );
    supermarketRepository = module.get<Repository<Supermarket>>(
      getRepositoryToken(Supermarket),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    supermarketRepository.clear();
    cityRepository.clear();

    supermarketsList = [];
    for (let i = 0; i < 5; i++) {
      const supermarket: Supermarket = await supermarketRepository.save({
        name: faker.word.adjective(),
        description: faker.lorem.sentence(),
        history: faker.lorem.sentence(),
      });
      supermarketsList.push(supermarket);
    }

    city = await cityRepository.save({
      name: faker.word.adjective(),
      supermarkets: supermarketsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('associateSupermarketCity should add an supermarket to a city', async () => {
    const newSupermarket: Supermarket = await supermarketRepository.save({
      name: faker.word.adjective(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
    });

    const newCity: City = await cityRepository.save({
      name: faker.word.adjective(),
    });

    const result: City = await service.addSupermarketToCity(
      newCity.id,
      newSupermarket.id,
    );

    expect(result.supermarkets.length).toBe(1);
    expect(result.supermarkets[0]).not.toBeNull();
    expect(result.supermarkets[0].name).toBe(newSupermarket.name);
    expect(result.supermarkets[0].description).toBe(newSupermarket.description);
    expect(result.supermarkets[0].history).toBe(newSupermarket.history);
  });

  it('associateSupermarketCity should thrown exception for an invalid supermarket', async () => {
    const newCity: City = await cityRepository.save({
      name: faker.word.adjective(),
    });

    await expect(() =>
      service.addSupermarketToCity(newCity.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('disassociateSupermarketCity should add an supermarket to a city', async () => {
    const newSupermarket: Supermarket = await supermarketRepository.save({
      name: faker.word.adjective(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
    });

    const newCity: City = await cityRepository.save({
      name: faker.word.adjective(),
    });

    const result: City = await service.disassociateSupermarketCity(
      newCity.id,
      newSupermarket.id,
    );

    expect(result.supermarkets.length).toBe(0);
  });

  it('disassociateSupermarketCity should thrown exception for an invalid supermarket', async () => {
    const newCity: City = await cityRepository.save({
      name: faker.word.adjective(),
    });

    await expect(() =>
      service.addSupermarketToCity(newCity.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });
});
