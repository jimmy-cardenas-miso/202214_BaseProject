import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from '../../city/city.entity';
import { Supermarket } from '../../supermarket/supermarket.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [City, Supermarket],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([City, Supermarket]),
];
