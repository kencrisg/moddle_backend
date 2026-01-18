import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../application/commands/create-user.command';
import { LoginHandler } from '../../application/handlers/login.handler';
import { RpcException } from '@nestjs/microservices';
import { UserCreatedEvent } from '../../domain/events/user-created.event';

@Controller()
export class AuthController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly eventBus: EventBus,
        private readonly loginHandler: LoginHandler,
    ) { }

    @MessagePattern('create.user')
    async createUser(@Payload() data: any) {
        console.log(`🔐 [Auth] Recibido create.user: ${data.email}`);
        return this.commandBus.execute(
            new CreateUserCommand(data.id, data.email, data.password, data.fullName, data.role),
        );
    }

    @EventPattern('sync.user.created')
    async handleUserCreated(@Payload() data: any) {
        console.log(`📥 [Auth] Recibido evento user.created desde Kafka: ${data.email}`);
        const event = new UserCreatedEvent(
            data.id,
            data.email,
            data.password,
            data.fullName,
            data.role,
        );
        // Publicar al EventBus interno para que lo maneje el SyncHandler
        this.eventBus.publish(event);
    }


    @MessagePattern('auth.login')
    async login(@Payload() data: any) {
        console.log(`🔐 [Auth] Recibido auth.login para: ${data.email}`);
        try {
            return await this.loginHandler.execute({
                email: data.email,
                password: data.password,
            });
        } catch (error) {
            throw new RpcException(error.message || 'Error de autenticación');
        }
    }

}
