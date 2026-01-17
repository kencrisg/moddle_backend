import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserViewEntity } from '../../infrastructure/persistence/entities/user-view.entity';
import { UserCreatedEvent } from '../../domain/events/user-created.event';

@Injectable()
export class SyncUserReadModelHandler {
  constructor(
    @InjectRepository(UserViewEntity, 'READ_CONNECTION') // <--- Conexión de LECTURA
    private readonly readRepository: Repository<UserViewEntity>,
  ) {}

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