import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(SupabaseAuthGuard.name);

  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticação não fornecido');
    }

    const token = authHeader.slice(7);

    const { data, error } = await this.supabase
      .getClient()
      .auth.getUser(token);

    if (error || !data.user) {
      this.logger.warn(`Token inválido ou expirado: ${error?.message ?? 'sem usuário'}`);
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    // Injeta o usuário autenticado no request para uso nos controllers
    (request as any).user = data.user;
    return true;
  }
}
