import { Body, Controller, Get, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginDto } from '../dtos/login.dto';

@Controller('auth')
export class AuthController implements OnModuleInit {
    constructor(
        // 1. Cliente para AUTH (Login y Registro real)
        @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
        
        // 2. Cliente para CURSOS (Para leer la lista de estudiantes de la BDD Read)
        @Inject('COURSE_SERVICE') private readonly courseClient: ClientKafka,
    ) { }

    async onModuleInit() {
        // Suscripciones de Auth
        this.authClient.subscribeToResponseOf('create.user');
        this.authClient.subscribeToResponseOf('auth.login');
        
        // Suscripciones de Course (Lectura)
        this.courseClient.subscribeToResponseOf('get.users');

        await this.authClient.connect();
        await this.courseClient.connect();
    }

    @Post('register')
    createUser(@Body() body: CreateUserDto) {
        // Registro va a AUTH-SERVICE (Dueño de la escritura)
        return this.authClient.send('create.user', {
            id: crypto.randomUUID(),
            ...body,
        });
    }

    @Post('login')
    loginUser(@Body() body: LoginDto) {
        // Login va a AUTH-SERVICE
        return this.authClient.send('auth.login', body);
    }

    @Get('users')
    getUsers() {
        // Leer lista va a COURSE-SERVICE (Dueño de la BDD de Lectura/Vista)
        console.log('📨 Gateway: Pidiendo estudiantes a la Vista de Cursos...');
        return this.courseClient.send('get.users', { role: 's' }); 
    }
}