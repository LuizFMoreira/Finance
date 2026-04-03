import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';

@Module({
  providers: [DashboardService, SupabaseAuthGuard],
  controllers: [DashboardController],
})
export class DashboardModule {}
