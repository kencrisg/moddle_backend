import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../infrastructure/persistence/entities/user.entity';
import { CreateUserCommand } from '../commands/create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const user = new UserEntity();
    user.id = command.id;
    user.email = command.email;
    user.password = command.password; 
    user.fullName = command.fullName;
    
    try {
      await this.userRepo.save(user);
      console.log(`👤 [User] Usuario creado: ${user.email}`);
    } catch (error) {
      console.error('Error creando usuario (posible email duplicado)');
      throw error;
    }
  }
}