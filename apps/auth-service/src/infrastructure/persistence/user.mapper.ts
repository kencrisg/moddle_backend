import { User } from '../../domain/model/user.model';
import { UserEntity } from './entities/user.entity';

export class UserMapper {
    static toDomain(entity: UserEntity): User {
        return new User(
            entity.id,
            entity.email,
            entity.password,
            entity.role as 'a' | 's',
            entity.fullName,
            entity.isActive,
        );
    }

    static toEntity(domain: User): UserEntity {
        const entity = new UserEntity();
        entity.id = domain.id;
        entity.email = domain.email;
        entity.password = domain.passwordHash;
        entity.fullName = domain.fullName;
        entity.role = domain.role;
        entity.isActive = domain.isActive;
        return entity;
    }
}
