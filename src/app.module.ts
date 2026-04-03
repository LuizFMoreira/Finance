import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { GoalsModule } from './modules/goals/goals.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate Limiting: máx 60 requisições por minuto por IP
    ThrottlerModule.forRoot([
      { ttl: 60_000, limit: 60 },
    ]),

    SupabaseModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    TransactionsModule,
    DashboardModule,
    GoalsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Aplica rate limiting globalmente
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
