import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';

@Module({
  providers: [AuthService, SupabaseAuthGuard],
  controllers: [AuthController],
  exports: [SupabaseAuthGuard],
})
export class AuthModule {}
