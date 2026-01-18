/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/auth-service/src/application/commands/create-user.command.ts"
/*!***************************************************************************!*\
  !*** ./apps/auth-service/src/application/commands/create-user.command.ts ***!
  \***************************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserCommand = void 0;
class CreateUserCommand {
    id;
    email;
    password;
    fullName;
    constructor(id, email, password, fullName) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
    }
}
exports.CreateUserCommand = CreateUserCommand;


/***/ },

/***/ "./apps/auth-service/src/application/handlers/create-user.handler.ts"
/*!***************************************************************************!*\
  !*** ./apps/auth-service/src/application/handlers/create-user.handler.ts ***!
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserHandler = void 0;
const cqrs_1 = __webpack_require__(/*! @nestjs/cqrs */ "@nestjs/cqrs");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const user_entity_1 = __webpack_require__(/*! ../../infrastructure/persistence/entities/user.entity */ "./apps/auth-service/src/infrastructure/persistence/entities/user.entity.ts");
const create_user_command_1 = __webpack_require__(/*! ../commands/create-user.command */ "./apps/auth-service/src/application/commands/create-user.command.ts");
const user_created_event_1 = __webpack_require__(/*! ../../domain/events/user-created.event */ "./apps/auth-service/src/domain/events/user-created.event.ts");
let CreateUserHandler = class CreateUserHandler {
    userRepo;
    kafkaClient;
    constructor(userRepo, kafkaClient) {
        this.userRepo = userRepo;
        this.kafkaClient = kafkaClient;
    }
    async execute(command) {
        const user = new user_entity_1.UserEntity();
        user.id = command.id;
        user.email = command.email;
        user.password = command.password;
        user.fullName = command.fullName;
        user.role = 's';
        try {
            await this.userRepo.save(user);
            console.log(`👤 [Auth] Usuario guardado en moodle_w: ${user.email}`);
            const event = new user_created_event_1.UserCreatedEvent(user.id, user.email, user.password, user.fullName, user.role);
            this.kafkaClient.emit('user.created', event);
            console.log(`📢 [Auth] Evento user.created emitido a Kafka`);
        }
        catch (error) {
            console.error('Error creando usuario:', error);
            throw error;
        }
    }
};
exports.CreateUserHandler = CreateUserHandler;
exports.CreateUserHandler = CreateUserHandler = __decorate([
    (0, cqrs_1.CommandHandler)(create_user_command_1.CreateUserCommand),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, common_1.Inject)('KAFKA_SERVICE')),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof microservices_1.ClientKafka !== "undefined" && microservices_1.ClientKafka) === "function" ? _b : Object])
], CreateUserHandler);


/***/ },

/***/ "./apps/auth-service/src/application/handlers/login.handler.ts"
/*!*********************************************************************!*\
  !*** ./apps/auth-service/src/application/handlers/login.handler.ts ***!
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginHandler = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const user_repository_port_1 = __webpack_require__(/*! ../../ports/user.repository.port */ "./apps/auth-service/src/ports/user.repository.port.ts");
let LoginHandler = class LoginHandler {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(command) {
        const { email, password } = command;
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new microservices_1.RpcException({ statusCode: 401, message: 'Credenciales inválidas' });
        }
        if (!user.canLogin()) {
            throw new microservices_1.RpcException({ statusCode: 403, message: 'Usuario bloqueado' });
        }
        if (password !== user.passwordHash) {
            throw new microservices_1.RpcException({ statusCode: 401, message: 'Credenciales inválidas' });
        }
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            token: 'fake-jwt-token',
            message: 'Login Exitoso'
        };
    }
};
exports.LoginHandler = LoginHandler;
exports.LoginHandler = LoginHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof user_repository_port_1.UserRepositoryPort !== "undefined" && user_repository_port_1.UserRepositoryPort) === "function" ? _a : Object])
], LoginHandler);


/***/ },

/***/ "./apps/auth-service/src/auth-service.module.ts"
/*!******************************************************!*\
  !*** ./apps/auth-service/src/auth-service.module.ts ***!
  \******************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthServiceModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const cqrs_1 = __webpack_require__(/*! @nestjs/cqrs */ "@nestjs/cqrs");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const auth_controller_1 = __webpack_require__(/*! ./infrastructure/controllers/auth.controller */ "./apps/auth-service/src/infrastructure/controllers/auth.controller.ts");
const login_handler_1 = __webpack_require__(/*! ./application/handlers/login.handler */ "./apps/auth-service/src/application/handlers/login.handler.ts");
const create_user_handler_1 = __webpack_require__(/*! ./application/handlers/create-user.handler */ "./apps/auth-service/src/application/handlers/create-user.handler.ts");
const user_repository_port_1 = __webpack_require__(/*! ./ports/user.repository.port */ "./apps/auth-service/src/ports/user.repository.port.ts");
const typeorm_user_repository_1 = __webpack_require__(/*! ./infrastructure/persistence/typeorm-user.repository */ "./apps/auth-service/src/infrastructure/persistence/typeorm-user.repository.ts");
const user_entity_1 = __webpack_require__(/*! ./infrastructure/persistence/entities/user.entity */ "./apps/auth-service/src/infrastructure/persistence/entities/user.entity.ts");
let AuthServiceModule = class AuthServiceModule {
};
exports.AuthServiceModule = AuthServiceModule;
exports.AuthServiceModule = AuthServiceModule = __decorate([
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
                    entities: [user_entity_1.UserEntity],
                    synchronize: false,
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity]),
            microservices_1.ClientsModule.register([
                {
                    name: 'KAFKA_SERVICE',
                    transport: microservices_1.Transport.KAFKA,
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
        controllers: [auth_controller_1.AuthController],
        providers: [
            login_handler_1.LoginHandler,
            create_user_handler_1.CreateUserHandler,
            {
                provide: user_repository_port_1.UserRepositoryPort,
                useClass: typeorm_user_repository_1.TypeOrmUserRepository,
            },
        ],
    })
], AuthServiceModule);


/***/ },

/***/ "./apps/auth-service/src/domain/events/user-created.event.ts"
/*!*******************************************************************!*\
  !*** ./apps/auth-service/src/domain/events/user-created.event.ts ***!
  \*******************************************************************/
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

/***/ "./apps/auth-service/src/domain/model/user.model.ts"
/*!**********************************************************!*\
  !*** ./apps/auth-service/src/domain/model/user.model.ts ***!
  \**********************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = void 0;
class User {
    id;
    email;
    passwordHash;
    role;
    fullName;
    isActive;
    constructor(id, email, passwordHash, role, fullName, isActive = true) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.fullName = fullName;
        this.isActive = isActive;
    }
    isAdmin() {
        return this.role === 'a';
    }
    canLogin() {
        return this.isActive;
    }
}
exports.User = User;


/***/ },

/***/ "./apps/auth-service/src/infrastructure/controllers/auth.controller.ts"
/*!*****************************************************************************!*\
  !*** ./apps/auth-service/src/infrastructure/controllers/auth.controller.ts ***!
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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const cqrs_1 = __webpack_require__(/*! @nestjs/cqrs */ "@nestjs/cqrs");
const create_user_command_1 = __webpack_require__(/*! ../../application/commands/create-user.command */ "./apps/auth-service/src/application/commands/create-user.command.ts");
const login_handler_1 = __webpack_require__(/*! ../../application/handlers/login.handler */ "./apps/auth-service/src/application/handlers/login.handler.ts");
const microservices_2 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
let AuthController = class AuthController {
    commandBus;
    loginHandler;
    constructor(commandBus, loginHandler) {
        this.commandBus = commandBus;
        this.loginHandler = loginHandler;
    }
    async createUser(data) {
        console.log(`🔐 [Auth] Recibido create.user: ${data.email}`);
        return this.commandBus.execute(new create_user_command_1.CreateUserCommand(data.id, data.email, data.password, data.fullName));
    }
    async login(data) {
        console.log(`🔐 [Auth] Recibido auth.login para: ${data.email}`);
        try {
            return await this.loginHandler.execute({
                email: data.email,
                password: data.password,
            });
        }
        catch (error) {
            throw new microservices_2.RpcException(error.message || 'Error de autenticación');
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, microservices_1.MessagePattern)('create.user'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createUser", null);
__decorate([
    (0, microservices_1.MessagePattern)('auth.login'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof cqrs_1.CommandBus !== "undefined" && cqrs_1.CommandBus) === "function" ? _a : Object, typeof (_b = typeof login_handler_1.LoginHandler !== "undefined" && login_handler_1.LoginHandler) === "function" ? _b : Object])
], AuthController);


/***/ },

/***/ "./apps/auth-service/src/infrastructure/persistence/entities/user.entity.ts"
/*!**********************************************************************************!*\
  !*** ./apps/auth-service/src/infrastructure/persistence/entities/user.entity.ts ***!
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserEntity = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
let UserEntity = class UserEntity {
    id;
    email;
    password;
    fullName;
    role;
    isActive;
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name' }),
    __metadata("design:type", String)
], UserEntity.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 's' }),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isActive", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)('users')
], UserEntity);


/***/ },

/***/ "./apps/auth-service/src/infrastructure/persistence/typeorm-user.repository.ts"
/*!*************************************************************************************!*\
  !*** ./apps/auth-service/src/infrastructure/persistence/typeorm-user.repository.ts ***!
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypeOrmUserRepository = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const user_entity_1 = __webpack_require__(/*! ./entities/user.entity */ "./apps/auth-service/src/infrastructure/persistence/entities/user.entity.ts");
const user_mapper_1 = __webpack_require__(/*! ./user.mapper */ "./apps/auth-service/src/infrastructure/persistence/user.mapper.ts");
let TypeOrmUserRepository = class TypeOrmUserRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async save(user) {
        const entity = user_mapper_1.UserMapper.toEntity(user);
        await this.repo.save(entity);
    }
    async findByEmail(email) {
        const entity = await this.repo.findOneBy({ email });
        return entity ? user_mapper_1.UserMapper.toDomain(entity) : null;
    }
    async findById(id) {
        const entity = await this.repo.findOneBy({ id });
        return entity ? user_mapper_1.UserMapper.toDomain(entity) : null;
    }
};
exports.TypeOrmUserRepository = TypeOrmUserRepository;
exports.TypeOrmUserRepository = TypeOrmUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], TypeOrmUserRepository);


/***/ },

/***/ "./apps/auth-service/src/infrastructure/persistence/user.mapper.ts"
/*!*************************************************************************!*\
  !*** ./apps/auth-service/src/infrastructure/persistence/user.mapper.ts ***!
  \*************************************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserMapper = void 0;
const user_model_1 = __webpack_require__(/*! ../../domain/model/user.model */ "./apps/auth-service/src/domain/model/user.model.ts");
const user_entity_1 = __webpack_require__(/*! ./entities/user.entity */ "./apps/auth-service/src/infrastructure/persistence/entities/user.entity.ts");
class UserMapper {
    static toDomain(entity) {
        return new user_model_1.User(entity.id, entity.email, entity.password, entity.role, entity.fullName, entity.isActive);
    }
    static toEntity(domain) {
        const entity = new user_entity_1.UserEntity();
        entity.id = domain.id;
        entity.email = domain.email;
        entity.password = domain.passwordHash;
        entity.fullName = domain.fullName;
        entity.role = domain.role;
        entity.isActive = domain.isActive;
        return entity;
    }
}
exports.UserMapper = UserMapper;


/***/ },

/***/ "./apps/auth-service/src/ports/user.repository.port.ts"
/*!*************************************************************!*\
  !*** ./apps/auth-service/src/ports/user.repository.port.ts ***!
  \*************************************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserRepositoryPort = void 0;
class UserRepositoryPort {
}
exports.UserRepositoryPort = UserRepositoryPort;


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
/*!***************************************!*\
  !*** ./apps/auth-service/src/main.ts ***!
  \***************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const microservices_1 = __webpack_require__(/*! @nestjs/microservices */ "@nestjs/microservices");
const auth_service_module_1 = __webpack_require__(/*! ./auth-service.module */ "./apps/auth-service/src/auth-service.module.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(auth_service_module_1.AuthServiceModule, {
        transport: microservices_1.Transport.KAFKA,
        options: {
            client: {
                brokers: ['127.0.0.1:29092'],
            },
            consumer: {
                groupId: 'auth-consumer-group',
            },
        },
    });
    await app.listen();
    console.log('✅ Auth Microservice is listening via Kafka...');
}
bootstrap();

})();

/******/ })()
;