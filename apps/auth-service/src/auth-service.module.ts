import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthController } from './infrastructure/controllers/auth.controller';
import { LoginHandler } from './application/handlers/login.handler';
import { CreateUserHandler } from './application/handlers/create-user.handler';
import { UserRepositoryPort } from './ports/user.repository.port';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { UserEntity } from './infrastructure/persistence/entities/user.entity';
import { SyncUserReadModelHandler } from './application/handlers/sync-create-user.handler';
import { UserViewEntity } from './infrastructure/persistence/entities/user-view.entity';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    EventEmitterModule.forRoot(),

    // Write DB Connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME_WRITE'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    // Read DB Connection
    TypeOrmModule.forRootAsync({
      name: 'READ_CONNECTION',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME_READ'),
        entities: [UserViewEntity],
        autoLoadEntities: true,
        synchronize: false, // Turned off to handle manually
      }),
    }),

    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([UserViewEntity], 'READ_CONNECTION'),

    // Kafka Client to emit events
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['127.0.0.1:29092'],
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    SyncUserReadModelHandler,
    LoginHandler,
    CreateUserHandler,
    {
      provide: UserRepositoryPort,
      useClass: TypeOrmUserRepository,
    },
  ],
})
export class AuthServiceModule { }