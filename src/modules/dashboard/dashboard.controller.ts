import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@supabase/supabase-js';

@UseGuards(SupabaseAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  summary(@CurrentUser() user: User) {
    return this.dashboardService.summary(user.id);
  }

  @Get('chart')
  chart(@CurrentUser() user: User, @Query('months') months?: string) {
    return this.dashboardService.chart(user.id, months ? Number(months) : 6);
  }

  @Get('insights')
  insights(@CurrentUser() user: User) {
    return this.dashboardService.insights(user.id);
  }
}
