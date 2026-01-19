import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users_view') // Nombre exacto de la tabla en moodle_r
export class UserViewEntity {
  @PrimaryColumn({ name: 'user_id' })
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column()
  role: string;
}