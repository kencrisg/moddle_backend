import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
// OJO AQUÍ: La ruta correcta baja a infrastructure/controllers
import { ApiGatewayController } from './infrastructure/controllers/api-gateway.controller';

@Module({
  imports: [
    // Registramos el Cliente Kafka para poder hablar con el otro servicio
    ClientsModule.register([
      {
        name: 'COURSE_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'api-gateway',
            brokers: ['127.0.0.1:29092'], // Tu Docker
          },
          consumer: {
            groupId: 'api-gateway-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [ApiGatewayController], // Usamos el controller importado correctamente
  providers: [], // Sin servicios por ahora, el controller hace el trabajo
})
export class ApiGatewayModule {}