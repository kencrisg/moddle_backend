import { Injectable } from '@nestjs/common';
import { CreateCourseCommand } from '../commands/create-course.command';
import { Course } from '../../domain/model/course.model';
import { CourseRepositoryPort } from '../../ports/course.repository.port';
import { EventBusPort } from '../../ports/event-bus.port';
import { CourseCreatedEvent } from '../../domain/events/course-created.event';

@Injectable()
export class CreateCourseHandler {
  constructor(
    private readonly repository: CourseRepositoryPort, // Para guardar en Postgres (Write)
    private readonly eventBus: EventBusPort,         // Para avisar a Kafka
  ) {}

  async execute(command: CreateCourseCommand): Promise<void> {
    // 1. Crear la entidad de Dominio (Aquí van las validaciones de negocio)
    const course = Course.create(command.id, command.title, command.videoUrl);

    // 2. Guardar en Base de Datos de Escritura (Moodle_W)
    await this.repository.save(course);

    // 3. Crear el Evento de Dominio
    const event = new CourseCreatedEvent(
      course.id,
      course.title,
      course.videoUrl,
      course.createdAt,
    );

    // 4. Publicar el Evento en Kafka (Para que el otro lado se entere)
    await this.eventBus.publish(event);
    
    console.log(`Curso creado y evento disparado: ${course.id}`);
  }
} 