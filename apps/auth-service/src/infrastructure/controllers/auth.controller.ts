import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../application/commands/create-user.command';
import { LoginHandler } from '../../application/handlers/login.handler';
import { RpcException } from '@nestjs/microservices';
import { UserCreatedEvent } from '../../domain/events/user-created.event';
import { SyncUserReadModelHandler } from '../../application/handlers/sync-create-user.handler';

@Controller()
export class AuthController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly loginHandler: LoginHandler,
        private readonly syncUserHandler: SyncUserReadModelHandler,
    ) { }

    @MessagePattern('create.user')
    async createUser(@Payload() data: any) {
        console.log(`🔐 [Auth] Recibido create.user: ${data.email}`);
        return this.commandBus.execute(
            new CreateUserCommand(data.id, data.email, data.password, data.fullName, data.role),
        );
    }

     @EventPattern('user.created')
        async handleUserCreated(@Payload() data: any) {
            console.log(`📥 [Course] Recibido evento user.created: ${data.email}`);
            const event = new UserCreatedEvent(
                data.id,
                data.email,
                data.password,
                data.fullName,
                data.role,
            );
            await this.syncUserHandler.handle(event);
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
