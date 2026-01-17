import { Module } from '@nestjs/common';
import { AuthServiceController } from './infrastructure/controllers/auth-service.controller';
import { LoginHandler } from './application/handlers/login.handler';
import { UserRepositoryPort } from './ports/user.repository.port';

// MOCK TEMPORAL: Implementación falsa del repositorio para que compile
// (Luego pondremos la de verdad con TypeORM)
class InMemoryUserRepository implements UserRepositoryPort {
  async save(user: any): Promise<void> {}
  async findByEmail(email: string): Promise<any> { 
    // Usuario Falso para probar login
    if (email === 'admin@test.com') {
      return { 
        id: '1', 
        email, 
        passwordHash: '123456', 
        role: 'a', 
        isActive: true,
        canLogin: () => true,
        isAdmin: () => true
      }; 
    }
    return null; 
  }
  async findById(id: string): Promise<any> { return null; }
}

@Module({
  imports: [],
  controllers: [AuthServiceController],
  providers: [
    LoginHandler, // Registramos el Caso de Uso
    {
      provide: UserRepositoryPort, // Cuando alguien pida el Puerto...
      useClass: InMemoryUserRepository, // ...le damos esta implementación (Inyección de Dependencias)
    },
  ],
})
export class AuthServiceModule {}