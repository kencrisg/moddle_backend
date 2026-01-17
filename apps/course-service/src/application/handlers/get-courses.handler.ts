import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseViewEntity } from '../../infrastructure/persistence/entities/course-view.entity';
import { GetCoursesQuery } from '../queries/get-courses.query';

@QueryHandler(GetCoursesQuery)
export class GetCoursesHandler implements IQueryHandler<GetCoursesQuery> {
  constructor(
    // ¡OJO AQUÍ! Inyectamos la conexión 'READ_CONNECTION'
    @InjectRepository(CourseViewEntity, 'READ_CONNECTION')
    private readonly readRepository: Repository<CourseViewEntity>,
  ) {}

  async execute(query: GetCoursesQuery): Promise<CourseViewEntity[]> {
    console.log('🔍 [Query] Leyendo cursos desde moodle_r (Vista Optimizada)...');
    return this.readRepository.find();
  }
}