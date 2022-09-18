import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from '../city/city.entity';

@Entity()
export class Supermarket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  longitude: string;

  @Column()
  latitude: string;

  @Column()
  web_page: string;

  @ManyToMany(() => City, (city) => city.supermarkets)
  @JoinTable()
  cities: City[];
}
