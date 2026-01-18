import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetCoursesQuery } from '../../application/queries/get-courses.query';
import { EnrollStudentCommand } from '../../application/commands/enroll-student.command';
import { UnenrollStudentCommand } from '../../application/commands/unenroll-student.command';
import { CreateCourseHandler } from '../../application/handlers/create-course.handler';
import { DeleteCourseCommand } from '../../application/commands/delete-course.command';
import { GetUsersQuery } from '../../application/queries/get-users.query';
import { GetCourseStudentsQuery } from '../../application/queries/get-course-students.query';
import { UpdateCourseStatusCommand } from '../../application/commands/update-course-status.command';

@Controller()
export class CourseController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly createCourseHandler: CreateCourseHandler
  ) { }

  @MessagePattern('create.course') 
  async create(@Payload() message: any) {
    console.log('🐯 [Course Service] Mensaje Kafka recibido:', message);
    
    // Ejecutamos el caso de uso (CQRS)
    await this.createCourseHandler.execute({
      id: message.id,
      title: message.title,
      videoUrl: message.videoUrl
    });

    return { status: 'success', courseId: message.id };
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

  @MessagePattern('delete.course')
  async deleteCourse(@Payload() data: any) {
    return this.commandBus.execute(new DeleteCourseCommand(data.id));
  }

  @MessagePattern('get.users')
  async getUsers(@Payload() data: any) {
    // data.role viene del Gateway ({ role: 's' })
    return this.queryBus.execute(new GetUsersQuery(data.role));
  }

  @MessagePattern('get.course.students')
  async getCourseStudents(@Payload() data: any) {
    return this.queryBus.execute(new GetCourseStudentsQuery(data.courseId));
  }

  @MessagePattern('update.course.status')
  async updateStatus(@Payload() data: any) {
    return this.commandBus.execute(
      new UpdateCourseStatusCommand(data.id, data.isActive)
    );
  }
  
}