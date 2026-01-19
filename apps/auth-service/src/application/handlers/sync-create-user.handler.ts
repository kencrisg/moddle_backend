import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreatedEvent } from '../../domain/events/user-created.event';
import { UserViewEntity } from '../../infrastructure/persistence/entities/user-view.entity';

@EventsHandler(UserCreatedEvent)
export class SyncUserReadModelHandler implements IEventHandler<UserCreatedEvent> {
    constructor(
        @InjectRepository(UserViewEntity, 'READ_CONNECTION')
        private readonly readRepository: Repository<UserViewEntity>,
    ) { }

    async handle(event: UserCreatedEvent) {
        console.log('🔄 [Sync] Sincronizando usuario en moodle_r (Read DB)...');

        const viewUser = new UserViewEntity();
        viewUser.id = event.id;
        viewUser.email = event.email;
        viewUser.password = event.password;
        viewUser.fullName = event.fullName;
        viewUser.role = event.role;

        await this.readRepository.save(viewUser);

        console.log('✅ [Sync] ¡Usuario sincronizado en moodle_r!');
    }
}