import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseViewEntity } from '../../infrastructure/persistence/entities/course-view.entity';
import { CourseCreatedEvent } from '../../domain/events/course-created.event';
import { CourseDeletedEvent } from '../../domain/events/course-deleted.event';
import { CourseStatusUpdatedEvent } from '../../domain/events/course-status-updated.event';

// Handler para CourseCreatedEvent
@EventsHandler(CourseCreatedEvent)
export class SyncCourseCreatedHandler implements IEventHandler<CourseCreatedEvent> {
  constructor(
    @InjectRepository(CourseViewEntity, 'READ_CONNECTION')
    private readonly readRepository: Repository<CourseViewEntity>,
  ) { }

  async handle(event: CourseCreatedEvent) {
    console.log('🔄 [Sync] Sincronizando curso en moodle_r (Read DB)...');

    const viewEntity = new CourseViewEntity();
    viewEntity.id = event.id;
    viewEntity.title = event.title;
    viewEntity.videoUrl = event.videoUrl;
    viewEntity.isActive = true;
    viewEntity.totalStudents = 0;

    await this.readRepository.save(viewEntity);

    console.log('✅ [Sync] ¡Curso sincronizado en moodle_r!');
  }
}

// Handler para CourseDeletedEvent
@EventsHandler(CourseDeletedEvent)
export class SyncCourseDeletedHandler implements IEventHandler<CourseDeletedEvent> {
  constructor(
    @InjectRepository(CourseViewEntity, 'READ_CONNECTION')
    private readonly readRepository: Repository<CourseViewEntity>,
  ) { }

  async handle(event: CourseDeletedEvent) {
    console.log(`🔄 [Sync] Eliminando curso de moodle_r (Read DB)...`);
    await this.readRepository.delete(event.id);
    console.log(`✅ [Sync] Curso eliminado de la vista.`);
  }
}

// Handler para CourseStatusUpdatedEvent
@EventsHandler(CourseStatusUpdatedEvent)
export class SyncCourseStatusUpdatedHandler implements IEventHandler<CourseStatusUpdatedEvent> {
  constructor(
    @InjectRepository(CourseViewEntity, 'READ_CONNECTION')
    private readonly readRepository: Repository<CourseViewEntity>,
  ) { }

  async handle(event: CourseStatusUpdatedEvent) {
    console.log(`🔄 [Sync] Actualizando estado en moodle_r...`);

    await this.readRepository.update(event.id, {
      isActive: event.isActive
    });

    console.log(`✅ [Sync] Curso ${event.id} ahora está ${event.isActive ? 'ACTIVO' : 'INACTIVO'} en vista.`);
  }
}