/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        if (!user.canLogin()) {
            throw new common_1.UnauthorizedException('Usuario bloqueado');
        }
        if (password !== user.passwordHash) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
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
const auth_service_controller_1 = __webpack_require__(/*! ./infrastructure/controllers/auth-service.controller */ "./apps/auth-service/src/infrastructure/controllers/auth-service.controller.ts");
const login_handler_1 = __webpack_require__(/*! ./application/handlers/login.handler */ "./apps/auth-service/src/application/handlers/login.handler.ts");
const user_repository_port_1 = __webpack_require__(/*! ./ports/user.repository.port */ "./apps/auth-service/src/ports/user.repository.port.ts");
class InMemoryUserRepository {
    async save(user) { }
    async findByEmail(email) {
        if (email === 'admin@test.com') {
            return {
                id: '1',
                email,
                passwordHash: '123456',
                role: 'a',
                isActive: true,
                canLogin: () => true,
                isAdmin: () => true
            };
        }
        return null;
    }
    async findById(id) { return null; }
}
let AuthServiceModule = class AuthServiceModule {
};
exports.AuthServiceModule = AuthServiceModule;
exports.AuthServiceModule = AuthServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [auth_service_controller_1.AuthServiceController],
        providers: [
            login_handler_1.LoginHandler,
            {
                provide: user_repository_port_1.UserRepositoryPort,
                useClass: InMemoryUserRepository,
            },
        ],
    })
], AuthServiceModule);


/***/ },

/***/ "./apps/auth-service/src/infrastructure/controllers/auth-service.controller.ts"
/*!*************************************************************************************!*\
  !*** ./apps/auth-service/src/infrastructure/controllers/auth-service.controller.ts ***!
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
exports.AuthServiceController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const login_handler_1 = __webpack_require__(/*! ../../application/handlers/login.handler */ "./apps/auth-service/src/application/handlers/login.handler.ts");
class LoginDto {
    email;
    password;
}
let AuthServiceController = class AuthServiceController {
    loginHandler;
    constructor(loginHandler) {
        this.loginHandler = loginHandler;
    }
    async login(body) {
        return this.loginHandler.execute({
            email: body.email,
            password: body.password
        });
    }
};
exports.AuthServiceController = AuthServiceController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthServiceController.prototype, "login", null);
exports.AuthServiceController = AuthServiceController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof login_handler_1.LoginHandler !== "undefined" && login_handler_1.LoginHandler) === "function" ? _a : Object])
], AuthServiceController);


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

/***/ "@nestjs/core"
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
(module) {

module.exports = require("@nestjs/core");

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
const auth_service_module_1 = __webpack_require__(/*! ./auth-service.module */ "./apps/auth-service/src/auth-service.module.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(auth_service_module_1.AuthServiceModule);
    await app.listen(process.env.port ?? 3000);
}
bootstrap();

})();

/******/ })()
;