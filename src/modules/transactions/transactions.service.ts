import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

export interface TransactionFilters {
  month?: number;
  year?: number;
  category_id?: string;
  nature?: string;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class TransactionsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(userId: string, filters: TransactionFilters = {}) {
    const { month, year, category_id, nature, search, page = 1, limit = 10 } = filters;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .getClient()
      .from('transactions')
      .select('*, categories(id, name, color, icon)', { count: 'exact' })
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .range(from, to);

    if (month && year) {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];
      query = query.gte('date', startDate).lte('date', endDate);
    } else if (year) {
      query = query
        .gte('date', `${year}-01-01`)
        .lte('date', `${year}-12-31`);
    }

    if (category_id) query = query.eq('category_id', category_id);
    if (nature) query = query.eq('nature', nature);
    if (search) query = query.ilike('description', `%${search}%`);

    const { data, error, count } = await query;

    if (error) throw new InternalServerErrorException('Erro ao processar transação');

    return { data, total: count, page, limit };
  }

  async create(userId: string, dto: CreateTransactionDto) {
    // IDOR fix: verifica que a categoria pertence ao usuário ou é do sistema (user_id IS NULL)
    if (dto.category_id) {
      const { data: cat } = await this.supabase
        .getClient()
        .from('categories')
        .select('user_id')
        .eq('id', dto.category_id)
        .single();

      if (!cat) throw new BadRequestException('Categoria não encontrada');
      if (cat.user_id !== null && cat.user_id !== userId) {
        throw new BadRequestException('Categoria inválida');
      }
    }

    const { data, error } = await this.supabase
      .getClient()
      .from('transactions')
      .insert({ ...dto, user_id: userId })
      .select('*, categories(id, name, color, icon)')
      .single();

    if (error) throw new InternalServerErrorException('Erro ao processar transação');
    return data;
  }

  async update(userId: string, id: string, dto: UpdateTransactionDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('transactions')
      .update(dto)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*, categories(id, name, color, icon)')
      .single();

    if (error) throw new InternalServerErrorException('Erro ao processar transação');
    if (!data) throw new NotFoundException('Transação não encontrada');
    return data;
  }

  async remove(userId: string, id: string) {
    const { error } = await this.supabase
      .getClient()
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw new InternalServerErrorException('Erro ao processar transação');
    return { message: 'Transação removida' };
  }
}
