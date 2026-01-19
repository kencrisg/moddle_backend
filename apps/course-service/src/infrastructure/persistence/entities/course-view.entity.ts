import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('courses_view') // El nombre exacto de la tabla en moodle_r
export class CourseViewEntity {
  @PrimaryColumn({ name: 'course_id' }) // Mapeamos course_id a id
  id: string;

  @Column()
  title: string;

  @Column({ name: 'video_url' }) // Snake_case en la BD -> CamelCase en código
  videoUrl: string;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'total_students' })
  totalStudents: number;
}