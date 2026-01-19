import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EnrollmentEntity } from '../../infrastructure/persistence/entities/enrollment.entity';
import { CourseViewEntity } from '../../infrastructure/persistence/entities/course-view.entity';
import { GetStudentCoursesQuery } from '../queries/get-student-courses.query';

@QueryHandler(GetStudentCoursesQuery)
export class GetStudentCoursesHandler implements IQueryHandler<GetStudentCoursesQuery> {
    constructor(
        @InjectRepository(EnrollmentEntity)
        private readonly enrollmentRepo: Repository<EnrollmentEntity>,
        @InjectRepository(CourseViewEntity, 'READ_CONNECTION')
        private readonly courseReadRepo: Repository<CourseViewEntity>,
    ) { }

    async execute(query: GetStudentCoursesQuery): Promise<CourseViewEntity[]> {
        const { studentId } = query;
        console.log(`🔍 [Query] Buscando cursos para el estudiante: ${studentId}`);

        const enrollments = await this.enrollmentRepo.find({
            where: { studentId },
            select: ['courseId'],
        });

        if (enrollments.length === 0) {
            return [];
        }

        const courseIds = enrollments.map((e) => e.courseId);

        const courses = await this.courseReadRepo.find({
            where: {
                id: In(courseIds),
            },
        });

        return courses;
    }
}
