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
        // 1. Borrar de la Base de Escritura (moodle_w)
        await this.courseRepo.delete(command.id);
        console.log(`🗑️ [Delete] Curso eliminado de moodle_w: ${command.id}`);

        // 2. Disparar evento para que se borre de la lectura
        this.eventBus.publish(new CourseDeletedEvent(command.id));
    }
}