/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/course-service/src/application/commands/enroll-student.command.ts"
/*!********************************************************************************!*\
  !*** ./apps/course-service/src/application/commands/enroll-student.command.ts ***!
  \********************************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnrollStudentCommand = void 0;
class EnrollStudentCommand {
    studentId;
    courseId;
    constructor(studentId, courseId) {
        this.studentId = studentId;
        this.courseId = courseId;
    }
}
exports.EnrollStudentCommand = EnrollStudentCommand;


/***/ },

/***/ "./apps/course-service/src/application/commands/unenroll-student.command.ts"
/*!**********************************************************************************!*\
  !*** ./apps/course-service/src/application/commands/unenroll-student.command.ts ***!
  \**********************************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UnenrollStudentCommand = void 0;
class UnenrollStudentCommand {
    studentId;
    courseId;
    constructor(studentId, courseId) {
        this.studentId = studentId;
        this.courseId = courseId;
    }
}
exports.UnenrollStudentCommand = UnenrollStudentCommand;


/***/ },

/***/ "./apps/course-service/src/application/handlers/create-course.handler.ts"
/*!*******************************************************************************!*\
  !*** ./apps/course-service/src/application/handlers/create-course.handler.ts ***!
  \*******************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCourseHandler = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const course_model_1 = __webpack_require__(/*! ../../domain/model/course.model */ "./apps/course-service/src/domain/model/course.model.ts");
const course_repository_port_1 = __webpack_require__(/*! ../../ports/course.repository.port */ "./apps/course-service/src/ports/course.repository.port.ts");
const event_bus_port_1 = __webpack_require__(/*! ../../ports/event-bus.port */ "./apps/course-service/src/ports/event-bus.port.ts");
const course_created_event_1 = __webpack_require__(/*! ../../domain/events/course-created.event */ "./apps/course-service/src/domain/events/course-created.event.ts");
let CreateCourseHandler = class CreateCourseHandler {
    repository;
    eventBus;
    constructor(repository, eventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }
    async execute(command) {
        const course = course_model_1.Course.create(command.id, command.title, command.videoUrl);
        await this.repository.save(course);
        const event = new course_created_event_1.CourseCreatedEvent(course.id, course.title, course.videoUrl, course.createdAt);
        await this.eventBus.publish(event);
        console.log(`Curso creado y evento disparado: ${course.id}`);
    }
};
exports.CreateCourseHandler = CreateCourseHandler;
exports.CreateCourseHandler = CreateCourseHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof course_repository_port_1.CourseRepositoryPort !== "undefined" && course_repository_port_1.CourseRepositoryPort) === "function" ? _a : Object, typeof (_b = typeof event_bus_port_1.EventBusPort !== "undefined" && event_bus_port_1.EventBusPort) === "function" ? _b : Object])
], CreateCourseHandler);


/***/ },

/***/ "./apps/course-service/src/application/handlers/enroll-student.handler.ts"
/*!********************************************************************************!*\
  !*** ./apps/course-service/src/application/handlers/enroll-student.handler.ts ***!
  \********************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnrollStudentHandler = void 0;
const cqrs_1 = __webpack_require__(/*! @nestjs/cqrs */ "@nestjs/cqrs");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const enrollment_entity_1 = __webpack_require__(/*! ../../infrastructure/persistence/entities/enrollment.entity */ "./apps/course-service/src/infrastructure/persistence/entities/enrollment.entity.ts");
const enroll_student_command_1 = __webpack_require__(/*! ../commands/enroll-student.command */ "./apps/course-service/src/application/commands/enroll-student.command.ts");
let EnrollStudentHandler = class EnrollStudentHandler {
    enrollmentRepo;
    constructor(enrollmentRepo) {
        this.enrollmentRepo = enrollmentRepo;
    }
    async execute(command) {
        const { studentId, courseId } = command;
        const enrollment = new enrollment_entity_1.EnrollmentEntity();
        enrollment.id = crypto.randomUUID();
        enrollment.studentId = studentId;
        enrollment.courseId = courseId;
        await this.enrollmentRepo.save(enrollment);
        console.log(`💾 [Enroll] Matrícula guardada con éxito`);
    }
};
exports.EnrollStudentHandler = EnrollStudentHandler;
exports.EnrollStudentHandler = EnrollStudentHandler = __decorate([
    (0, cqrs_1.CommandHandler)(enroll_student_command_1.EnrollStudentCommand),
    __param(0, (0, typeorm_1.InjectRepository)(enrollment_entity_1.EnrollmentEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], EnrollStudentHandler);


/***/ },

/***/ "./apps/course-service/src/application/handlers/get-courses.handler.ts"
/*!*****************************************************************************!*\
  !*** ./apps/course-service/src/application/handlers/get-courses.handler.ts ***!
  \*****************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetCoursesHandler = void 0;
const cqrs_1 = __webpack_require__(/*! @nestjs/cqrs */ "@nestjs/cqrs");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const course_view_entity_1 = __webpack_require__(/*! ../../infrastructure/persistence/entities/course-view.entity */ "./apps/course-service/src/infrastructure/persistence/entities/course-view.entity.ts");
const get_courses_query_1 = __webpack_require__(/*! ../queries/get-courses.query */ "./apps/course-service/src/application/queries/get-courses.query.ts");
let GetCoursesHandler = class GetCoursesHandler {
    readRepository;
    constructor(readRepository) {
        this.readRepository = readRepository;
    }
    async execute(query) {
        console.log('🔍 [Query] Leyendo cursos desde moodle_r (Vista Optimizada)...');
        return this.readRepository.find();
    }
};
exports.GetCoursesHandler = GetCoursesHandler;
exports.GetCoursesHandler = GetCoursesHandler = __decorate([
    (0, cqrs_1.QueryHandler)(get_courses_query_1.GetCoursesQuery),
    __param(0, (0, typeorm_1.InjectRepository)(course_view_entity_1.CourseViewEntity, 'READ_CONNECTION')),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], GetCoursesHandler);


/***/ },

/***/ "./apps/course-service/src/application/handlers/sync-course-read-model.handler.ts"
/*!****************************************************************************************!*\
  !*** ./apps/course-service/src/application/handlers/sync-course-read-model.handler.ts ***!
  \****************************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SyncCourseReadModelHandler = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const event_emitter_1 = __webpack_require__(/*! @nestjs/event-emitter */ "@nestjs/event-emitter");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const course_view_entity_1 = __webpack_require__(/*! ../../infrastructure/persistence/entities/course-view.entity */ "./apps/course-service/src/infrastructure/persistence/entities/course-view.entity.ts");
const course_created_event_1 = __webpack_require__(/*! ../../domain/events/course-created.event */ "./apps/course-service/src/domain/events/course-created.event.ts");
let SyncCourseReadModelHandler = class SyncCourseReadModelHandler {
    readRepository;
    constructor(readRepository) {
        this.readRepository = readRepository;
    }
    async handle(event) {
        console.log('🔄 [Sync] Sincronizando curso en moodle_r (Read DB)...');
        const viewEntity = new course_view_entity_1.CourseViewEntity();
        viewEntity.id = event.id;
        viewEntity.title = event.title;
        viewEntity.videoUrl = event.videoUrl;
        viewEntity.isActive = true;
        viewEntity.totalStudents = 0;
        await this.readRepository.save(viewEntity);
        console.log('✅ [Sync] ¡Curso sincronizado en moodle_r!');
    }
};
exports.SyncCourseReadModelHandler = SyncCourseReadModelHandler;
__decorate([
    (0, event_emitter_1.OnEvent)('CourseCreatedEvent'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof course_created_event_1.CourseCreatedEvent !== "undefined" && course_created_event_1.CourseCreatedEvent) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], SyncCourseReadModelHandler.prototype, "handle", null);
exports.SyncCourseReadModelHandler = SyncCourseReadModelHandler = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(course_view_entity_1.CourseViewEntity, 'READ_CONNECTION')),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], SyncCourseReadModelHandler);


/***/ },

/***/ "./apps/course-service/src/application/handlers/sync-user-read-model.handler.ts"
/*!**************************************************************************************!*\
  !*** ./apps/course-service/src/application/handlers/sync-user-read-model.handler.ts ***!
  \**************************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SyncUserReadModelHandler = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const event_emitter_1 = __webpack_require__(/*! @nestjs/event-emitter */ "@nestjs/event-emitter");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const user_view_entity_1 = __webpack_require__(/*! ../../infrastructure/persistence/entities/user-view.entity */ "./apps/course-service/src/infrastructure/persistence/entities/user-view.entity.ts");
const user_created_event_1 = __webpack_require__(/*! ../../domain/events/user-created.event */ "./apps/course-service/src/domain/events/user-created.event.ts");
let SyncUserReadModelHandler = class SyncUserReadModelHandler {
    readRepository;
    constructor(readRepository) {
        this.readRepository = readRepository;
    }
    async handle(event) {
        console.log('🔄 [Sync] Sincronizando usuario en moodle_r (Read DB)...');
        const viewUser = new user_view_entity_1.UserViewEntity();
        viewUser.id = event.id;
        viewUser.email = event.email;
        viewUser.password = event.password;
        viewUser.fullName = event.fullName;
        viewUser.role = event.role;
        await this.readRepository.save(viewUser);
        console.log('✅ [Sync] ¡Usuario sincronizado en moodle_r!');
    }
};
exports.SyncUserReadModelHandler = SyncUserReadModelHandler;
__decorate([
    (0, event_emitter_1.OnEvent)('UserCreatedEvent'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof user_created_event_1.UserCreatedEvent !== "undefined" && user_created_event_1.UserCreatedEvent) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], SyncUserReadModelHandler.prototype, "handle", null);
exports.SyncUserReadModelHandler = SyncUserReadModelHandler = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_view_entity_1.UserViewEntity, 'READ_CONNECTION')),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], SyncUserReadModelHandler);


/***/ },

/***/ "./apps/course-service/src/application/handlers/unenroll-student.handler.ts"
/*!**********************************************************************************!*\
  !*** ./apps/course-service/src/application/handlers/unenroll-student.handler.ts ***!
  \**********************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UnenrollStudentHandler = void 0;
const cqrs_1 = __webpack_require__(/*! @nestjs/cqrs */ "@nestjs/cqrs");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const enrollment_entity_1 = __webpack_require__(/*! ../../infrastructure/persistence/entities/enrollment.entity */ "./apps/course-service/src/infrastructure/persistence/entities/enrollment.entity.ts");
const unenroll_student_command_1 = __webpack_require__(/*! ../commands/unenroll-student.command */ "./apps/course-service/src/application/commands/unenroll-student.command.ts");
let UnenrollStudentHandler = class UnenrollStudentHandler {
    enrollmentRepo;
    constructor(enrollmentRepo) {
        this.enrollmentRepo = enrollmentRepo;
    }
    async execute(command) {
        const { studentId, courseId } = command;
        await this.enrollmentRepo.delete({ studentId, courseId });
        console.log(`🗑️ [Unenroll] Estudiante ${studentId} eliminado del curso ${courseId}`);
    }
};
exports.UnenrollStudentHandler = UnenrollStudentHandler;
exports.UnenrollStudentHandler = UnenrollStudentHandler = __decorate([
    (0, cqrs_1.CommandHandler)(unenroll_student_command_1.UnenrollStudentCommand),
    __param(0, (0, typeorm_1.InjectRepository)(enrollment_entity_1.EnrollmentEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], UnenrollStudentHandler);


/***/ },

/***/ "./apps/course-service/src/application/queries/get-courses.query.ts"
/*!**************************************************************************!*\
  !*** ./apps/course-service/src/application/queries/get-courses.query.ts ***!
  \**************************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetCoursesQuery = void 0;
class GetCoursesQuery {
}
exports.GetCoursesQuery = GetCoursesQuery;


/***/ },

/***/ "./apps/course-service/src/course-service.module.ts"
/*!**********************************************************!*\
  !*** ./apps/course-service/src/course-service.module.ts ***!
  \**********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CourseServiceModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const event_emitter_1 = __webpack_require__(/*! @nestjs/event-emitter */ "@nestjs/event-emitter");
const cqrs_1 = __webpack_require__(/*! @nestjs/cqrs */ "@nestjs/cqrs");
const get_courses_handler_1 = __webpack_require__(/*! ./application/handlers/get-courses.handler */ "./apps/course-service/src/application/handlers/get-courses.handler.ts");
const unenroll_student_handler_1 = __webpack_require__(/*! ./application/handlers/unenroll-student.handler */ "./apps/course-service/src/application/handlers/unenroll-student.handler.ts");
const create_course_handler_1 = __webpack_require__(/*! ./application/handlers/create-course.handler */ "./apps/course-service/src/application/handlers/create-course.handler.ts");
const sync_course_read_model_handler_1 = __webpack_require__(/*! ./application/handlers/sync-course-read-model.handler */ "./apps/course-service/src/application/handlers/sync-course-read-model.handler.ts");
const course_repository_port_1 = __webpack_require__(/*! ./ports/course.repository.port */ "./apps/course-service/src/ports/course.repository.port.ts");
const event_bus_port_1 = __webpack_require__(/*! ./ports/event-bus.port */ "./apps/course-service/src/ports/event-bus.port.ts");
const postgres_course_repository_1 = __webpack_require__(/*! ./infrastructure/persistence/repositories/postgres-course.repository */ "./apps/course-service/src/infrastructure/persistence/repositories/postgres-course.repository.ts");
const course_entity_1 = __webpack_require__(/*! ./infrastructure/persistence/entities/course.entity */ "./apps/course-service/src/infrastructure/persistence/entities/course.entity.ts");
const course_view_entity_1 = __webpack_require__(/*! ./infrastructure/persistence/entities/course-view.entity */ "./apps/course-service/src/infrastructure/persistence/entities/course-view.entity.ts");
const course_controller_1 = __webpack_require__(/*! ./infrastructure/controllers/course.controller */ "./apps/course-service/src/infrastructure/controllers/course.controller.ts");
const user_events_controller_1 = __webpack_require__(/*! ./infrastructure/controllers/user-events.controller */ "./apps/course-service/src/infrastructure/controllers/user-events.controller.ts");
const enrollment_entity_1 = __webpack_require__(/*! ./infrastructure/persistence/entities/enrollment.entity */ "./apps/course-service/src/infrastructure/persistence/entities/enrollment.entity.ts");
const enroll_student_handler_1 = __webpack_require__(/*! ./application/handlers/enroll-student.handler */ "./apps/course-service/src/application/handlers/enroll-student.handler.ts");
const user_view_entity_1 = __webpack_require__(/*! ./infrastructure/persistence/entities/user-view.entity */ "./apps/course-service/src/infrastructure/persistence/entities/user-view.entity.ts");
const sync_user_read_model_handler_1 = __webpack_require__(/*! ./application/handlers/sync-user-read-model.handler */ "./apps/course-service/src/application/handlers/sync-user-read-model.handler.ts");
class NestEventBus {
    eventEmitter;
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }
    async publish(event) {
        const eventName = event.constructor.name;
        console.log(`📢 [EventBus] Publicando evento: ${eventName}`);
        this.eventEmitter.emit(eventName, event);
    }
}
let CourseServiceModule = class CourseServiceModule {
};
exports.CourseServiceModule = CourseServiceModule;
exports.CourseServiceModule = CourseServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
            event_emitter_1.EventEmitterModule.forRoot(),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME_WRITE'),
                    autoLoadEntities: true,
                    synchronize: false,
                }),
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                name: 'READ_CONNECTION',
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME_READ'),
                    entities: [course_view_entity_1.CourseViewEntity, user_view_entity_1.UserViewEntity],
                    synchronize: false,
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([course_entity_1.CourseEntity, enrollment_entity_1.EnrollmentEntity]),
            typeorm_1.TypeOrmModule.forFeature([course_view_entity_1.CourseViewEntity, user_view_entity_1.UserViewEntity], 'READ_CONNECTION'),
        ],
        controllers: [course_controller_1.CourseController, user_events_controller_1.UserEventsController],
        providers: [
            sync_user_read_model_handler_1.SyncUserReadModelHandler,
            enroll_student_handler_1.EnrollStudentHandler,
            create_course_handler_1.CreateCourseHandler,
            sync_course_read_model_handler_1.SyncCourseReadModelHandler,
            get_courses_handler_1.GetCoursesHandler,
            unenroll_student_handler_1.UnenrollStudentHandler,
            { provide: course_repository_port_1.CourseRepositoryPort, useClass: postgres_course_repository_1.PostgresCourseRepository },
            {
                provide: event_bus_port_1.EventBusPort,
                useFactory: (eventEmitter) => new NestEventBus(eventEmitter),
                inject: [event_emitter_1.EventEmitter2],
            },
        ],
    })
], CourseServiceModule);


/***/ },

/***/ "./apps/course-service/src/domain/events/course-created.event.ts"
/*!***********************************************************************!*\
  !*** ./apps/course-service/src/domain/events/course-created.event.ts ***!
  \***********************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CourseCreatedEvent = void 0;
class CourseCreatedEvent {
    id;
    title;
    videoUrl;
    createdAt;
    constructor(id, title, videoUrl, createdAt) {
        this.id = id;
        this.title = title;
        this.videoUrl = videoUrl;
        this.createdAt = createdAt;
    }
    toString() {
        return JSON.stringify({
            id: this.id,
            title: this.title,
            videoUrl: this.videoUrl,
            createdAt: this.createdAt,
        });
    }
}
exports.CourseCreatedEvent = CourseCreatedEvent;


/***/ },

/***/ "./apps/course-service/src/domain/events/user-created.event.ts"
/*!*********************************************************************!*\
  !*** ./apps/course-service/src/domain/events/user-created.event.ts ***!
  \*********************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserCreatedEvent = void 0;
class UserCreatedEvent {
    id;
    email;
    password;
    fullName;
    role;
    constructor(id, email, password, fullName, role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
    }
}
exports.UserCreatedEvent = UserCreatedEvent;


/***/ },

/***/ "./apps/course-service/src/domain/model/course.model.ts"
/*!**************************************************************!*\
  !*** ./apps/course-service/src/domain/model/course.model.ts ***!
  \**************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Course = void 0;
class Course {
    id;
    title;
    videoUrl;
    isActive;
    createdAt;
    constructor(id, title, videoUrl, isActive, createdAt) {
        this.id = id;
        this.title = title;
        this.videoUrl = videoUrl;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }
    static create(id, title, videoUrl) {
        return new Course(id, title, videoUrl, true, new Date());
    }
}
exports.Course = Course;


/***/ },

/***/ "./apps/course-service/src/infrastructure/controllers/course.controller.ts"
/*!*********************************************************************************!*\
  !*** ./apps/course-service/src/infrastructure/controllers/course.controller.ts ***!
  \*********************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CourseController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const cqrs_1 = __webpack_require__(/*! @nestjs/cqrs */ "@nestjs/cqrs");
const get_courses_query_1 = __webpack_require__(/*! ../../application/queries/get-courses.query */ "./apps/course-service/src/application/queries/get-courses.query.ts");
const enroll_student_command_1 = __webpack_require__(/*! ../../application/commands/enroll-student.command */ "./apps/course-service/src/application/commands/enroll-student.command.ts");
const unenroll_student_command_1 = __webpack_require__(/*! ../../application/commands/unenroll-student.command */ "./apps/course-service/src/application/commands/unenroll-student.command.ts");
let CourseController = class CourseController {
    commandBus;
    queryBus;
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    async create(data) {
    }
    async getAll() {
        return this.queryBus.execute(new get_courses_query_1.GetCoursesQuery());
    }
    async enroll(data) {
        return this.commandBus.execute(new enroll_student_command_1.EnrollStudentCommand(data.studentId, data.courseId));
    }
    async unenroll(data) {
        return this.commandBus.execute(new unenroll_student_command_1.UnenrollStudentCommand(data.studentId, data.courseId));
    }
};
exports.CourseController = CourseController;
__decorate([
    (0, microservices_1.MessagePattern)('create.course'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "create", null);
__decorate([
    (0, microservices_1.MessagePattern)('get.courses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getAll", null);
__decorate([
    (0, microservices_1.MessagePattern)('enroll.student'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "enroll", null);
__decorate([
    (0, microservices_1.MessagePattern)('unenroll.student'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "unenroll", null);
exports.CourseController = CourseController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof cqrs_1.CommandBus !== "undefined" && cqrs_1.CommandBus) === "function" ? _a : Object, typeof (_b = typeof cqrs_1.QueryBus !== "undefined" && cqrs_1.QueryBus) === "function" ? _b : Object])
], CourseController);


/***/ },

/***/ "./apps/course-service/src/infrastructure/controllers/user-events.controller.ts"
/*!**************************************************************************************!*\
  !*** ./apps/course-service/src/infrastructure/controllers/user-events.controller.ts ***!
  \**************************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserEventsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const sync_user_read_model_handler_1 = __webpack_require__(/*! ../../application/handlers/sync-user-read-model.handler */ "./apps/course-service/src/application/handlers/sync-user-read-model.handler.ts");
const user_created_event_1 = __webpack_require__(/*! ../../domain/events/user-created.event */ "./apps/course-service/src/domain/events/user-created.event.ts");
let UserEventsController = class UserEventsController {
    syncUserHandler;
    constructor(syncUserHandler) {
        this.syncUserHandler = syncUserHandler;
    }
    async handleUserCreated(data) {
        console.log(`📥 [Course] Recibido evento user.created: ${data.email}`);
        const event = new user_created_event_1.UserCreatedEvent(data.id, data.email, data.password, data.fullName, data.role);
        await this.syncUserHandler.handle(event);
    }
};
exports.UserEventsController = UserEventsController;
__decorate([
    (0, microservices_1.EventPattern)('user.created'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserEventsController.prototype, "handleUserCreated", null);
exports.UserEventsController = UserEventsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof sync_user_read_model_handler_1.SyncUserReadModelHandler !== "undefined" && sync_user_read_model_handler_1.SyncUserReadModelHandler) === "function" ? _a : Object])
], UserEventsController);


/***/ },

/***/ "./apps/course-service/src/infrastructure/persistence/entities/course-view.entity.ts"
/*!*******************************************************************************************!*\
  !*** ./apps/course-service/src/infrastructure/persistence/entities/course-view.entity.ts ***!
  \*******************************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CourseViewEntity = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
let CourseViewEntity = class CourseViewEntity {
    id;
    title;
    videoUrl;
    isActive;
    totalStudents;
};
exports.CourseViewEntity = CourseViewEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'course_id' }),
    __metadata("design:type", String)
], CourseViewEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CourseViewEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'video_url' }),
    __metadata("design:type", String)
], CourseViewEntity.prototype, "videoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active' }),
    __metadata("design:type", Boolean)
], CourseViewEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_students' }),
    __metadata("design:type", Number)
], CourseViewEntity.prototype, "totalStudents", void 0);
exports.CourseViewEntity = CourseViewEntity = __decorate([
    (0, typeorm_1.Entity)('courses_view')
], CourseViewEntity);


/***/ },

/***/ "./apps/course-service/src/infrastructure/persistence/entities/course.entity.ts"
/*!**************************************************************************************!*\
  !*** ./apps/course-service/src/infrastructure/persistence/entities/course.entity.ts ***!
  \**************************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CourseEntity = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
let CourseEntity = class CourseEntity {
    id;
    title;
    videoUrl;
    isActive;
    createdAt;
};
exports.CourseEntity = CourseEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], CourseEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CourseEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'video_url' }),
    __metadata("design:type", String)
], CourseEntity.prototype, "videoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], CourseEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CourseEntity.prototype, "createdAt", void 0);
exports.CourseEntity = CourseEntity = __decorate([
    (0, typeorm_1.Entity)('courses')
], CourseEntity);


/***/ },

/***/ "./apps/course-service/src/infrastructure/persistence/entities/enrollment.entity.ts"
/*!******************************************************************************************!*\
  !*** ./apps/course-service/src/infrastructure/persistence/entities/enrollment.entity.ts ***!
  \******************************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnrollmentEntity = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
let EnrollmentEntity = class EnrollmentEntity {
    id;
    courseId;
    studentId;
};
exports.EnrollmentEntity = EnrollmentEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], EnrollmentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'course_id' }),
    __metadata("design:type", String)
], EnrollmentEntity.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'student_id' }),
    __metadata("design:type", String)
], EnrollmentEntity.prototype, "studentId", void 0);
exports.EnrollmentEntity = EnrollmentEntity = __decorate([
    (0, typeorm_1.Entity)('enrollments')
], EnrollmentEntity);


/***/ },

/***/ "./apps/course-service/src/infrastructure/persistence/entities/user-view.entity.ts"
/*!*****************************************************************************************!*\
  !*** ./apps/course-service/src/infrastructure/persistence/entities/user-view.entity.ts ***!
  \*****************************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserViewEntity = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
let UserViewEntity = class UserViewEntity {
    id;
    email;
    password;
    fullName;
    role;
};
exports.UserViewEntity = UserViewEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'user_id' }),
    __metadata("design:type", String)
], UserViewEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserViewEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserViewEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name' }),
    __metadata("design:type", String)
], UserViewEntity.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserViewEntity.prototype, "role", void 0);
exports.UserViewEntity = UserViewEntity = __decorate([
    (0, typeorm_1.Entity)('users_view')
], UserViewEntity);


/***/ },

/***/ "./apps/course-service/src/infrastructure/persistence/mappers/course.mapper.ts"
/*!*************************************************************************************!*\
  !*** ./apps/course-service/src/infrastructure/persistence/mappers/course.mapper.ts ***!
  \*************************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CourseMapper = void 0;
const course_model_1 = __webpack_require__(/*! ../../../domain/model/course.model */ "./apps/course-service/src/domain/model/course.model.ts");
const course_entity_1 = __webpack_require__(/*! ../entities/course.entity */ "./apps/course-service/src/infrastructure/persistence/entities/course.entity.ts");
class CourseMapper {
    static toDomain(entity) {
        return new course_model_1.Course(entity.id, entity.title, entity.videoUrl, entity.isActive, entity.createdAt);
    }
    static toPersistence(domain) {
        const entity = new course_entity_1.CourseEntity();
        entity.id = domain.id;
        entity.title = domain.title;
        entity.videoUrl = domain.videoUrl;
        entity.isActive = domain.isActive;
        entity.createdAt = domain.createdAt;
        return entity;
    }
}
exports.CourseMapper = CourseMapper;


/***/ },

/***/ "./apps/course-service/src/infrastructure/persistence/repositories/postgres-course.repository.ts"
/*!*******************************************************************************************************!*\
  !*** ./apps/course-service/src/infrastructure/persistence/repositories/postgres-course.repository.ts ***!
  \*******************************************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PostgresCourseRepository = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const course_entity_1 = __webpack_require__(/*! ../entities/course.entity */ "./apps/course-service/src/infrastructure/persistence/entities/course.entity.ts");
const course_mapper_1 = __webpack_require__(/*! ../mappers/course.mapper */ "./apps/course-service/src/infrastructure/persistence/mappers/course.mapper.ts");
let PostgresCourseRepository = class PostgresCourseRepository {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async save(course) {
        const entity = course_mapper_1.CourseMapper.toPersistence(course);
        await this.repository.save(entity);
    }
    async findById(id) {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? course_mapper_1.CourseMapper.toDomain(entity) : null;
    }
};
exports.PostgresCourseRepository = PostgresCourseRepository;
exports.PostgresCourseRepository = PostgresCourseRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(course_entity_1.CourseEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], PostgresCourseRepository);


/***/ },

/***/ "./apps/course-service/src/ports/course.repository.port.ts"
/*!*****************************************************************!*\
  !*** ./apps/course-service/src/ports/course.repository.port.ts ***!
  \*****************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CourseRepositoryPort = void 0;
class CourseRepositoryPort {
}
exports.CourseRepositoryPort = CourseRepositoryPort;


/***/ },

/***/ "./apps/course-service/src/ports/event-bus.port.ts"
/*!*********************************************************!*\
  !*** ./apps/course-service/src/ports/event-bus.port.ts ***!
  \*********************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventBusPort = void 0;
class EventBusPort {
}
exports.EventBusPort = EventBusPort;


/***/ },

/***/ "@nestjs/common"
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
(module) {

module.exports = require("@nestjs/common");

/***/ },

/***/ "@nestjs/config"
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
(module) {

module.exports = require("@nestjs/config");

/***/ },

/***/ "@nestjs/core"
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
(module) {

module.exports = require("@nestjs/core");

/***/ },

/***/ "@nestjs/cqrs"
/*!*******************************!*\
  !*** external "@nestjs/cqrs" ***!
  \*******************************/
(module) {

module.exports = require("@nestjs/cqrs");

/***/ },

/***/ "@nestjs/event-emitter"
/*!****************************************!*\
  !*** external "@nestjs/event-emitter" ***!
  \****************************************/
(module) {

module.exports = require("@nestjs/event-emitter");

/***/ },

/***/ "@nestjs/microservices"
/*!****************************************!*\
  !*** external "@nestjs/microservices" ***!
  \****************************************/
(module) {

module.exports = require("@nestjs/microservices");

/***/ },

/***/ "@nestjs/typeorm"
/*!**********************************!*\
  !*** external "@nestjs/typeorm" ***!
  \**********************************/
(module) {

module.exports = require("@nestjs/typeorm");

/***/ },

/***/ "typeorm"
/*!**************************!*\
  !*** external "typeorm" ***!
  \**************************/
(module) {

module.exports = require("typeorm");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*****************************************!*\
  !*** ./apps/course-service/src/main.ts ***!
  \*****************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const course_service_module_1 = __webpack_require__(/*! ./course-service.module */ "./apps/course-service/src/course-service.module.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(course_service_module_1.CourseServiceModule, {
        transport: microservices_1.Transport.KAFKA,
        options: {
            client: {
                brokers: ['127.0.0.1:29092'],
            },
            consumer: {
                groupId: 'course-consumer-group',
            },
        },
    });
    await app.listen();
    console.log('✅Course Microservice is listening via Kafka...');
}
bootstrap();

})();

/******/ })()
;