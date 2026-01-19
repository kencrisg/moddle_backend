import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['127.0.0.1:29092'],
        },
        consumer: {
          groupId: 'auth-consumer-group',
        },
      },
    },
  );

  await app.listen();
  console.log('✅ Auth Microservice is listening via Kafka...');
}
bootstrap();
