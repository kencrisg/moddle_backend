import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ name: 'full_name' })
    fullName: string;

    @Column({ default: 's' })
    role: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;
}
