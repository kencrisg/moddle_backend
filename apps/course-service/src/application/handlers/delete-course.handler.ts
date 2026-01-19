import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseEntity } from '../../infrastructure/persistence/entities/course.entity';
import { DeleteCourseCommand } from '../commands/delete-course.command';
import { CourseDeletedEvent } from '../../domain/events/course-deleted.event';

@CommandHandler(DeleteCourseCommand)
export class DeleteCourseHandler implements ICommandHandler<DeleteCourseCommand> {
    constructor(
        @InjectRepository(CourseEntity)
        private readonly courseRepo: Repository<CourseEntity>,
        private readonly eventBus: EventBus,
    ) { }

    async execute(command: DeleteCourseCommand): Promise<void> {
        await this.courseRepo.delete(command.id);
        console.log(`🗑️ [Delete] Curso eliminado de moodle_w: ${command.id}`);

        this.eventBus.publish(new CourseDeletedEvent(command.id));
    }
}