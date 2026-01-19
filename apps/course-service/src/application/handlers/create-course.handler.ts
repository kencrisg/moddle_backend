import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseCommand } from '../commands/create-course.command';
import { CourseEntity } from '../../infrastructure/persistence/entities/course.entity';
import { CourseCreatedEvent } from '../../domain/events/course-created.event';

@CommandHandler(CreateCourseCommand)
export class CreateCourseHandler implements ICommandHandler<CreateCourseCommand> {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepo: Repository<CourseEntity>,
    private readonly eventBus: EventBus,
  ) { }

  async execute(command: CreateCourseCommand): Promise<{ status: string; courseId: string }> {
    // 1. Crear la entidad
    const course = new CourseEntity();
    course.id = command.id;
    course.title = command.title;
    course.videoUrl = command.videoUrl;
    course.isActive = true;
    course.createdAt = new Date();

    // 2. Guardar en Base de Datos de Escritura (Moodle_W)
    await this.courseRepo.save(course);

    // 3. Crear y publicar el Evento
    const event = new CourseCreatedEvent(
      course.id,
      course.title,
      course.videoUrl,
      course.createdAt,
    );

    this.eventBus.publish(event);

    console.log(`Curso creado y evento disparado: ${course.id}`);
    return { status: 'success', courseId: course.id };
  }
} 