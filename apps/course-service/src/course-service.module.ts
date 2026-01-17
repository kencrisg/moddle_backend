import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCourseHandler } from './application/handlers/create-course.handler';
import { CourseRepositoryPort } from './ports/course.repository.port';
import { EventBusPort } from './ports/event-bus.port';
import { PostgresCourseRepository } from './infrastructure/persistence/repositories/postgres-course.repository';
import { CourseEntity } from './infrastructure/persistence/entities/course.entity';
import { CourseController } from './infrastructure/controllers/course.controller';

// Mock temporal del Bus (para no complicarnos con doble Kafka todavía)
class ConsoleEventBus implements EventBusPort {
  async publish(event: any): Promise<void> {
    console.log('📢 [EventBus] Publicando evento de dominio:', event.toString());
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
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
    TypeOrmModule.forFeature([CourseEntity]),
  ],
  controllers: [CourseController], // <--- Ahora sí importamos el Controller Kafka
  providers: [
    CreateCourseHandler,
    { provide: CourseRepositoryPort, useClass: PostgresCourseRepository },
    { provide: EventBusPort, useClass: ConsoleEventBus },
  ],
})
export class CourseServiceModule { }