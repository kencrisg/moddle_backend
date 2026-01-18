/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/api-gateway/src/api-gateway.module.ts"
/*!****************************************************!*\
  !*** ./apps/api-gateway/src/api-gateway.module.ts ***!
  \****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiGatewayModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const auth_controller_1 = __webpack_require__(/*! ./infrastructure/controllers/auth.controller */ "./apps/api-gateway/src/infrastructure/controllers/auth.controller.ts");
const course_controller_1 = __webpack_require__(/*! ./infrastructure/controllers/course.controller */ "./apps/api-gateway/src/infrastructure/controllers/course.controller.ts");
let ApiGatewayModule = class ApiGatewayModule {
};
exports.ApiGatewayModule = ApiGatewayModule;
exports.ApiGatewayModule = ApiGatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: 'COURSE_SERVICE',
                    transport: microservices_1.Transport.KAFKA,
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
                {
                    name: 'AUTH_SERVICE',
                    transport: microservices_1.Transport.KAFKA,
                    options: {
                        client: {
                            clientId: 'api-gateway-auth',
                            brokers: ['127.0.0.1:29092'],
                        },
                        consumer: {
                            groupId: 'auth-consumer-gateway',
                        },
                    },
                },
            ]),
        ],
        controllers: [auth_controller_1.AuthController, course_controller_1.CourseController],
        providers: [],
    })
], ApiGatewayModule);


/***/ },

/***/ "./apps/api-gateway/src/infrastructure/controllers/auth.controller.ts"
/*!****************************************************************************!*\
  !*** ./apps/api-gateway/src/infrastructure/controllers/auth.controller.ts ***!
  \****************************************************************************/
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const create_user_dto_1 = __webpack_require__(/*! ../dtos/create-user.dto */ "./apps/api-gateway/src/infrastructure/dtos/create-user.dto.ts");
const login_dto_1 = __webpack_require__(/*! ../dtos/login.dto */ "./apps/api-gateway/src/infrastructure/dtos/login.dto.ts");
let AuthController = class AuthController {
    authClient;
    courseClient;
    constructor(authClient, courseClient) {
        this.authClient = authClient;
        this.courseClient = courseClient;
    }
    async onModuleInit() {
        this.authClient.subscribeToResponseOf('create.user');
        this.authClient.subscribeToResponseOf('auth.login');
        this.courseClient.subscribeToResponseOf('get.users');
        await this.authClient.connect();
        await this.courseClient.connect();
    }
    createUser(body) {
        return this.authClient.send('create.user', {
            id: crypto.randomUUID(),
            ...body,
        });
    }
    loginUser(body) {
        return this.authClient.send('auth.login', body);
    }
    getUsers() {
        console.log('📨 Gateway: Pidiendo estudiantes a la Vista de Cursos...');
        return this.courseClient.send('get.users', { role: 's' });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof create_user_dto_1.CreateUserDto !== "undefined" && create_user_dto_1.CreateUserDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginUser", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getUsers", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __param(0, (0, common_1.Inject)('AUTH_SERVICE')),
    __param(1, (0, common_1.Inject)('COURSE_SERVICE')),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientKafka !== "undefined" && microservices_1.ClientKafka) === "function" ? _a : Object, typeof (_b = typeof microservices_1.ClientKafka !== "undefined" && microservices_1.ClientKafka) === "function" ? _b : Object])
], AuthController);


/***/ },

/***/ "./apps/api-gateway/src/infrastructure/controllers/course.controller.ts"
/*!******************************************************************************!*\
  !*** ./apps/api-gateway/src/infrastructure/controllers/course.controller.ts ***!
  \******************************************************************************/
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CourseController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const create_course_dto_1 = __webpack_require__(/*! ../dtos/create-course.dto */ "./apps/api-gateway/src/infrastructure/dtos/create-course.dto.ts");
const enroll_student_dto_1 = __webpack_require__(/*! ../dtos/enroll-student.dto */ "./apps/api-gateway/src/infrastructure/dtos/enroll-student.dto.ts");
let CourseController = class CourseController {
    kafkaClient;
    constructor(kafkaClient) {
        this.kafkaClient = kafkaClient;
    }
    async onModuleInit() {
        this.kafkaClient.subscribeToResponseOf('create.course');
        this.kafkaClient.subscribeToResponseOf('get.courses');
        this.kafkaClient.subscribeToResponseOf('enroll.student');
        this.kafkaClient.subscribeToResponseOf('unenroll.student');
        this.kafkaClient.subscribeToResponseOf('delete.course');
        this.kafkaClient.subscribeToResponseOf('get.course.students');
        this.kafkaClient.subscribeToResponseOf('update.course.status');
        this.kafkaClient.subscribeToResponseOf('get.my.courses');
        await this.kafkaClient.connect();
    }
    getMyCourses(studentId) {
        console.log(`📨 [Gateway] Pidiendo cursos para el estudiante: ${studentId}`);
        return this.kafkaClient.send('get.my.courses', { studentId });
    }
    enrollStudent(body) {
        return this.kafkaClient.send('enroll.student', body);
    }
    unenrollStudent(body) {
        return this.kafkaClient.send('unenroll.student', body);
    }
    getCourseStudents(id) {
        console.log(`📨 Gateway: Pidiendo estudiantes del curso ${id}`);
        return this.kafkaClient.send('get.course.students', { courseId: id });
    }
    updateStatus(id, body) {
        console.log(`🔄 Gateway: Cambiando estado del curso ${id} a ${body.isActive}`);
        return this.kafkaClient.send('update.course.status', {
            id,
            isActive: body.isActive
        });
    }
    createCourse(body) {
        return this.kafkaClient.send('create.course', {
            id: crypto.randomUUID(),
            title: body.title,
            videoUrl: body.videoUrl,
        });
    }
    async getCourses() {
        return this.kafkaClient.send('get.courses', {});
    }
    deleteCourse(id) {
        return this.kafkaClient.send('delete.course', { id });
    }
};
exports.CourseController = CourseController;
__decorate([
    (0, common_1.Get)('my-courses/:studentId'),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "getMyCourses", null);
__decorate([
    (0, common_1.Post)('enroll'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof enroll_student_dto_1.EnrollStudentDto !== "undefined" && enroll_student_dto_1.EnrollStudentDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "enrollStudent", null);
__decorate([
    (0, common_1.Delete)('enroll'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof enroll_student_dto_1.EnrollStudentDto !== "undefined" && enroll_student_dto_1.EnrollStudentDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "unenrollStudent", null);
__decorate([
    (0, common_1.Get)(':id/students'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "getCourseStudents", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof create_course_dto_1.CreateCourseDto !== "undefined" && create_course_dto_1.CreateCourseDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "createCourse", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getCourses", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CourseController.prototype, "deleteCourse", null);
exports.CourseController = CourseController = __decorate([
    (0, common_1.Controller)('courses'),
    __param(0, (0, common_1.Inject)('COURSE_SERVICE')),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientKafka !== "undefined" && microservices_1.ClientKafka) === "function" ? _a : Object])
], CourseController);


/***/ },

/***/ "./apps/api-gateway/src/infrastructure/dtos/create-course.dto.ts"
/*!***********************************************************************!*\
  !*** ./apps/api-gateway/src/infrastructure/dtos/create-course.dto.ts ***!
  \***********************************************************************/
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
exports.CreateCourseDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class CreateCourseDto {
    title;
    videoUrl;
}
exports.CreateCourseDto = CreateCourseDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'El título debe ser un texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El título no puede estar vacío' }),
    (0, class_validator_1.MinLength)(5, { message: 'El título es muy corto, escribe al menos 5 letras' }),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La URL del video es obligatoria' }),
    (0, class_validator_1.IsUrl)({}, { message: 'Enviar una URL válida (ej: https://youtube.com...)' }),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "videoUrl", void 0);


/***/ },

/***/ "./apps/api-gateway/src/infrastructure/dtos/create-user.dto.ts"
/*!*********************************************************************!*\
  !*** ./apps/api-gateway/src/infrastructure/dtos/create-user.dto.ts ***!
  \*********************************************************************/
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
exports.CreateUserDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class CreateUserDto {
    email;
    password;
    fullName;
    role;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'El email no es válido' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre completo es obligatorio' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['a', 's']),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);


/***/ },

/***/ "./apps/api-gateway/src/infrastructure/dtos/enroll-student.dto.ts"
/*!************************************************************************!*\
  !*** ./apps/api-gateway/src/infrastructure/dtos/enroll-student.dto.ts ***!
  \************************************************************************/
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
exports.EnrollStudentDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class EnrollStudentDto {
    studentId;
    courseId;
}
exports.EnrollStudentDto = EnrollStudentDto;
__decorate([
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EnrollStudentDto.prototype, "studentId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4'),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EnrollStudentDto.prototype, "courseId", void 0);


/***/ },

/***/ "./apps/api-gateway/src/infrastructure/dtos/login.dto.ts"
/*!***************************************************************!*\
  !*** ./apps/api-gateway/src/infrastructure/dtos/login.dto.ts ***!
  \***************************************************************/
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
exports.LoginDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class LoginDto {
    email;
    password;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'El email no es válido' }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es obligatoria' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ },

/***/ "./apps/api-gateway/src/infrastructure/filters/rpc-exception.filter.ts"
/*!*****************************************************************************!*\
  !*** ./apps/api-gateway/src/infrastructure/filters/rpc-exception.filter.ts ***!
  \*****************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RpcExceptionFilter = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
let RpcExceptionFilter = class RpcExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'Error';
        if (exception instanceof microservices_1.RpcException) {
            const rpcError = exception.getError();
            if (typeof rpcError === 'string') {
                message = rpcError;
            }
            else if (typeof rpcError === 'object') {
                statusCode = rpcError.statusCode || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
                message = rpcError.message || message;
                error = rpcError.error || this.getErrorName(statusCode);
            }
        }
        else if (exception instanceof Error) {
            const errorMessage = exception.message;
            try {
                const parsed = JSON.parse(errorMessage);
                statusCode = parsed.statusCode || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
                message = parsed.message || errorMessage;
                error = parsed.error || this.getErrorName(statusCode);
            }
            catch {
                message = errorMessage;
            }
        }
        console.log(`🔴 [Gateway] Error ${statusCode}: ${message}`);
        response.status(statusCode).json({
            statusCode,
            message,
            error,
            timestamp: new Date().toISOString(),
        });
    }
    getErrorName(statusCode) {
        switch (statusCode) {
            case 400:
                return 'Bad Request';
            case 401:
                return 'Unauthorized';
            case 403:
                return 'Forbidden';
            case 404:
                return 'Not Found';
            case 409:
                return 'Conflict';
            case 422:
                return 'Unprocessable Entity';
            default:
                return 'Error';
        }
    }
};
exports.RpcExceptionFilter = RpcExceptionFilter;
exports.RpcExceptionFilter = RpcExceptionFilter = __decorate([
    (0, common_1.Catch)()
], RpcExceptionFilter);


/***/ },

/***/ "@nestjs/common"
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
(module) {

module.exports = require("@nestjs/common");

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

/***/ "class-validator"
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
(module) {

module.exports = require("class-validator");

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
/*!**************************************!*\
  !*** ./apps/api-gateway/src/main.ts ***!
  \**************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const api_gateway_module_1 = __webpack_require__(/*! ./api-gateway.module */ "./apps/api-gateway/src/api-gateway.module.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const rpc_exception_filter_1 = __webpack_require__(/*! ./infrastructure/filters/rpc-exception.filter */ "./apps/api-gateway/src/infrastructure/filters/rpc-exception.filter.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(api_gateway_module_1.ApiGatewayModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new rpc_exception_filter_1.RpcExceptionFilter());
    await app.listen(process.env.port ?? 3000);
    console.log(`🚀 API Gateway is running `);
}
bootstrap();

})();

/******/ })()
;