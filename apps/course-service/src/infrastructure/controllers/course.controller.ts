import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs'; // Importar QueryBus
import { CreateCourseCommand } from '../../application/commands/create-course.command';
import { GetCoursesQuery } from '../../application/queries/get-courses.query';

@Controller()
export class CourseController {
  // Inyectamos ambos buses: Command (Escribir) y Query (Leer)
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus, 
  ) {}

  @MessagePattern('create.course')
  async create(@Payload() data: any) {
    // ... (tu código de crear sigue igual)
  }

  // --- NUEVO ENDPOINT PARA KAFKA ---
  @MessagePattern('get.courses')
  async getAll() {
    return this.queryBus.execute(new GetCoursesQuery());
  }
}