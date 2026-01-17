import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CourseServiceModule } from './course-service.module';

async function bootstrap() {
  // En lugar de create(), usamos createMicroservice()
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CourseServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['127.0.0.1:29092'], // Conexión a tu Kafka en Docker
        },
        consumer: {
          groupId: 'course-consumer-group', // ID único de este servicio
        },
      },
    },
  );

  await app.listen();
  console.log('Course Microservice is listening via Kafka...');
}
bootstrap();