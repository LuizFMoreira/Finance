import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('categories')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .order('name');

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async create(userId: string, dto: CreateCategoryDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('categories')
      .insert({ name: dto.name, color: dto.color, icon: dto.icon, user_id: userId })
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async update(userId: string, id: string, dto: UpdateCategoryDto) {
    const { data: existing } = await this.supabase
      .getClient()
      .from('categories')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundException('Categoria não encontrada');
    if (existing.user_id !== userId)
      throw new ForbiddenException('Não é possível editar categorias do sistema');

    const { data, error } = await this.supabase
      .getClient()
      .from('categories')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async remove(userId: string, id: string) {
    const { data: existing } = await this.supabase
      .getClient()
      .from('categories')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundException('Categoria não encontrada');
    if (existing.user_id !== userId)
      throw new ForbiddenException('Não é possível remover categorias do sistema');

    const { error } = await this.supabase
      .getClient()
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw new InternalServerErrorException(error.message);
    return { message: 'Categoria removida' };
  }
}
