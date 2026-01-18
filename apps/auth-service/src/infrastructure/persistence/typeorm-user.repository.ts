import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryPort } from '../../ports/user.repository.port';
import { User } from '../../domain/model/user.model';
import { UserEntity } from './entities/user.entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class TypeOrmUserRepository implements UserRepositoryPort {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repo: Repository<UserEntity>,
    ) { }

    async save(user: User): Promise<void> {
        const entity = UserMapper.toEntity(user);
        await this.repo.save(entity);
    }

    async findByEmail(email: string): Promise<User | null> {
        const entity = await this.repo.findOneBy({ email });
        return entity ? UserMapper.toDomain(entity) : null;
    }

    async findById(id: string): Promise<User | null> {
        const entity = await this.repo.findOneBy({ id });
        return entity ? UserMapper.toDomain(entity) : null;
    }
}
