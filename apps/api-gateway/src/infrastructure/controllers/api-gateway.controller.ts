import { Body, Controller, Delete, Get, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { EnrollStudentDto } from '../dtos/enroll-student.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginDto } from '../dtos/login.dto';

@Controller('courses')
export class ApiGatewayController implements OnModuleInit { // <--- 1. Verifica que diga "implements OnModuleInit"
  constructor(
    @Inject('COURSE_SERVICE') private readonly courseClient: ClientKafka,
  ) { }

  async onModuleInit() {
    // 2. PRIMERO nos suscribimos a los temas de respuesta
    this.courseClient.subscribeToResponseOf('create.course');
    this.courseClient.subscribeToResponseOf('get.courses'); // <--- ESTA ES LA LÍNEA CLAVE
    this.courseClient.subscribeToResponseOf('enroll.student');
    this.courseClient.subscribeToResponseOf('unenroll.student');
    this.courseClient.subscribeToResponseOf('create.user')
    this.courseClient.subscribeToResponseOf('auth.login');


    // 3. DESPUÉS nos conectamos (¡No al revés!)
    await this.courseClient.connect();

    console.log('🐯 Gateway conectado y suscrito a create.course y get.courses');
  }

  @Post()
  createCourse(@Body() body: CreateCourseDto) {
    return this.courseClient.send('create.course', {
      id: crypto.randomUUID(),
      title: body.title,
      videoUrl: body.videoUrl,
    });
  }

  @Post('enroll')
  enrollStudent(@Body() body: EnrollStudentDto) {
    return this.courseClient.send('enroll.student', { body });
  }

  @Get()
  async getCourses() {
    console.log('📨 Gateway: Pidiendo lista de cursos...');
    return this.courseClient.send('get.courses', {}); // <--- Esto falla si no te suscribiste arriba
  }

  @Delete('enroll') // DELETE http://localhost:3000/courses/enroll
  unenrollStudent(@Body() body: EnrollStudentDto) {
    return this.courseClient.send('unenroll.student', body);
  }

  @Post('users') // POST http://localhost:3000/courses/users
  createUser(@Body() body: CreateUserDto) {
    return this.courseClient.send('create.user', {
      id: crypto.randomUUID(),
      ...body
    });
  }

  @Post('login') // POST http://localhost:3000/courses/login
  loginUser(@Body() body: LoginDto) {
    // Enviamos el mensaje 'auth.login' a Kafka
    return this.courseClient.send('auth.login', body);
  }
}