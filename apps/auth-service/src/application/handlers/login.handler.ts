import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UserRepositoryPort } from '../../ports/user.repository.port';

@Injectable()
export class LoginHandler {
    constructor(private readonly userRepository: UserRepositoryPort) { }

    async execute(command: { email: string; password: string }) {
        const { email, password } = command;

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new RpcException({ statusCode: 401, message: 'Credenciales inválidas' });
        }

        if (!user.canLogin()) {
            throw new RpcException({ statusCode: 403, message: 'Usuario bloqueado' });
        }

        if (password !== user.passwordHash) {
            throw new RpcException({ statusCode: 401, message: 'Credenciales inválidas' });
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            token: 'jwt-token',
            message: 'Login Exitoso'
        };
    }
}