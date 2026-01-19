import { Course } from '../../../domain/model/course.model';
import { CourseEntity } from '../entities/course.entity';

export class CourseMapper {
    static toDomain(entity: CourseEntity): Course {
        return new Course(
            entity.id,
            entity.title,
            entity.videoUrl,
            entity.isActive,
            entity.createdAt,
        );
    }

    static toPersistence(domain: Course): CourseEntity {
        const entity = new CourseEntity();
        entity.id = domain.id;
        entity.title = domain.title;
        entity.videoUrl = domain.videoUrl;
        entity.isActive = domain.isActive;
        entity.createdAt = domain.createdAt;
        return entity;
    }
}