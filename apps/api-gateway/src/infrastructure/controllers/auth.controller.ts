import { Body, Controller, Get, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginDto } from '../dtos/login.dto';

@Controller('auth')
export class AuthController implements OnModuleInit {
    constructor(
        // 1. Cliente para AUTH (Login y Registro real)
        @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
    ) { }

    async onModuleInit() {
        this.authClient.subscribeToResponseOf('create.user');
        this.authClient.subscribeToResponseOf('auth.login');

        await this.authClient.connect();
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

   

}