import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseViewEntity } from '../../infrastructure/persistence/entities/course-view.entity';
import { CourseCreatedEvent } from '../../domain/events/course-created.event';

@Injectable()
export class SyncCourseReadModelHandler {
  constructor(
    // Inyectamos el repositorio de la conexión de LECTURA ('READ_CONNECTION')
    @InjectRepository(CourseViewEntity, 'READ_CONNECTION')
    private readonly readRepository: Repository<CourseViewEntity>,
  ) {}

  // Este decorador es la magia: Escucha el evento 'CourseCreatedEvent'
  @OnEvent('CourseCreatedEvent')
  async handle(event: CourseCreatedEvent) {
    console.log('🔄 [Sync] Sincronizando curso en moodle_r (Read DB)...');

    // 1. Mapeamos el evento a la entidad de vista (tabla plana)
    const viewEntity = new CourseViewEntity();
    viewEntity.id = event.id;
    viewEntity.title = event.title;
    viewEntity.videoUrl = event.videoUrl;
    viewEntity.isActive = true; // Por defecto
    viewEntity.totalStudents = 0; // Empieza con 0 estudiantes

    // 2. Guardamos en la base de lectura
    await this.readRepository.save(viewEntity);
    
    console.log('✅ [Sync] ¡Curso sincronizado en moodle_r!');
  }
}