import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Supermarket } from '../supermarket/supermarket.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  population: number;

  @ManyToMany(() => Supermarket, (supermarket) => supermarket.cities)
  @JoinTable()
  supermarkets: Supermarket[];
}
