import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';

@Module({
  providers: [TransactionsService, SupabaseAuthGuard],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
