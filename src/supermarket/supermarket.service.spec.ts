import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { Supermarket } from './supermarket.entity';
import { SupermarketService } from './supermarket.service';
import { faker } from '@faker-js/faker';
import { SupermarketDTO } from './supermarket.dto';

describe('SupermarketService', () => {
  let service: SupermarketService;
  let repository: Repository<Supermarket>;
  let supermarketList: Supermarket[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermarketService],
    }).compile();

    service = module.get<SupermarketService>(SupermarketService);
    repository = module.get<Repository<Supermarket>>(getRepositoryToken(Supermarket));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermarketList = [];
    for (let i = 0; i < 5; i++) {
      const supermarket = new Supermarket();
      supermarket.name = faker.word.adjective();
      await repository.save(supermarket);
      supermarketList.push(supermarket);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all supermarkets', async () => {
    const supermarkets: SupermarketDTO[] = await service.findAll();
    expect(supermarkets).not.toBeNull();
    expect(supermarkets).toHaveLength(supermarketList.length);
  });

  it('findOne should return a supermarket by id', async () => {
    const storedSupermarket: Supermarket = supermarketList[0];
    const supermarket: SupermarketDTO = await service.findOne(storedSupermarket.id);
    expect(supermarket).not.toBeNull();
    expect(supermarket.name).toEqual(storedSupermarket.name);
  });

  it('findOne should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('create should return a new supermarket', async () => {
    const supermarket: Supermarket = {
      id: '',
      name: faker.word.adjective(),
      products: [],
    };

    const newSupermarket: SupermarketDTO = await service.create(supermarket);
    expect(newSupermarket).not.toBeNull();
    const storedSupermarket: SupermarketDTO = await repository.findOne({
      where: { id: newSupermarket.id },
    });
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toEqual(newSupermarket.name);
  });

  it('update should modify a supermarket', async () => {
    const supermarket: Supermarket = supermarketList[0];
    supermarket.name = 'New name';
    const updatedSupermarket: SupermarketDTO = await service.update(
      supermarket.id,
      supermarket,
    );
    expect(updatedSupermarket).not.toBeNull();
    const storedSupermarket: Supermarket = await repository.findOne({
      where: { id: supermarket.id },
    });
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toEqual(supermarket.name);
  });

  it('update should throw an exception for an invalid supermarket', async () => {
    let supermarket: Supermarket = supermarketList[0];
    supermarket = {
      ...supermarket,
      name: 'New name',
    };
    await expect(() => service.update('0', supermarket)).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('delete should remove a supermarket', async () => {
    const supermarket: Supermarket = supermarketList[0];
    await service.delete(supermarket.id);
    const deletedSupermarket: Supermarket = await repository.findOne({
      where: { id: supermarket.id },
    });
    expect(deletedSupermarket).toBeNull();
  });

  it('delete should throw an exception for an invalid supermarket', async () => {
    const supermarket: Supermarket = supermarketList[0];
    await service.delete(supermarket.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });
});
