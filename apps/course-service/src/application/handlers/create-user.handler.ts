import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter'; // <--- IMPORTAR
import { UserEntity } from '../../infrastructure/persistence/entities/user.entity';
import { CreateUserCommand } from '../commands/create-user.command';
import { UserCreatedEvent } from '../../domain/events/user-created.event'; // <--- IMPORTAR

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly eventEmitter: EventEmitter2, // <--- INYECTAR EVENT EMITTER
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const user = new UserEntity();
    user.id = command.id;
    user.email = command.email;
    user.password = command.password;
    user.fullName = command.fullName;
    user.role = 's'; // Por defecto 'student'

    try {
      // 1. Guardar en Base de Escritura (Write Side)
      await this.userRepo.save(user);
      console.log(`👤 [User] Usuario guardado en moodle_w: ${user.email}`);

      // 2. Disparar Evento de Dominio (Para CQRS)
      this.eventEmitter.emit(
        'UserCreatedEvent',
        new UserCreatedEvent(user.id, user.email, user.password, user.fullName, user.role),
      );
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  }
}