import { Body, Controller, Post } from '@nestjs/common';
import { LoginHandler } from '../../application/handlers/login.handler';

// Definimos el DTO aquí mismo para ir rápido (o podrías ponerlo en application/commands)
class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthServiceController {
  constructor(private readonly loginHandler: LoginHandler) { }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.loginHandler.execute({
      email: body.email,
      password: body.password
    });
  }
}