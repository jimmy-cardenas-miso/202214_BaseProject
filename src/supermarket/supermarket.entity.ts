import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Supermarket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  longitude: number;

  @Column()
  latitude: number;

  @Column()
  web_page: string;
}
