import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // ── Segurança de cabeçalhos HTTP ──────────────────────────────────────────
  app.use(helmet());

  // ── Cookie parser (necessário para HttpOnly cookies) ──────────────────────
  app.use(cookieParser());

  // ── CORS: apenas o frontend autorizado ───────────────────────────────────
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // obrigatório para enviar cookies cross-origin
  });

  // ── Validação e sanitização de payload ────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false }, // desabilitado: sem coerção implícita
    }),
  );

  // ── Filtro global de exceções ─────────────────────────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Pluma API rodando em http://localhost:${port}`);
}
bootstrap();
