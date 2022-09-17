import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { City } from './city.entity';
import { CityService } from './city.service';
import { faker } from '@faker-js/faker';
import { CityDTO } from './city.dto';

describe('CityService', () => {
  let service: CityService;
  let repository: Repository<City>;
  let cityList: City[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CityService],
    }).compile();

    service = module.get<CityService>(CityService);
    repository = module.get<Repository<City>>(getRepositoryToken(City));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    cityList = [];
    for (let i = 0; i < 5; i++) {
      const city = new City();
      city.name = faker.address.city();
      city.country = faker.address.country();
      city.population = +faker.random.numeric(2);
      await repository.save(city);
      cityList.push(city);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cities', async () => {
    const cities: CityDTO[] = await service.findAll();
    expect(cities).not.toBeNull();
    expect(cities).toHaveLength(cityList.length);
  });

  it('findOne should return a city by id', async () => {
    const storedCity: City = cityList[0];
    const city: CityDTO = await service.findOne(storedCity.id);
    expect(city).not.toBeNull();
    expect(city.name).toEqual(storedCity.name);
    expect(city.country).toEqual(storedCity.country);
    expect(city.population).toEqual(storedCity.population);
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('create should return a new city', async () => {
    const city: City = {
      id: '',
      name: faker.address.city(),
      country: faker.address.country(),
      population: +faker.random.numeric(2),
      supermarkets: [],
    };

    const newCity: CityDTO = await service.create(city);
    expect(newCity).not.toBeNull();
    const storedCity: CityDTO = await repository.findOne({
      where: { id: newCity.id },
    });
    expect(storedCity).not.toBeNull();
    expect(storedCity.name).toEqual(newCity.name);
  });

  it('update should modify a city', async () => {
    const city: City = cityList[0];
    city.name = faker.address.city();
    city.country = faker.address.country();
    city.population = +faker.random.numeric(2);

    const updatedCity: CityDTO = await service.update(city.id, city);
    expect(updatedCity).not.toBeNull();
    const storedCity: City = await repository.findOne({
      where: { id: city.id },
    });
    expect(storedCity).not.toBeNull();
    expect(storedCity.name).toEqual(city.name);
    expect(storedCity.country).toEqual(city.country);
    expect(storedCity.population).toEqual(city.population);
  });

  it('update should throw an exception for an invalid city', async () => {
    let city: City = cityList[0];
    city = {
      ...city,
      name: faker.address.city(),
      country: faker.address.country(),
      population: +faker.random.numeric(2),
    };
    await expect(() => service.update('0', city)).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('delete should remove a city', async () => {
    const city: City = cityList[0];
    await service.delete(city.id);
    const deletedCity: City = await repository.findOne({
      where: { id: city.id },
    });
    expect(deletedCity).toBeNull();
  });

  it('delete should throw an exception for an invalid city', async () => {
    const city: City = cityList[0];
    await service.delete(city.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });
});
