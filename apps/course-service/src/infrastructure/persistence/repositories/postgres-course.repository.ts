import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseRepositoryPort } from '../../../ports/course.repository.port';
import { Course } from '../../../domain/model/course.model';
import { CourseEntity } from '../entities/course.entity';
import { CourseMapper } from '../mappers/course.mapper';

@Injectable()
export class PostgresCourseRepository implements CourseRepositoryPort {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly repository: Repository<CourseEntity>,
  ) {}

  async save(course: Course): Promise<void> {
    const entity = CourseMapper.toPersistence(course);
    await this.repository.save(entity);
  }

  async findById(id: string): Promise<Course | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? CourseMapper.toDomain(entity) : null;
  }
}