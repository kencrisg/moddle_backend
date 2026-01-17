import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule, EventEmitter2 } from '@nestjs/event-emitter'; // <--- IMPORTAR
import { CqrsModule } from '@nestjs/cqrs';
import { GetCoursesHandler } from './application/handlers/get-courses.handler';

import { CreateCourseHandler } from './application/handlers/create-course.handler';
import { SyncCourseReadModelHandler } from './application/handlers/sync-course-read-model.handler'; // <--- IMPORTAR
import { CourseRepositoryPort } from './ports/course.repository.port';
import { EventBusPort } from './ports/event-bus.port';
import { PostgresCourseRepository } from './infrastructure/persistence/repositories/postgres-course.repository';
import { CourseEntity } from './infrastructure/persistence/entities/course.entity';
import { CourseViewEntity } from './infrastructure/persistence/entities/course-view.entity';
import { CourseController } from './infrastructure/controllers/course.controller';

// --- NUEVO EVENT BUS REAL ---
// Usamos EventEmitter2 para enviar el evento de verdad
class NestEventBus implements EventBusPort {
  constructor(private readonly eventEmitter: EventEmitter2) { }

  async publish(event: any): Promise<void> {
    // El nombre del evento será el nombre de la clase (Ej: 'CourseCreatedEvent')
    const eventName = event.constructor.name;
    console.log(`📢 [EventBus] Publicando evento: ${eventName}`);
    this.eventEmitter.emit(eventName, event);
  }
}
// ----------------------------

@Module({
  imports: [CqrsModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    EventEmitterModule.forRoot(), // <--- ACTIVAR EL MÓDULO DE EVENTOS

    // ... (Tus configuraciones de TypeOrm se quedan igual que antes) ...
    // CONEXIÓN 1 (Write)
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
    // CONEXIÓN 2 (Read)
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
        entities: [CourseViewEntity],
        synchronize: false,
      }),
    }),

    TypeOrmModule.forFeature([CourseEntity]),
    TypeOrmModule.forFeature([CourseViewEntity], 'READ_CONNECTION'),
  ],
  controllers: [CourseController],
  providers: [
    CreateCourseHandler,
    SyncCourseReadModelHandler, // <--- REGISTRAR EL NUEVO HANDLER
    GetCoursesHandler,

    { provide: CourseRepositoryPort, useClass: PostgresCourseRepository },

    // Inyectamos EventEmitter2 en nuestro bus personalizado
    {
      provide: EventBusPort,
      useFactory: (eventEmitter: EventEmitter2) => new NestEventBus(eventEmitter),
      inject: [EventEmitter2],
    },
  ],
})
export class CourseServiceModule { }