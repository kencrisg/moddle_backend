import { Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UserCreatedEvent } from '../../domain/events/user-created.event';
import { UserViewEntity } from '../../infrastructure/persistence/entities/user-view.entity';

@Injectable()
export class SyncUserReadModelHandler implements OnModuleInit {
    constructor(
        @InjectRepository(UserViewEntity, 'READ_CONNECTION')
        private readonly readRepository: Repository<UserViewEntity>,
        @InjectDataSource('READ_CONNECTION')
        private readonly dataSource: DataSource,
    ) { }

    async onModuleInit() {}
    

    @OnEvent('UserCreatedEvent')
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