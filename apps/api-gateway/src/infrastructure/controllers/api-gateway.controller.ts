import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Controller('courses')
export class ApiGatewayController implements OnModuleInit {
  constructor(
    @Inject('COURSE_SERVICE') private readonly courseClient: ClientKafka,
  ) {}

  // Nos conectamos a Kafka apenas arranque el Gateway
  async onModuleInit() {
    this.courseClient.subscribeToResponseOf('create.course');
    await this.courseClient.connect();
    console.log('🐯 Gateway conectado a Kafka');
  }

  @Post()
  createCourse(@Body() body: any) {
    console.log('📨 Gateway: Recibiendo HTTP POST, enviando a Kafka...');
    
    // Enviamos el mensaje al microservicio
    return this.courseClient.send('create.course', {
      id: crypto.randomUUID(), // Generamos ID único
      title: body.title,
      videoUrl: body.videoUrl,
    });
  }
}