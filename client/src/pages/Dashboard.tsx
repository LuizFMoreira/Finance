import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, Wallet,
  ArrowUpRight, ArrowDownRight, Sparkles, Lightbulb,
  RefreshCw, ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, EASE_OUT } from "@/lib/utils";
import api from "@/services/api";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-card-hover border border-gray-100 px-4 py-3 text-sm">
      <p className="font-700 text-primary mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-500">
          {p.name === "receitas" ? "Receitas" : "Despesas"}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

function SummaryCard({ title, value, delta, icon: Icon, iconBg, iconColor }: {
  title: string; value: number; delta: number;
  icon: React.ElementType; iconBg: string; iconColor: string;
}) {
  const positive = delta >= 0;
  return (
    <motion.div variants={fadeUp}>
      <Card className="hover:shadow-card-hover transition-shadow duration-300">
        <CardContent className="pt-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-600 text-primary/50 uppercase tracking-wider mb-1">{title}</p>
              <p className="text-2xl font-800 text-primary">{formatCurrency(value)}</p>
              <div className="flex items-center gap-1 mt-1.5">
                {positive ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                )}
                <span className={`text-xs font-600 ${positive ? "text-emerald-600" : "text-red-500"}`}>
                  {positive ? "+" : ""}{delta.toFixed(1)}% vs. mês anterior
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: iconBg }}>
              <Icon className="w-5 h-5" style={{ color: iconColor }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const TAG_MAP: Record<string, { variant: "income" | "superfluous" | "gold"; icon: string }> = {
  "Gasto supérfluo": { variant: "superfluous", icon: "⚠️" },
  "Atenção": { variant: "superfluous", icon: "⚠️" },
  "Bom trabalho": { variant: "income", icon: "🚀" },
  "Meta": { variant: "gold", icon: "🎯" },
};

function getCategoryIcon(nature: string) {
  return nature === "income" ? "💰" : "💸";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ saldo: 0, receitas: 0, despesas: 0, deltaReceitas: 0, deltaDespesas: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [recentTx, setRecentTx] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, c, i, tx] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/dashboard/chart?months=6"),
        api.get("/dashboard/insights"),
        api.get("/transactions?limit=5"),
      ]);
      setSummary(s.data);
      setChartData(c.data);
      setInsights(i.data);
      setRecentTx(tx.data.data ?? []);
    } catch {
      // silently fail, shows zeroes
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-primary/40 text-sm">
        Carregando dados...
      </div>
    );
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-6 max-w-7xl">
      {/* Summary cards */}
      <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="Saldo Atual"
          value={summary.saldo}
          delta={summary.deltaReceitas - summary.deltaDespesas}
          icon={Wallet}
          iconBg="rgba(28,47,58,0.1)"
          iconColor="#1C2F3A"
        />
        <SummaryCard
          title="Receitas do Mês"
          value={summary.receitas}
          delta={summary.deltaReceitas}
          icon={TrendingUp}
          iconBg="rgba(16,185,129,0.12)"
          iconColor="#10B981"
        />
        <SummaryCard
          title="Despesas do Mês"
          value={summary.despesas}
          delta={-summary.deltaDespesas}
          icon={TrendingDown}
          iconBg="rgba(239,68,68,0.1)"
          iconColor="#EF4444"
        />
      </motion.div>

      {/* Chart + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card className="h-full hover:shadow-card-hover transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Receitas vs. Despesas</CardTitle>
                  <p className="text-xs text-primary/40 mt-0.5">Últimos 6 meses</p>
                </div>
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={load}>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Atualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {chartData.length === 0 ? (
                <div className="h-[260px] flex items-center justify-center text-primary/30 text-sm">
                  Sem dados ainda. Adicione transações para ver o gráfico.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,47,58,0.06)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "rgba(28,47,58,0.45)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "rgba(28,47,58,0.45)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend formatter={(value) => (
                      <span style={{ fontSize: 12, color: "rgba(28,47,58,0.6)" }}>
                        {value === "receitas" ? "Receitas" : "Despesas"}
                      </span>
                    )} />
                    <Area type="monotone" dataKey="receitas" stroke="#10B981" strokeWidth={2.5} fill="url(#colorReceitas)" dot={{ r: 3, fill: "#10B981", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                    <Area type="monotone" dataKey="despesas" stroke="#EF4444" strokeWidth={2.5} fill="url(#colorDespesas)" dot={{ r: 3, fill: "#EF4444", strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Insights */}
        <motion.div variants={fadeUp}>
          <div
            className="h-full rounded-2xl p-5 flex flex-col gap-4"
            style={{
              background: "linear-gradient(135deg, #1C2F3A 0%, #243b4a 50%, #1a3344 100%)",
              boxShadow: "0 4px 24px rgba(28,47,58,0.25)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gold/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-gold" />
              </div>
              <div>
                <p className="text-white font-700 text-sm">Insights da Pluma</p>
                <p className="text-white/40 text-xs">Análise das suas finanças</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 flex-1">
              {insights.length === 0 ? (
                <p className="text-white/40 text-xs text-center mt-4">
                  Adicione transações para ver os insights personalizados.
                </p>
              ) : insights.map((insight) => {
                const meta = TAG_MAP[insight.tag] ?? { variant: "gold" as const, icon: "💡" };
                return (
                  <motion.div
                    key={insight.id}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl p-3.5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-base leading-none mt-0.5">{meta.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/80 text-xs leading-relaxed">{insight.text}</p>
                        <Badge variant={meta.variant} className="mt-2 text-[10px]">{insight.tag}</Badge>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Button variant="gold" size="sm" className="w-full gap-2 rounded-xl" onClick={() => navigate("/transactions")}>
              <Lightbulb className="w-3.5 h-3.5" />
              Ver transações
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Recent transactions */}
      <motion.div variants={fadeUp}>
        <Card className="hover:shadow-card-hover transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transações Recentes</CardTitle>
                <p className="text-xs text-primary/40 mt-0.5">Últimas movimentações</p>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/transactions")}>
                <ExternalLink className="w-3.5 h-3.5" />
                Ver todas
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {recentTx.length === 0 ? (
              <div className="py-8 text-center text-primary/30 text-sm">
                Nenhuma transação ainda.{" "}
                <button onClick={() => navigate("/transactions")} className="text-primary/50 underline">
                  Adicionar agora
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentTx.map((tx: any, i: number) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.07, duration: 0.4 }}
                    className="flex items-center gap-4 py-3 hover:bg-gray-50/80 rounded-xl px-2 -mx-2 transition-colors cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-lavender-light flex items-center justify-center shrink-0">
                      <span className="text-sm">{getCategoryIcon(tx.nature)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-600 text-primary truncate">{tx.description}</p>
                      <p className="text-xs text-primary/40">
                        {tx.categories?.name ?? "Sem categoria"} · {new Date(tx.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <span className={`text-sm font-700 tabular-nums ${tx.nature === "income" ? "text-emerald-600" : "text-primary"}`}>
                      {tx.nature === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
