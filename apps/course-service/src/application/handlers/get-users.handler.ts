import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserViewEntity } from '../../infrastructure/persistence/entities/user-view.entity';
import { GetUsersQuery } from '../queries/get-users.query';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @InjectRepository(UserViewEntity, 'READ_CONNECTION')
    private readonly userReadRepo: Repository<UserViewEntity>,
  ) {}

  async execute(query: GetUsersQuery): Promise<UserViewEntity[]> {
    const { role } = query;
    console.log(`🔍 [Query] Buscando usuarios con rol: ${role || 'TODOS'}`);
    
    const whereCondition = role ? { role } : {};

    return await this.userReadRepo.find({
      where: whereCondition
    });
  }
}