import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetCoursesQuery } from '../../application/queries/get-courses.query';
import { EnrollStudentCommand } from '../../application/commands/enroll-student.command';
import { UnenrollStudentCommand } from '../../application/commands/unenroll-student.command';

@Controller()
export class CourseController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @MessagePattern('create.course')
  async create(@Payload() data: any) {
    // ... (tu código de crear sigue igual)
  }

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
    return this.commandBus.execute(new UnenrollStudentCommand(data.studentId, data.courseId));
  }
}