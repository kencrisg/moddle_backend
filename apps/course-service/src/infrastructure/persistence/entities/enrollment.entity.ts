import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('enrollments')
export class EnrollmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'course_id', nullable: false })
  courseId: string;

  @Column({ name: 'student_id', nullable: false })
  studentId: string;
}