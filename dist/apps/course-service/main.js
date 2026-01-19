/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/course-service/src/application/commands/create-course.command.ts"
/*!*******************************************************************************!*\
  !*** ./apps/course-service/src/application/commands/create-course.command.ts ***!
  \*******************************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCourseCommand = void 0;
class CreateCourseCommand {
    title;
    videoUrl;
    id;
    constructor(title, videoUrl, id) {
        this.title = title;
        this.videoUrl = videoUrl;
        this.id = id;
    }
}
exports.CreateCourseCommand = CreateCourseCommand;


/***/ },

/***/ "./apps/course-service/src/application/commands/delete-course.command.ts"
/*!*******************************************************************************!*\
  !*** ./apps/course-service/src/application/commands/delete-course.command.ts ***!
  \*******************************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteCourseCommand = void 0;
class DeleteCourseCommand {
    id;
    constructor(id) {
        this.id = id;
    }
}
exports.DeleteCourseCommand = DeleteCourseCommand;


/***/ },

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

/***/ "./apps/course-service/src/application/commands/update-course-status.command.ts"
/*!**************************************************************************************!*\
  !*** ./apps/course-service/src/application/commands/update-course-status.command.ts ***!
  \**************************************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCourseStatusCommand = void 0;
class UpdateCourseStatusCommand {
    id;
    isActive;
    constructor(id, isActive) {
        this.id = id;
        this.isActive = isActive;
    }
}
exports.UpdateCourseStatusCommand = UpdateCourseStatusCommand;


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCourseHandler = void 0;
const cqrs_1 = __webpack_require__(/*! @nestjs/cqrs */ "@nestjs/cqrs");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const create_course_command_1 = __webpack_require__(/*! ../commands/create-course.command */ "./apps/course-service/src/application/commands/create-course.command.ts");
const course_entity_1 = __webpack_require__(/*! ../../infrastructure/persistence/entities/course.entity */ "./apps/course-service/src/infrastructure/persistence/entities/course.entity.ts");
const course_created_event_1 = __webpack_require__(/*! ../../domain/events/course-created.event */ "./apps/course-service/src/domain/events/course-created.event.ts");
let CreateCourseHandler = class CreateCourseHandler {
    courseRepo;
    eventBus;
    constructor(courseRepo, eventBus) {
        this.courseRepo = courseRepo;
        this.eventBus = eventBus;
    }
    async execute(command) {
        const course = new course_entity_1.CourseEntity();
        course.id = command.id;
        course.title = command.title;
        course.videoUrl = command.videoUrl;
        course.isActive = true;
        course.createdAt = new Date();
        await this.courseRepo.save(course);
        const event = new course_created_event_1.CourseCreatedEvent(course.id, course.title, course.videoUrl, course.createdAt);
        this.eventBus.publish(event);
        console.log(`Curso creado y evento disparado: ${course.id}`);
        return { status: 'success', courseId: course.id };
    }
};
exports.CreateCourseHandler = CreateCourseHandler;
exports.CreateCourseHandler = CreateCourseHandler = __decorate([
    (0, cqrs_1.CommandHandler)(create_course_command_1.CreateCourseCommand),
    __param(0, (0, typeorm_1.InjectRepository)(course_entity_1.CourseEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof cqrs_1.EventBus !== "undefined" && cqrs_1.EventBus) === "function" ? _b : Object])
], CreateCourseHandler);


/***/ },

/***/ "./apps/course-service/src/application/handlers/delete-course.handler.ts"
/*!*******************************************************************************!*\
  !*** ./apps/course-service/src/application/handlers/delete-course.handler.ts ***!
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteCourseHandler = void 0;
const cqrs_1 = __webpack_require__(/*! @nestjs/cqrs */ "@nestjs/cqrs");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const course_entity_1 = __webpack_require__(/*! ../../infrastructure/persistence/entities/course.entity */ "./apps/course-service/src/infrastructure/persistence/entities/course.entity.ts");
const delete_course_command_1 = __webpack_require__(/*! ../commands/delete-course.command */ "./apps/course-service/src/application/commands/delete-course.command.ts");
const course_deleted_event_1 = __webpack_require__(/*! ../../domain/events/course-deleted.event */ "./apps/course-service/src/domain/events/course-deleted.event.ts");
let DeleteCourseHandler = class DeleteCourseHandler {
    courseRepo;
    eventBus;
    constructor(courseRepo, eventBus) {
        this.courseRepo = courseRepo;
        this.eventBus = eventBus;
    }
    async execute(command) {
        await this.courseRepo.delete(command.id);
        console.log(`🗑️ [Delete] Curso eliminado de moodle_w: ${command.id}`);
        this.eventBus.publish(new course_deleted_event_1.CourseDeletedEvent(command.id));
    }
};
exports.DeleteCourseHandler = DeleteCourseHandler;
exports.DeleteCourseHandler = DeleteCourseHandler = __decorate([
    (0, cqrs_1.CommandHandler)(delete_course_command_1.DeleteCourseCommand),
    __param(0, (0, typeorm_1.InjectRepository)(course_entity_1.CourseEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof cqrs_1.EventBus !== "undefined" && cqrs_1.EventBus) === "function" ? _b : Object])
], DeleteCourseHandler);


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

/***/ "./apps/course-service/src/application/handlers/get-course-students.handler.ts"
/*!*************************************************************************************!*\
  !*** ./apps/course-service/src/application/handlers/get-course-students.handler.ts ***!
  \*************************************************************************************/
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
exports.GetCourseStudentsHandler = void 0;
const cqrs_1 = __webpack_require__(/*! @nestjs/cqrs */ "@nestjs/cqrs");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const enrollment_entity_1 = __webpack_require__(/*! ../../infrastructure/persistence/entities/enrollment.entity */ "./apps/course-service/src/infrastructure/persistence/entities/enrollment.entity.ts");
const user_view_entity_1 = __webpack_require__(/*! ../../infrastructure/persistence/entities/user-view.entity */ "./apps/course-service/src/infrastructure/persistence/entities/user-view.entity.ts");
const get_course_students_query_1 = __webpack_require__(/*! ../queries/get-course-students.query */ "./apps/course-service/src/application/queries/get-course-students.query.ts");
let GetCourseStudentsHandler = class GetCourseStudentsHandler {
    enrollmentRepo;
    userReadRepo;
    constructor(enrollmentRepo, userReadRepo) {
        this.enrollmentRepo = enrollmentRepo;
        this.userReadRepo = userReadRepo;
    }
    async execute(query) {
        const { courseId } = query;
        console.log(`🔍 [Query] Buscando estudiantes para el curso: ${courseId}`);
        const enrollments = await this.enrollmentRepo.find({
            where: { courseId: courseId },
            select: ['studentId'],
        });
        if (enrollments.length === 0) {
            return [];
        }
        const studentIds = enrollments.map((e) => e.studentId);
        const students = await this.userReadRepo.find({
            where: {
                id: (0, typeorm_2.In)(studentIds),
            },
        });
        console.log(`✅ Encontrados ${students.length} estudiantes.`);
        return students;
    }
};
exports.GetCourseStudentsHandler = GetCourseStudentsHandler;
exports.GetCourseStudentsHandler = GetCourseStudentsHandler = __decorate([
    (0, cqrs_1.QueryHandler)(get_course_students_query_1.GetCourseStudentsQuery),
    __param(0, (0, typeorm_1.InjectRepository)(enrollment_entity_1.EnrollmentEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_view_entity_1.UserViewEntity, 'READ_CONNECTION')),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], GetCourseStudentsHandler);


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

/***/ "./apps/course-service/src/application/handlers/get-student-courses.handler.ts"
/*!*************************************************************************************!*\
  !*** ./apps/course-service/src/application/handlers/get-student-courses.handler.ts ***!
  \*************************************************************************************/
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
exports.GetStudentCoursesHandler = void 0;
const cqrs_1 = __webpack_require__(/*! @nestjs/cqrs */ "@nestjs/cqrs");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const enrollment_entity_1 = __webpack_require__(/*! ../../infrastructure/persistence/entities/enrollment.entity */ "./apps/course-service/src/infrastructure/persistence/entities/enrollment.entity.ts");
const course_view_entity_1 = __webpack_require__(/*! ../../infrastructure/persistence/entities/course-view.entity */ "./apps/course-service/src/infrastructure/persistence/entities/course-view.entity.ts");
const get_student_courses_query_1 = __webpack_require__(/*! ../queries/get-student-courses.query */ "./apps/course-service/src/application/queries/get-student-courses.query.ts");
let GetStudentCoursesHandler = class GetStudentCoursesHandler {
    enrollmentRepo;
    courseReadRepo;
    constructor(enrollmentRepo, courseReadRepo) {
        this.enrollmentRepo = enrollmentRepo;
        this.courseReadRepo = courseReadRepo;
    }
    async execute(query) {
        const { studentId } = query;
        console.log(`🔍 [Query] Buscando cursos para el estudiante: ${studentId}`);
        const enrollments = await this.enrollmentRepo.find({
            where: { studentId },
            select: ['courseId'],
        });
        if (enrollments.length === 0) {
            return [];
        }
        const courseIds = enrollments.map((e) => e.courseId);
        const courses = await this.courseReadRepo.find({
            where: {
                id: (0, typeorm_2.In)(courseIds),
            },
        });
        return courses;
    }
};
exports.GetStudentCoursesHandler = GetStudentCoursesHandler;
exports.GetStudentCoursesHandler = GetStudentCoursesHandler = __decorate([
    (0, cqrs_1.QueryHandler)(get_student_courses_query_1.GetStudentCoursesQuery),
    __param(0, (0, typeorm_1.InjectRepository)(enrollment_entity_1.EnrollmentEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(course_view_entity_1.CourseViewEntity, 'READ_CONNECTION')),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], GetStudentCoursesHandler);


/***/ },

/***/ "./apps/course-service/src/application/handlers/get-users.handler.ts"
/*!***************************************************************************!*\
  !*** ./apps/course-service/src/application/handlers/get-users.handler.ts ***!
  \***************************************************************************/
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
exports.GetUsersHandler = void 0;
const cqrs_1 = __webpack_require__(/*! @nestjs/cqrs */ "@nestjs/cqrs");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const user_view_entity_1 = __webpack_require__(/*! ../../infrastructure/persistence/entities/user-view.entity */ "./apps/course-service/src/infrastructure/persistence/entities/user-view.entity.ts");
const get_users_query_1 = __webpack_require__(/*! ../queries/get-users.query */ "./apps/course-service/src/application/queries/get-users.query.ts");
let GetUsersHandler = class GetUsersHandler {
    userReadRepo;
    constructor(userReadRepo) {
        this.userReadRepo = userReadRepo;
    }
    async execute(query) {
        const { role } = query;
        console.log(`🔍 [Query] Buscando usuarios con rol: ${role || 'TODOS'}`);
        const whereCondition = role ? { role } : {};
        return await this.userReadRepo.find({
            where: whereCondition
        });
    }
};
exports.GetUsersHandler = GetUsersHandler;
exports.GetUsersHandler = GetUsersHandler = __decorate([
    (0, cqrs_1.QueryHandler)(get_users_query_1.GetUsersQuery),
    __param(0, (0, typeorm_1.InjectRepository)(user_view_entity_1.UserViewEntity, 'READ_CONNECTION')),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], GetUsersHandler);


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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SyncCourseStatusUpdatedHandler = exports.SyncCourseDeletedHandler = exports.SyncCourseCreatedHandler = void 0;
const cqrs_1 = __webpack_require__(/*! @nestjs/cqrs */ "@nestjs/cqrs");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const course_view_entity_1 = __webpack_require__(/*! ../../infrastructure/persistence/entities/course-view.entity */ "./apps/course-service/src/infrastructure/persistence/entities/course-view.entity.ts");
const course_created_event_1 = __webpack_require__(/*! ../../domain/events/course-created.event */ "./apps/course-service/src/domain/events/course-created.event.ts");
const course_deleted_event_1 = __webpack_require__(/*! ../../domain/events/course-deleted.event */ "./apps/course-service/src/domain/events/course-deleted.event.ts");
const course_status_updated_event_1 = __webpack_require__(/*! ../../domain/events/course-status-updated.event */ "./apps/course-service/src/domain/events/course-status-updated.event.ts");
let SyncCourseCreatedHandler = class SyncCourseCreatedHandler {
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
exports.SyncCourseCreatedHandler = SyncCourseCreatedHandler;
exports.SyncCourseCreatedHandler = SyncCourseCreatedHandler = __decorate([
    (0, cqrs_1.EventsHandler)(course_created_event_1.CourseCreatedEvent),
    __param(0, (0, typeorm_1.InjectRepository)(course_view_entity_1.CourseViewEntity, 'READ_CONNECTION')),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], SyncCourseCreatedHandler);
let SyncCourseDeletedHandler = class SyncCourseDeletedHandler {
    readRepository;
    constructor(readRepository) {
        this.readRepository = readRepository;
    }
    async handle(event) {
        console.log(`🔄 [Sync] Eliminando curso de moodle_r (Read DB)...`);
        await this.readRepository.delete(event.id);
        console.log(`✅ [Sync] Curso eliminado de la vista.`);
    }
};
exports.SyncCourseDeletedHandler = SyncCourseDeletedHandler;
exports.SyncCourseDeletedHandler = SyncCourseDeletedHandler = __decorate([
    (0, cqrs_1.EventsHandler)(course_deleted_event_1.CourseDeletedEvent),
    __param(0, (0, typeorm_1.InjectRepository)(course_view_entity_1.CourseViewEntity, 'READ_CONNECTION')),
    __metadata("design:paramtypes", [typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], SyncCourseDeletedHandler);
let SyncCourseStatusUpdatedHandler = class SyncCourseStatusUpdatedHandler {
    readRepository;
    constructor(readRepository) {
        this.readRepository = readRepository;
    }
    async handle(event) {
        console.log(`🔄 [Sync] Actualizando estado en moodle_r...`);
        await this.readRepository.update(event.id, {
            isActive: event.isActive
        });
        console.log(`✅ [Sync] Curso ${event.id} ahora está ${event.isActive ? 'ACTIVO' : 'INACTIVO'} en vista.`);
    }
};
exports.SyncCourseStatusUpdatedHandler = SyncCourseStatusUpdatedHandler;
exports.SyncCourseStatusUpdatedHandler = SyncCourseStatusUpdatedHandler = __decorate([
    (0, cqrs_1.EventsHandler)(course_status_updated_event_1.CourseStatusUpdatedEvent),
    __param(0, (0, typeorm_1.InjectRepository)(course_view_entity_1.CourseViewEntity, 'READ_CONNECTION')),
    __metadata("design:paramtypes", [typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object])
], SyncCourseStatusUpdatedHandler);


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

/***/ "./apps/course-service/src/application/handlers/update-course-status.handler.ts"
/*!**************************************************************************************!*\
  !*** ./apps/course-service/src/application/handlers/update-course-status.handler.ts ***!
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
exports.UpdateCourseStatusHandler = void 0;
const cqrs_1 = __webpack_require__(/*! @nestjs/cqrs */ "@nestjs/cqrs");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const course_entity_1 = __webpack_require__(/*! ../../infrastructure/persistence/entities/course.entity */ "./apps/course-service/src/infrastructure/persistence/entities/course.entity.ts");
const update_course_status_command_1 = __webpack_require__(/*! ../commands/update-course-status.command */ "./apps/course-service/src/application/commands/update-course-status.command.ts");
const course_status_updated_event_1 = __webpack_require__(/*! ../../domain/events/course-status-updated.event */ "./apps/course-service/src/domain/events/course-status-updated.event.ts");
let UpdateCourseStatusHandler = class UpdateCourseStatusHandler {
    courseRepo;
    eventBus;
    constructor(courseRepo, eventBus) {
        this.courseRepo = courseRepo;
        this.eventBus = eventBus;
    }
    async execute(command) {
        console.log(`🛠️ [Write DB] Actualizando estado curso ${command.id} a: ${command.isActive}`);
        await this.courseRepo.update(command.id, {
            isActive: command.isActive
        });
        this.eventBus.publish(new course_status_updated_event_1.CourseStatusUpdatedEvent(command.id, command.isActive));
    }
};
exports.UpdateCourseStatusHandler = UpdateCourseStatusHandler;
exports.UpdateCourseStatusHandler = UpdateCourseStatusHandler = __decorate([
    (0, cqrs_1.CommandHandler)(update_course_status_command_1.UpdateCourseStatusCommand),
    __param(0, (0, typeorm_1.InjectRepository)(course_entity_1.CourseEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof cqrs_1.EventBus !== "undefined" && cqrs_1.EventBus) === "function" ? _b : Object])
], UpdateCourseStatusHandler);


/***/ },

/***/ "./apps/course-service/src/application/queries/get-course-students.query.ts"
/*!**********************************************************************************!*\
  !*** ./apps/course-service/src/application/queries/get-course-students.query.ts ***!
  \**********************************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetCourseStudentsQuery = void 0;
class GetCourseStudentsQuery {
    courseId;
    constructor(courseId) {
        this.courseId = courseId;
    }
}
exports.GetCourseStudentsQuery = GetCourseStudentsQuery;


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

/***/ "./apps/course-service/src/application/queries/get-student-courses.query.ts"
/*!**********************************************************************************!*\
  !*** ./apps/course-service/src/application/queries/get-student-courses.query.ts ***!
  \**********************************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetStudentCoursesQuery = void 0;
class GetStudentCoursesQuery {
    studentId;
    constructor(studentId) {
        this.studentId = studentId;
    }
}
exports.GetStudentCoursesQuery = GetStudentCoursesQuery;


/***/ },

/***/ "./apps/course-service/src/application/queries/get-users.query.ts"
/*!************************************************************************!*\
  !*** ./apps/course-service/src/application/queries/get-users.query.ts ***!
  \************************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetUsersQuery = void 0;
class GetUsersQuery {
    role;
    constructor(role) {
        this.role = role;
    }
}
exports.GetUsersQuery = GetUsersQuery;


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
const cqrs_1 = __webpack_require__(/*! @nestjs/cqrs */ "@nestjs/cqrs");
const get_courses_handler_1 = __webpack_require__(/*! ./application/handlers/get-courses.handler */ "./apps/course-service/src/application/handlers/get-courses.handler.ts");
const unenroll_student_handler_1 = __webpack_require__(/*! ./application/handlers/unenroll-student.handler */ "./apps/course-service/src/application/handlers/unenroll-student.handler.ts");
const create_course_handler_1 = __webpack_require__(/*! ./application/handlers/create-course.handler */ "./apps/course-service/src/application/handlers/create-course.handler.ts");
const sync_course_read_model_handler_1 = __webpack_require__(/*! ./application/handlers/sync-course-read-model.handler */ "./apps/course-service/src/application/handlers/sync-course-read-model.handler.ts");
const course_repository_port_1 = __webpack_require__(/*! ./ports/course.repository.port */ "./apps/course-service/src/ports/course.repository.port.ts");
const postgres_course_repository_1 = __webpack_require__(/*! ./infrastructure/persistence/repositories/postgres-course.repository */ "./apps/course-service/src/infrastructure/persistence/repositories/postgres-course.repository.ts");
const course_entity_1 = __webpack_require__(/*! ./infrastructure/persistence/entities/course.entity */ "./apps/course-service/src/infrastructure/persistence/entities/course.entity.ts");
const course_view_entity_1 = __webpack_require__(/*! ./infrastructure/persistence/entities/course-view.entity */ "./apps/course-service/src/infrastructure/persistence/entities/course-view.entity.ts");
const course_controller_1 = __webpack_require__(/*! ./infrastructure/controllers/course.controller */ "./apps/course-service/src/infrastructure/controllers/course.controller.ts");
const enrollment_entity_1 = __webpack_require__(/*! ./infrastructure/persistence/entities/enrollment.entity */ "./apps/course-service/src/infrastructure/persistence/entities/enrollment.entity.ts");
const enroll_student_handler_1 = __webpack_require__(/*! ./application/handlers/enroll-student.handler */ "./apps/course-service/src/application/handlers/enroll-student.handler.ts");
const user_view_entity_1 = __webpack_require__(/*! ./infrastructure/persistence/entities/user-view.entity */ "./apps/course-service/src/infrastructure/persistence/entities/user-view.entity.ts");
const delete_course_handler_1 = __webpack_require__(/*! ./application/handlers/delete-course.handler */ "./apps/course-service/src/application/handlers/delete-course.handler.ts");
const get_users_handler_1 = __webpack_require__(/*! ./application/handlers/get-users.handler */ "./apps/course-service/src/application/handlers/get-users.handler.ts");
const get_course_students_handler_1 = __webpack_require__(/*! ./application/handlers/get-course-students.handler */ "./apps/course-service/src/application/handlers/get-course-students.handler.ts");
const update_course_status_handler_1 = __webpack_require__(/*! ./application/handlers/update-course-status.handler */ "./apps/course-service/src/application/handlers/update-course-status.handler.ts");
const get_student_courses_handler_1 = __webpack_require__(/*! ./application/handlers/get-student-courses.handler */ "./apps/course-service/src/application/handlers/get-student-courses.handler.ts");
let CourseServiceModule = class CourseServiceModule {
};
exports.CourseServiceModule = CourseServiceModule;
exports.CourseServiceModule = CourseServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
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
        controllers: [course_controller_1.CourseController],
        providers: [
            update_course_status_handler_1.UpdateCourseStatusHandler,
            get_course_students_handler_1.GetCourseStudentsHandler,
            get_users_handler_1.GetUsersHandler,
            delete_course_handler_1.DeleteCourseHandler,
            enroll_student_handler_1.EnrollStudentHandler,
            create_course_handler_1.CreateCourseHandler,
            sync_course_read_model_handler_1.SyncCourseCreatedHandler,
            sync_course_read_model_handler_1.SyncCourseDeletedHandler,
            sync_course_read_model_handler_1.SyncCourseStatusUpdatedHandler,
            get_courses_handler_1.GetCoursesHandler,
            unenroll_student_handler_1.UnenrollStudentHandler,
            get_student_courses_handler_1.GetStudentCoursesHandler,
            { provide: course_repository_port_1.CourseRepositoryPort, useClass: postgres_course_repository_1.PostgresCourseRepository },
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

/***/ "./apps/course-service/src/domain/events/course-deleted.event.ts"
/*!***********************************************************************!*\
  !*** ./apps/course-service/src/domain/events/course-deleted.event.ts ***!
  \***********************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CourseDeletedEvent = void 0;
class CourseDeletedEvent {
    id;
    constructor(id) {
        this.id = id;
    }
}
exports.CourseDeletedEvent = CourseDeletedEvent;


/***/ },

/***/ "./apps/course-service/src/domain/events/course-status-updated.event.ts"
/*!******************************************************************************!*\
  !*** ./apps/course-service/src/domain/events/course-status-updated.event.ts ***!
  \******************************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CourseStatusUpdatedEvent = void 0;
class CourseStatusUpdatedEvent {
    id;
    isActive;
    constructor(id, isActive) {
        this.id = id;
        this.isActive = isActive;
    }
}
exports.CourseStatusUpdatedEvent = CourseStatusUpdatedEvent;


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
const create_course_command_1 = __webpack_require__(/*! ../../application/commands/create-course.command */ "./apps/course-service/src/application/commands/create-course.command.ts");
const delete_course_command_1 = __webpack_require__(/*! ../../application/commands/delete-course.command */ "./apps/course-service/src/application/commands/delete-course.command.ts");
const get_users_query_1 = __webpack_require__(/*! ../../application/queries/get-users.query */ "./apps/course-service/src/application/queries/get-users.query.ts");
const get_course_students_query_1 = __webpack_require__(/*! ../../application/queries/get-course-students.query */ "./apps/course-service/src/application/queries/get-course-students.query.ts");
const update_course_status_command_1 = __webpack_require__(/*! ../../application/commands/update-course-status.command */ "./apps/course-service/src/application/commands/update-course-status.command.ts");
const get_student_courses_query_1 = __webpack_require__(/*! ../../application/queries/get-student-courses.query */ "./apps/course-service/src/application/queries/get-student-courses.query.ts");
let CourseController = class CourseController {
    commandBus;
    queryBus;
    constructor(commandBus, queryBus) {
        this.commandBus = commandBus;
        this.queryBus = queryBus;
    }
    async create(message) {
        console.log('🐯 [Course Service] Mensaje Kafka recibido:', message);
        return this.commandBus.execute(new create_course_command_1.CreateCourseCommand(message.title, message.videoUrl, message.id));
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
    async deleteCourse(data) {
        return this.commandBus.execute(new delete_course_command_1.DeleteCourseCommand(data.id));
    }
    async getUsers(data) {
        return this.queryBus.execute(new get_users_query_1.GetUsersQuery(data.role));
    }
    async getCourseStudents(data) {
        return this.queryBus.execute(new get_course_students_query_1.GetCourseStudentsQuery(data.courseId));
    }
    async updateStatus(data) {
        return this.commandBus.execute(new update_course_status_command_1.UpdateCourseStatusCommand(data.id, data.isActive));
    }
    async getMyCourses(data) {
        return this.queryBus.execute(new get_student_courses_query_1.GetStudentCoursesQuery(data.studentId));
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
__decorate([
    (0, microservices_1.MessagePattern)('delete.course'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "deleteCourse", null);
__decorate([
    (0, microservices_1.MessagePattern)('get.users'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getUsers", null);
__decorate([
    (0, microservices_1.MessagePattern)('get.course.students'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getCourseStudents", null);
__decorate([
    (0, microservices_1.MessagePattern)('update.course.status'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "updateStatus", null);
__decorate([
    (0, microservices_1.MessagePattern)('get.my.courses'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getMyCourses", null);
exports.CourseController = CourseController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof cqrs_1.CommandBus !== "undefined" && cqrs_1.CommandBus) === "function" ? _a : Object, typeof (_b = typeof cqrs_1.QueryBus !== "undefined" && cqrs_1.QueryBus) === "function" ? _b : Object])
], CourseController);


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
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EnrollmentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'course_id', nullable: false }),
    __metadata("design:type", String)
], EnrollmentEntity.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'student_id', nullable: false }),
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