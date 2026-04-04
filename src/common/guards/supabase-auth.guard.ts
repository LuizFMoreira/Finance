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

    // Lê token do cookie HttpOnly (preferencial) ou do header Authorization
    const cookieToken: string | undefined = (request as any).cookies?.pluma_session;
    const authHeader = request.headers['authorization'];
    const headerToken =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : undefined;

    const token = cookieToken ?? headerToken;

    if (!token) {
      throw new UnauthorizedException('Token de autenticação não fornecido');
    }

    const { data, error } = await this.supabase.getClient().auth.getUser(token);

    if (error || !data.user) {
      this.logger.warn(`Token inválido ou expirado`);
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    (request as any).user = data.user;
    return true;
  }
}
