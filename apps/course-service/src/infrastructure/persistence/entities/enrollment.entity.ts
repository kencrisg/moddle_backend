import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('enrollments')
export class EnrollmentEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'course_id' })
  courseId: string;

  @Column({ name: 'student_id' })
  studentId: string;
}