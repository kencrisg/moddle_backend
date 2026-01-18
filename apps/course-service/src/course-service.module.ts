import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule, EventEmitter2 } from '@nestjs/event-emitter';
import { CqrsModule } from '@nestjs/cqrs';
import { GetCoursesHandler } from './application/handlers/get-courses.handler';
import { UnenrollStudentHandler } from './application/handlers/unenroll-student.handler';
import { CreateCourseHandler } from './application/handlers/create-course.handler';
import { SyncCourseReadModelHandler } from './application/handlers/sync-course-read-model.handler';
import { CourseRepositoryPort } from './ports/course.repository.port';
import { EventBusPort } from './ports/event-bus.port';
import { PostgresCourseRepository } from './infrastructure/persistence/repositories/postgres-course.repository';
import { CourseEntity } from './infrastructure/persistence/entities/course.entity';
import { CourseViewEntity } from './infrastructure/persistence/entities/course-view.entity';
import { CourseController } from './infrastructure/controllers/course.controller';
import { EnrollmentEntity } from './infrastructure/persistence/entities/enrollment.entity';
import { EnrollStudentHandler } from './application/handlers/enroll-student.handler';
import { UserViewEntity } from './infrastructure/persistence/entities/user-view.entity';
import { DeleteCourseHandler } from './application/handlers/delete-course.handler';
import { GetUsersHandler } from './application/handlers/get-users.handler';
import { GetCourseStudentsHandler } from './application/handlers/get-course-students.handler';
import { UpdateCourseStatusHandler } from './application/handlers/update-course-status.handler';
import { GetStudentCoursesHandler } from './application/handlers/get-student-courses.handler';

class NestEventBus implements EventBusPort {
  constructor(private readonly eventEmitter: EventEmitter2) { }

  async publish(event: any): Promise<void> {
    const eventName = event.constructor.name;
    console.log(`📢 [EventBus] Publicando evento: ${eventName}`);
    this.eventEmitter.emit(eventName, event);
  }
}

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
        entities: [CourseViewEntity, UserViewEntity],
        synchronize: false,
      }),
    }),

    TypeOrmModule.forFeature([CourseEntity, EnrollmentEntity]),
    TypeOrmModule.forFeature([CourseViewEntity, UserViewEntity], 'READ_CONNECTION'),
  ],
  controllers: [CourseController],
  providers: [
    UpdateCourseStatusHandler,
    GetCourseStudentsHandler,
    GetUsersHandler,
    DeleteCourseHandler,
    EnrollStudentHandler,
    CreateCourseHandler,
    SyncCourseReadModelHandler,
    GetCoursesHandler,
    UnenrollStudentHandler,
    GetStudentCoursesHandler,

    { provide: CourseRepositoryPort, useClass: PostgresCourseRepository },

    {
      provide: EventBusPort,
      useFactory: (eventEmitter: EventEmitter2) => new NestEventBus(eventEmitter),
      inject: [EventEmitter2],
    },
  ],
})
export class CourseServiceModule { }