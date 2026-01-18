import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseEntity } from '../../infrastructure/persistence/entities/course.entity';
import { UpdateCourseStatusCommand } from '../commands/update-course-status.command';
import { CourseStatusUpdatedEvent } from '../../domain/events/course-status-updated.event';

@CommandHandler(UpdateCourseStatusCommand)
export class UpdateCourseStatusHandler implements ICommandHandler<UpdateCourseStatusCommand> {
    constructor(
        @InjectRepository(CourseEntity)
        private readonly courseRepo: Repository<CourseEntity>,
        private readonly eventBus: EventBus,
    ) { }

    async execute(command: UpdateCourseStatusCommand): Promise<void> {
        console.log(`🛠️ [Write DB] Actualizando estado curso ${command.id} a: ${command.isActive}`);

        // 1. Actualizar en moodle_w
        await this.courseRepo.update(command.id, {
            isActive: command.isActive
        });

        // 2. Disparar evento para sincronizar lectura
        this.eventBus.publish(
            new CourseStatusUpdatedEvent(command.id, command.isActive)
        );
    }
}