import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class DashboardService {
  constructor(private readonly supabase: SupabaseService) {}

  async summary(userId: string) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const [currentData, previousData] = await Promise.all([
      this.getMonthData(userId, year, month),
      this.getMonthData(
        userId,
        month === 1 ? year - 1 : year,
        month === 1 ? 12 : month - 1,
      ),
    ]);

    const receitas = currentData
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const despesas = currentData
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    const saldo = receitas - despesas;

    const prevReceitas = previousData
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const prevDespesas = previousData
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    const deltaReceitas =
      prevReceitas > 0
        ? ((receitas - prevReceitas) / prevReceitas) * 100
        : 0;

    const deltaDespesas =
      prevDespesas > 0
        ? ((despesas - prevDespesas) / prevDespesas) * 100
        : 0;

    return {
      saldo,
      receitas,
      despesas,
      deltaReceitas: Math.round(deltaReceitas * 10) / 10,
      deltaDespesas: Math.round(deltaDespesas * 10) / 10,
    };
  }

  async chart(userId: string, months = 6) {
    const result: { month: string; receitas: number; despesas: number }[] = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const transactions = await this.getMonthData(userId, year, month);

      const receitas = transactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const despesas = transactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

      result.push({
        month: date.toLocaleString('pt-BR', { month: 'short' }),
        receitas: Math.round(receitas * 100) / 100,
        despesas: Math.round(despesas * 100) / 100,
      });
    }

    return result;
  }

  async insights(userId: string) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const [currentTx, prevTx, goals] = await Promise.all([
      this.getMonthData(userId, year, month),
      this.getMonthData(
        userId,
        month === 1 ? year - 1 : year,
        month === 1 ? 12 : month - 1,
      ),
      this.supabase
        .getClient()
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .neq('status', 'achieved'),
    ]);

    const insights: { id: number; text: string; tag: string }[] = [];

    // Insight 1: Maior gasto supérfluo do mês
    const superfluous = currentTx.filter(
      (t) => t.nature === 'superfluous' && t.amount < 0,
    );
    if (superfluous.length > 0) {
      const biggest = superfluous.reduce((max, t) =>
        Math.abs(t.amount) > Math.abs(max.amount) ? t : max,
      );
      insights.push({
        id: 1,
        text: `Seu maior gasto supérfluo este mês foi "${biggest.description}" com R$ ${Math.abs(Number(biggest.amount)).toFixed(2).replace('.', ',')}.`,
        tag: 'Gasto supérfluo',
      });
    }

    // Insight 2: Comparação de despesas com mês anterior
    const currDespesas = currentTx
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    const prevDespesas = prevTx
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    if (prevDespesas > 0) {
      const diff = ((currDespesas - prevDespesas) / prevDespesas) * 100;
      if (Math.abs(diff) >= 5) {
        const direction = diff > 0 ? 'aumentaram' : 'diminuíram';
        insights.push({
          id: 2,
          text: `Suas despesas ${direction} ${Math.abs(Math.round(diff))}% em relação ao mês passado.`,
          tag: diff > 0 ? 'Atenção' : 'Bom trabalho',
        });
      }
    }

    // Insight 3: Meta mais próxima de ser concluída
    const goalsData = goals.data ?? [];
    if (goalsData.length > 0) {
      const closest = goalsData.reduce((best: any, g: any) => {
        const pct = g.current_amount / g.target_amount;
        const bestPct = best.current_amount / best.target_amount;
        return pct > bestPct ? g : best;
      });
      const pct = Math.round(
        (closest.current_amount / closest.target_amount) * 100,
      );
      insights.push({
        id: 3,
        text: `Você está ${pct}% do caminho para "${closest.title}". Faltam R$ ${(closest.target_amount - closest.current_amount).toFixed(2).replace('.', ',')}.`,
        tag: 'Meta',
      });
    }

    return insights;
  }

  private async getMonthData(userId: string, year: number, month: number) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const { data, error } = await this.supabase
      .getClient()
      .from('transactions')
      .select('amount, nature, description, categories(name)')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw new InternalServerErrorException(error.message);
    return data ?? [];
  }
}
