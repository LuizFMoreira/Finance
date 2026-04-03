import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';

@Module({
  providers: [GoalsService, SupabaseAuthGuard],
  controllers: [GoalsController],
})
export class GoalsModule {}
