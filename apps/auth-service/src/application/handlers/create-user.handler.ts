import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from '../../infrastructure/persistence/entities/user.entity';
import { CreateUserCommand } from '../commands/create-user.command';
import { UserCreatedEvent } from '../../domain/events/user-created.event';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        @Inject('KAFKA_SERVICE')
        private readonly kafkaClient: ClientKafka,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    async execute(command: CreateUserCommand): Promise<void> {
        const user = new UserEntity();
        user.id = command.id;
        user.email = command.email;
        user.password = command.password;
        user.fullName = command.fullName;
        user.role = command.role || 's'; // Default: student

        try {
            await this.userRepo.save(user);
            console.log(`👤 [Auth] Usuario guardado en moodle_w: ${user.email} con rol: ${user.role}`);

            // Publish event to Kafka for other microservices
            const event = new UserCreatedEvent(
                user.id,
                user.email,
                user.password,
                user.fullName,
                user.role,
            );

            // 2. Emitir Localmente (Sincronización Read Model)
            this.eventEmitter.emit('UserCreatedEvent', event);

            console.log(`📢 [Auth] Evento user.created emitido Localmente`);
        } catch (error) {
            console.error('Error creando usuario:', error);
            throw error;
        }
    }
}
