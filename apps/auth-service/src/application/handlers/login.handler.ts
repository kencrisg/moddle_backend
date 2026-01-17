import { UnauthorizedException, Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../ports/user.repository.port';

@Injectable()
export class LoginHandler {
    constructor(private readonly userRepository: UserRepositoryPort) { }

    async execute(command: { email: string; password: string }) {
        const { email, password } = command;

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        if (!user.canLogin()) {
            throw new UnauthorizedException('Usuario bloqueado');
        }

        // Validación simple (luego pondremos hash real)
        if (password !== user.passwordHash) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            token: 'fake-jwt-token', // Luego ponemos JWT real
            message: 'Login Exitoso'
        };
    }
}