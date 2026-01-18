import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { CourseController } from './infrastructure/controllers/course.controller';

@Module({
  imports: [

    ClientsModule.register([
      {
        name: 'COURSE_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'api-gateway',
            brokers: ['127.0.0.1:29092'],
          },
          consumer: {
            groupId: 'api-gateway-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AuthController, CourseController],
  providers: [],
})
export class ApiGatewayModule { }