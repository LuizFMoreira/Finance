import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const token = authHeader.slice(7);
    const { data, error } = await this.supabase.getClient().auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    request.user = data.user;
    return true;
  }
}
