import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EnrollmentEntity } from '../../infrastructure/persistence/entities/enrollment.entity';
import { UserViewEntity } from '../../infrastructure/persistence/entities/user-view.entity';
import { GetCourseStudentsQuery } from '../queries/get-course-students.query';

@QueryHandler(GetCourseStudentsQuery)
export class GetCourseStudentsHandler implements IQueryHandler<GetCourseStudentsQuery> {
  constructor(

    @InjectRepository(EnrollmentEntity)
    private readonly enrollmentRepo: Repository<EnrollmentEntity>,

    @InjectRepository(UserViewEntity, 'READ_CONNECTION')
    private readonly userReadRepo: Repository<UserViewEntity>,
  ) {}

  async execute(query: GetCourseStudentsQuery): Promise<UserViewEntity[]> {
    const { courseId } = query;
    console.log(`🔍 [Query] Buscando estudiantes para el curso: ${courseId}`);

    const enrollments = await this.enrollmentRepo.find({
      where: { courseId: courseId },
      select: ['studentId'], 
    });

    if (enrollments.length === 0) {
      return [];
    }
    const studentIds = enrollments.map((e) => e.studentId);

    const students = await this.userReadRepo.find({
      where: {
        id: In(studentIds),
      },
    });

    console.log(`✅ Encontrados ${students.length} estudiantes.`);
    return students;
  }
}