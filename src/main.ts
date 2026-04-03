import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // ── Segurança de cabeçalhos HTTP ──────────────────────────────────────────
  app.use(helmet());

  // ── CORS: apenas o frontend local em desenvolvimento ──────────────────────
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ── Validação e sanitização de payload ────────────────────────────────────
  // whitelist: remove campos não declarados no DTO
  // forbidNonWhitelisted: lança 400 se campos extras forem enviados
  // transform: converte tipos automaticamente (string → number, etc.)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Filtro global de exceções ─────────────────────────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Pluma API rodando em http://localhost:${port}`);
}
bootstrap();
