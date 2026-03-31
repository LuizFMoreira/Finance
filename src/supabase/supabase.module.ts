import { Module, Global } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Global() // 1. Adicionamos esse decorador para torná-lo global
@Module({
  providers: [SupabaseService],
  exports: [SupabaseService], // 2. Exportamos o serviço para os outros módulos poderem usar
})
export class SupabaseModule {}