import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async signup(dto: SignupDto) {
    const { data, error } = await this.supabase.getClient().auth.signUp({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      if (error.message.includes('already registered')) {
        throw new ConflictException('Email já cadastrado');
      }
      this.logger.error(`Signup error: ${error.message}`);
      throw new InternalServerErrorException('Erro ao criar conta');
    }

    if (!data.user) {
      throw new InternalServerErrorException('Erro ao criar conta');
    }

    const { error: profileError } = await this.supabase
      .getClient()
      .from('profiles')
      .insert({ id: data.user.id, name: dto.name, email: dto.email });

    if (profileError) {
      this.logger.error(`Profile insert error: ${profileError.message}`);
      throw new InternalServerErrorException('Erro ao criar perfil');
    }

    return {
      user: { id: data.user.id, email: data.user.email, name: dto.name },
      access_token: data.session?.access_token ?? null,
    };
  }

  async login(dto: LoginDto) {
    const { data, error } = await this.supabase
      .getClient()
      .auth.signInWithPassword({ email: dto.email, password: dto.password });

    if (error || !data.user) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    const { data: profile } = await this.supabase
      .getClient()
      .from('profiles')
      .select('name')
      .eq('id', data.user.id)
      .single();

    return {
      user: { id: data.user.id, email: data.user.email, name: profile?.name ?? '' },
      access_token: data.session.access_token,
    };
  }

  async me(userId: string) {
    const { data: profile, error } = await this.supabase
      .getClient()
      .from('profiles')
      .select('id, name, email, created_at')
      .eq('id', userId)
      .single();

    if (error) {
      this.logger.error(`Profile fetch error: ${error.message}`);
      throw new InternalServerErrorException('Erro ao buscar perfil');
    }

    return profile;
  }

  async logout(userId: string) {
    try {
      await this.supabase.getClient().auth.admin.signOut(userId);
    } catch (err) {
      this.logger.warn(`Logout error for user ${userId}: ${err}`);
    }
    return { message: 'Sessão encerrada' };
  }
}
