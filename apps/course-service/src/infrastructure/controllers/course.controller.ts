import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs'; // Importar QueryBus
import { CreateCourseCommand } from '../../application/commands/create-course.command';
import { GetCoursesQuery } from '../../application/queries/get-courses.query';
import { EnrollStudentCommand } from '../../application/commands/enroll-student.command';
import { UnenrollStudentCommand } from '../../application/commands/unenroll-student.command';
import { CreateUserCommand } from '../../application/commands/create-user.command';

@Controller()
export class CourseController {
  // Inyectamos ambos buses: Command (Escribir) y Query (Leer)
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @MessagePattern('create.course')
  async create(@Payload() data: any) {
    // ... (tu código de crear sigue igual)
  }

  // --- NUEVO ENDPOINT PARA KAFKA ---
  @MessagePattern('get.courses')
  async getAll() {
    return this.queryBus.execute(new GetCoursesQuery());
  }

  @MessagePattern('enroll.student')
  async enroll(@Payload() data: any) {
    return this.commandBus.execute(new EnrollStudentCommand(data.studentId, data.courseId));
  }

  @MessagePattern('unenroll.student')
  async unenroll(@Payload() data: any) {
    // Reutilizamos el comando EnrollStudentCommand para no crear otro archivo, 
    // o creamos uno nuevo si quieres ser purista. Por tiempo, usemos el mismo DTO/Interface.
    return this.commandBus.execute(new UnenrollStudentCommand(data.studentId, data.courseId));
  }

  @MessagePattern('create.user')
  async createUser(@Payload() data: any) {
    return this.commandBus.execute(
      new CreateUserCommand(data.id, data.email, data.password, data.fullName)
    );
  }
}