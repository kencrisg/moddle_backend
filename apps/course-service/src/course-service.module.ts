import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCourseHandler } from './application/handlers/create-course.handler';
import { CourseRepositoryPort } from './ports/course.repository.port';
import { EventBusPort } from './ports/event-bus.port';
import { PostgresCourseRepository } from './infrastructure/persistence/repositories/postgres-course.repository';
import { CourseEntity } from './infrastructure/persistence/entities/course.entity';
import { CourseViewEntity } from './infrastructure/persistence/entities/course-view.entity'; // <--- IMPORTA ESTO
import { CourseController } from './infrastructure/controllers/course.controller';

class ConsoleEventBus implements EventBusPort {
  async publish(event: any): Promise<void> {
    console.log('📢 [EventBus] Publicando evento de dominio:', event.toString());
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    // 1. CONEXIÓN DE ESCRITURA (DEFAULT) - moodle_w
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME_WRITE'), // <--- moodle_w
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    // 2. CONEXIÓN DE LECTURA (NOMBRADA) - moodle_r   <--- ¡NUEVO BLOQUE!
    TypeOrmModule.forRootAsync({
      name: 'READ_CONNECTION', // <--- IMPORTANTE: Este nombre lo usaremos para inyectar
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME_READ'), // <--- moodle_r
        entities: [CourseViewEntity], // <--- Solo cargamos las entidades de vista aquí
        synchronize: false,
      }),
    }),

    // Registramos las entidades en sus conexiones respectivas
    TypeOrmModule.forFeature([CourseEntity]), // Default connection
    TypeOrmModule.forFeature([CourseViewEntity], 'READ_CONNECTION'), // Read connection
  ],
  controllers: [CourseController],
  providers: [
    CreateCourseHandler,
    { provide: CourseRepositoryPort, useClass: PostgresCourseRepository },
    { provide: EventBusPort, useClass: ConsoleEventBus },
  ],
})
export class CourseServiceModule {}