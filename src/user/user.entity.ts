import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('users')
@Unique(['id'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'user_uuid' })
  uuid: string;

  @Column()
  id: string;

  @Column()
  pw: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @CreateDateColumn({ name: 'created_time', type: 'timestamp with time zone' })
  createdTime: Date;
}
