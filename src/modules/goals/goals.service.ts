import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

type GoalStatus = 'on_track' | 'behind' | 'achieved';

function computeStatus(
  currentAmount: number,
  targetAmount: number,
  deadline: string | null,
  monthlyContribution: number,
): GoalStatus {
  if (currentAmount >= targetAmount) return 'achieved';

  if (!deadline || monthlyContribution <= 0) return 'on_track';

  const remaining = targetAmount - currentAmount;
  const monthsLeft =
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30);

  if (monthsLeft <= 0) return 'behind';

  const projectedTotal = monthlyContribution * monthsLeft;
  return projectedTotal >= remaining ? 'on_track' : 'behind';
}

@Injectable()
export class GoalsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async create(userId: string, dto: CreateGoalDto) {
    const currentAmount = dto.current_amount ?? 0;
    const status = computeStatus(
      currentAmount,
      dto.target_amount,
      dto.deadline ?? null,
      dto.monthly_contribution ?? 0,
    );

    const { data, error } = await this.supabase
      .getClient()
      .from('goals')
      .insert({
        ...dto,
        current_amount: currentAmount,
        user_id: userId,
        status,
      })
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async update(userId: string, id: string, dto: UpdateGoalDto) {
    // Busca os valores atuais para recalcular status
    const { data: existing } = await this.supabase
      .getClient()
      .from('goals')
      .select('current_amount, target_amount, deadline, monthly_contribution')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!existing) throw new NotFoundException('Meta não encontrada');

    const merged = { ...existing, ...dto };
    const status = computeStatus(
      merged.current_amount,
      merged.target_amount,
      merged.deadline ?? null,
      merged.monthly_contribution,
    );

    const { data, error } = await this.supabase
      .getClient()
      .from('goals')
      .update({ ...dto, status })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async remove(userId: string, id: string) {
    const { error } = await this.supabase
      .getClient()
      .from('goals')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw new InternalServerErrorException(error.message);
    return { message: 'Meta removida' };
  }
}
