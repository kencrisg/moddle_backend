import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { RpcExceptionFilter } from './infrastructure/filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen(process.env.port ?? 3000);
  console.log(`🚀 API Gateway is running `);
}
bootstrap();
