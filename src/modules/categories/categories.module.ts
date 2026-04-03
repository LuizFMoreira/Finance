import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';

@Module({
  providers: [CategoriesService, SupabaseAuthGuard],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
