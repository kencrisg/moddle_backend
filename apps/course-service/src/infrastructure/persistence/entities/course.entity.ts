import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('courses') // Nombre exacto de la tabla en Postgres
export class CourseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ name: 'video_url' }) // Mapeamos snake_case a camelCase
  videoUrl: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'created_at' })
  createdAt: Date;
}