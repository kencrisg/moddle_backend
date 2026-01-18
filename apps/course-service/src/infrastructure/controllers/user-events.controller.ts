import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SyncUserReadModelHandler } from '../../application/handlers/sync-user-read-model.handler';
import { UserCreatedEvent } from '../../domain/events/user-created.event';

@Controller()
export class UserEventsController {
    constructor(
        private readonly syncUserHandler: SyncUserReadModelHandler,
    ) { }

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
}
