import { Body, Controller, Get, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Controller('courses')
export class ApiGatewayController implements OnModuleInit { // <--- 1. Verifica que diga "implements OnModuleInit"
  constructor(
    @Inject('COURSE_SERVICE') private readonly courseClient: ClientKafka,
  ) { }

  async onModuleInit() {
    // 2. PRIMERO nos suscribimos a los temas de respuesta
    this.courseClient.subscribeToResponseOf('create.course');
    this.courseClient.subscribeToResponseOf('get.courses'); // <--- ESTA ES LA LÍNEA CLAVE

    // 3. DESPUÉS nos conectamos (¡No al revés!)
    await this.courseClient.connect();

    console.log('🐯 Gateway conectado y suscrito a create.course y get.courses');
  }

  @Post()
  createCourse(@Body() body: any) {
    return this.courseClient.send('create.course', {
      id: crypto.randomUUID(),
      title: body.title,
      videoUrl: body.videoUrl,
    });
  }

  @Get()
  async getCourses() {
    console.log('📨 Gateway: Pidiendo lista de cursos...');
    return this.courseClient.send('get.courses', {}); // <--- Esto falla si no te suscribiste arriba
  }
}