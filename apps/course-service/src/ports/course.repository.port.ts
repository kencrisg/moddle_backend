import { Course } from '../domain/model/course.model';

export abstract class CourseRepositoryPort {
    abstract save(course: Course): Promise<void>;
    abstract findById(id: string): Promise<Course | null>;
}