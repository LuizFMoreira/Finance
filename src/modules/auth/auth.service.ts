import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
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
      throw new InternalServerErrorException(error.message);
    }

    if (!data.user) {
      throw new InternalServerErrorException('Erro ao criar usuário');
    }

    // Cria o perfil do usuário
    const { error: profileError } = await this.supabase
      .getClient()
      .from('profiles')
      .insert({ id: data.user.id, name: dto.name });

    if (profileError) {
      throw new InternalServerErrorException(profileError.message);
    }

    return {
      user: { id: data.user.id, email: data.user.email, name: dto.name },
      access_token: data.session?.access_token ?? null,
    };
  }

  async login(dto: LoginDto) {
    const { data, error } = await this.supabase
      .getClient()
      .auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

    if (error || !data.user) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    // Busca o perfil para retornar o nome
    const { data: profile } = await this.supabase
      .getClient()
      .from('profiles')
      .select('name')
      .eq('id', data.user.id)
      .single();

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name ?? '',
      },
      access_token: data.session.access_token,
    };
  }

  async me(userId: string) {
    const { data: profile } = await this.supabase
      .getClient()
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return profile;
  }

  async logout(token: string) {
    await this.supabase.getClient().auth.admin.signOut(token);
    return { message: 'Sessão encerrada' };
  }
}
