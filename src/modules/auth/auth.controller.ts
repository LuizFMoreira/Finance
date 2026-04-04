import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@supabase/supabase-js';

const COOKIE_NAME = 'pluma_session';

const cookieOptions = {
  httpOnly: true,                                            // inacessível via JavaScript
  sameSite: 'strict' as const,                             // proteção CSRF
  secure: process.env.NODE_ENV === 'production',           // HTTPS apenas em produção
  maxAge: 7 * 24 * 60 * 60 * 1000,                        // 7 dias
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 5 tentativas por minuto por IP — proteção contra brute force
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post('signup')
  async signup(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signup(dto);
    if (result.access_token) {
      res.cookie(COOKIE_NAME, result.access_token, cookieOptions);
    }
    return { user: result.user };
  }

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    res.cookie(COOKIE_NAME, result.access_token, cookieOptions);
    return { user: result.user };
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('me')
  me(@CurrentUser() user: User) {
    return this.authService.me(user.id);
  }

  @UseGuards(SupabaseAuthGuard)
  @Post('logout')
  async logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie(COOKIE_NAME, { path: '/' });
    return this.authService.logout(user.id);
  }
}
