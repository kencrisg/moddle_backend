/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
const create_course_handler_1 = __webpack_require__(/*! ./application/handlers/create-course.handler */ "./apps/course-service/src/application/handlers/create-course.handler.ts");
const course_repository_port_1 = __webpack_require__(/*! ./ports/course.repository.port */ "./apps/course-service/src/ports/course.repository.port.ts");
const event_bus_port_1 = __webpack_require__(/*! ./ports/event-bus.port */ "./apps/course-service/src/ports/event-bus.port.ts");
const postgres_course_repository_1 = __webpack_require__(/*! ./infrastructure/persistence/repositories/postgres-course.repository */ "./apps/course-service/src/infrastructure/persistence/repositories/postgres-course.repository.ts");
const course_entity_1 = __webpack_require__(/*! ./infrastructure/persistence/entities/course.entity */ "./apps/course-service/src/infrastructure/persistence/entities/course.entity.ts");
const course_controller_1 = __webpack_require__(/*! ./infrastructure/controllers/course.controller */ "./apps/course-service/src/infrastructure/controllers/course.controller.ts");
class ConsoleEventBus {
    async publish(event) {
        console.log('📢 [EventBus] Publicando evento de dominio:', event.toString());
    }
}
let CourseServiceModule = class CourseServiceModule {
};
exports.CourseServiceModule = CourseServiceModule;
exports.CourseServiceModule = CourseServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
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
            typeorm_1.TypeOrmModule.forFeature([course_entity_1.CourseEntity]),
        ],
        controllers: [course_controller_1.CourseController],
        providers: [
            create_course_handler_1.CreateCourseHandler,
            { provide: course_repository_port_1.CourseRepositoryPort, useClass: postgres_course_repository_1.PostgresCourseRepository },
            { provide: event_bus_port_1.EventBusPort, useClass: ConsoleEventBus },
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CourseController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const create_course_handler_1 = __webpack_require__(/*! ../../application/handlers/create-course.handler */ "./apps/course-service/src/application/handlers/create-course.handler.ts");
let CourseController = class CourseController {
    createCourseHandler;
    constructor(createCourseHandler) {
        this.createCourseHandler = createCourseHandler;
    }
    async create(message) {
        console.log('🐯 [Kafka] Mensaje recibido:', message);
        await this.createCourseHandler.execute({
            id: message.id,
            title: message.title,
            videoUrl: message.videoUrl
        });
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
exports.CourseController = CourseController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof create_course_handler_1.CreateCourseHandler !== "undefined" && create_course_handler_1.CreateCourseHandler) === "function" ? _a : Object])
], CourseController);


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
    console.log('Course Microservice is listening via Kafka...');
}
bootstrap();

})();

/******/ })()
;