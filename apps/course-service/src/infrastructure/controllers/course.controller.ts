import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCourseHandler } from '../../application/handlers/create-course.handler';

@Controller()
export class CourseController {
  constructor(private readonly createCourseHandler: CreateCourseHandler) {}

  @MessagePattern('create.course')
  async create(@Payload() message: any) {
    console.log('🐯 [Kafka] Mensaje recibido:', message);
    await this.createCourseHandler.execute({
      id: message.id,
      title: message.title,
      videoUrl: message.videoUrl
    });
  }
}