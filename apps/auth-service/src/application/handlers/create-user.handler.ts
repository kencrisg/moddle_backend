import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    ) { }

    async execute(command: CreateUserCommand): Promise<void> {
        const user = new UserEntity();
        user.id = command.id;
        user.email = command.email;
        user.password = command.password;
        user.fullName = command.fullName;
        user.role = 's'; // Default: student

        try {
            await this.userRepo.save(user);
            console.log(`👤 [Auth] Usuario guardado en moodle_w: ${user.email}`);

            // Publish event to Kafka for other bdd
            const event = new UserCreatedEvent(
                user.id,
                user.email,
                user.password,
                user.fullName,
                user.role,
            );
            this.kafkaClient.emit('user.created', event);
            console.log(`📢 [Auth] Evento user.created emitido a Kafka`);
        } catch (error) {
            console.error('Error creando usuario:', error);
            throw error;
        }
    }
}
