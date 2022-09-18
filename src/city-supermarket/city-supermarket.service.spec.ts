import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { City } from '../city/city.entity';
import { Supermarket } from '../supermarket/supermarket.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CitySupermarketService } from './city-supermarket.service';
import { SupermarketDTO } from '../supermarket/supermarket.dto';

describe('SupermarketCityService', () => {
  let service: CitySupermarketService;
  let cityRepository: Repository<City>;
  let supermarketRepository: Repository<Supermarket>;
  let city: City;
  let cityList: City[];
  let supermarket: Supermarket;
  let supermarketList: Supermarket[];

  function getRandom(array: any): any {
    return array[Math.floor(Math.random() * array.length)];
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CitySupermarketService],
    }).compile();

    service = module.get<CitySupermarketService>(CitySupermarketService);
    supermarketRepository = module.get<Repository<Supermarket>>(
      getRepositoryToken(Supermarket),
    );
    cityRepository = module.get<Repository<City>>(getRepositoryToken(City));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    supermarketRepository.clear();
    cityRepository.clear();
    cityList = [];
    supermarketList = [];

    for (let i = 0; i < 3; i++) {
      const city: City = new City();
      city.id = '';
      city.name = faker.address.city();
      city.country = getRandom(['Argentina', 'Ecuador', 'Paraguay']);
      city.population = +faker.random.numeric(2);
      city.supermarkets = [];
      const storedCity = await cityRepository.save(city);
      cityList.push(storedCity);

      const supermarket: Supermarket = new Supermarket();
      supermarket.id = '';
      supermarket.name = faker.word.adjective(12);
      supermarket.longitude = faker.address.longitude();
      supermarket.latitude = faker.address.latitude();
      supermarket.web_page = faker.internet.url();
      supermarket.cities = [];
      const storedSupermarket = await supermarketRepository.save(supermarket);
      supermarketList.push(storedSupermarket);
    }

    city = cityList[0];
    supermarket = supermarketList[0];
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketToCity should add an Supermarket to a City', async () => {
    const updatedSupermarket = await service.addSupermarketToCity(
      city.id,
      supermarket.id,
    );
    expect(updatedSupermarket).not.toBeNull();
    expect(updatedSupermarket.supermarkets.length).toBe(1);
  });

  it('addSupermarketToCity should thrown exception for an invalid city', async () => {
    await expect(() =>
      service.addSupermarketToCity('0', supermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('findSupermarketsFromCity should return Supermarkets by City', async () => {
    const storedSupermarket: Supermarket[] =
      await service.findSupermarketsFromCity(city.id);
    expect(storedSupermarket).not.toBeNull();
  });

  it('findSupermarketsFromCity should throw an exception for an invalid City', async () => {
    await expect(() =>
      service.findSupermarketsFromCity('0'),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('findSupermarketFromCity should return Supermarket by City', async () => {
    await service.addSupermarketToCity(city.id, supermarket.id);
    const storedSupermarket: SupermarketDTO =
      await service.findSupermarketFromCity(city.id, supermarket.id);
    expect(storedSupermarket).not.toBeNull();
  });

  it('findSupermarketFromCity should throw an exception for an invalid City', async () => {
    await expect(() =>
      service.findSupermarketFromCity('0', supermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('findSupermarketFromCity should throw an exception for an invalid Supermarket', async () => {
    await expect(() =>
      service.findSupermarketFromCity(city.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('findSupermarketFromCity should throw an exception for an invalid Supermarket and City', async () => {
    const supermarket = await supermarketRepository.save({
      name: faker.word.adjective(12),
      longitude: faker.address.longitude(),
      latitude: faker.address.latitude(),
      web_page: faker.internet.url(),
      cities: [],
    });

    await expect(() =>
      service.findSupermarketFromCity(city.id, supermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket not is associate with the given city',
    );
  });

  it('updateSupermarketsFromCity should update Supermarket by City', async () => {
    await service.addSupermarketToCity(city.id, supermarket.id);
    const storedCity: City = await service.updateSupermarketFromCity(
      city.id,
      supermarketList,
    );
    expect(storedCity).not.toBeNull();
    expect(storedCity.supermarkets.length).toBe(supermarketList.length);
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid City', async () => {
    await expect(() =>
      service.updateSupermarketFromCity('0', supermarketList),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('updateSupermarketsFromCity should throw an exception for an invalid supermarket', async () => {
    const newSupermarketList = [];
    newSupermarketList.push({
      id: '18fab0d8-188e-4358-9694-bf48cf77ef' + faker.random.numeric(2),
      name: faker.word.adjective(12),
      longitude: faker.address.longitude(),
      latitude: faker.address.latitude(),
      web_page: faker.internet.url(),
    });

    try {
      await service.updateSupermarketFromCity(city.id, newSupermarketList);
    } catch (e) {
      expect(e?.['message']).toEqual(
        `The supermarket with the given id ${newSupermarketList[0].id} was not found`,
      );
    }
  });

  it('deleteSupermarketFromCity should remove a supermarket from city', async () => {
    const supermarket: Supermarket = supermarketList[0];
    await service.deleteSupermarketFromCity(city.id, supermarket.id);

    const storedCity = await cityRepository.findOne({
      where: { id: city.id },
      relations: ['supermarkets'],
    });
    const deletedSupermarket = storedCity.supermarkets.find(
      (a) => a.id === supermarket.id,
    );
    expect(deletedSupermarket).toBeUndefined();
  });

  it('deleteSupermarketFromCity should thrown an exception for an invalid supermarket', async () => {
    await expect(() =>
      service.deleteSupermarketFromCity(city.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('deleteSupermarketFromCity should thrown an exception for an invalid city', async () => {
    const supermarket: Supermarket = supermarketList[0];
    await expect(() =>
      service.deleteSupermarketFromCity('0', supermarket.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('deleteSupermarketFromCity should throw an exception for an invalid Supermarket and City', async () => {
    const supermarket = await supermarketRepository.save({
      id: '18fab0d8-188e-4358-9694-bf48cf77ef' + faker.random.numeric(2),
      name: faker.word.adjective(12),
      longitude: faker.address.longitude(),
      latitude: faker.address.latitude(),
      web_page: faker.internet.url(),
    });

    try {
      await service.deleteSupermarketFromCity(city.id, supermarket.id);
    } catch (e) {
      expect(e?.['message']).toEqual(
        'The supermarket with the given id is not associated to the city',
      );
    }
  });
});
