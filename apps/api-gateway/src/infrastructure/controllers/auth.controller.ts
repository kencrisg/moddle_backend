import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginDto } from '../dtos/login.dto';

@Controller('auth')
export class AuthController implements OnModuleInit {
    constructor(
        @Inject('COURSE_SERVICE') private readonly kafkaClient: ClientKafka,
    ) { }

    async onModuleInit() {
        this.kafkaClient.subscribeToResponseOf('create.user');
        this.kafkaClient.subscribeToResponseOf('auth.login');
        await this.kafkaClient.connect();
    }

    @Post('register')
    createUser(@Body() body: CreateUserDto) {
        return this.kafkaClient.send('create.user', {
            id: crypto.randomUUID(),
            ...body,
        });
    }

    @Post('login')
    loginUser(@Body() body: LoginDto) {
        return this.kafkaClient.send('auth.login', body);
    }
}
