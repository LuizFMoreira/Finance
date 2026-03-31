import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, EASE_OUT } from "@/lib/utils";

/* ── mock data ── */
const chartData = [
  { month: "Jan", receitas: 8200, despesas: 6100 },
  { month: "Fev", receitas: 8500, despesas: 7200 },
  { month: "Mar", receitas: 9100, despesas: 6800 },
  { month: "Abr", receitas: 8700, despesas: 7500 },
  { month: "Mai", receitas: 9400, despesas: 6900 },
  { month: "Jun", receitas: 10200, despesas: 7800 },
  { month: "Jul", receitas: 9800, despesas: 8100 },
];

const AI_INSIGHTS = [
  {
    id: 1,
    icon: "🚀",
    text: "Você está economizando R$ 1.240/mês. Com esse ritmo, sua meta de R$ 15.000 será atingida em 3 meses.",
    tag: "Meta no caminho",
    tagVariant: "income" as const,
  },
  {
    id: 2,
    icon: "⚠️",
    text: "Delivery este mês: R$ 487 em 18 pedidos — 23% acima da sua média. Que tal criar um limite de R$ 300?",
    tag: "Alerta de gasto",
    tagVariant: "superfluous" as const,
  },
  {
    id: 3,
    icon: "💡",
    text: "Você tem R$ 2.400 parados em conta corrente. Aplicando no Tesouro Selic, renderia ~R$ 140 extras este ano.",
    tag: "Oportunidade",
    tagVariant: "gold" as const,
  },
];

const RECENT_TX = [
  { desc: "iFood - Pedido #4821", category: "Alimentação", value: -68.9, date: "Hoje" },
  { desc: "Salário - Empresa XYZ", category: "Renda", value: 9800, date: "Ontem" },
  { desc: "Netflix", category: "Entretenimento", value: -55.9, date: "28/06" },
  { desc: "Uber", category: "Transporte", value: -32.4, date: "27/06" },
  { desc: "Supermercado Extra", category: "Alimentação", value: -284.6, date: "26/06" },
];

/* ── animation helpers ── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

/* ── Custom tooltip ── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-card-hover border border-gray-100 px-4 py-3 text-sm">
      <p className="font-700 text-primary mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-500">
          {p.name === "receitas" ? "Receitas" : "Despesas"}:{" "}
          {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

/* ── Summary card ── */
function SummaryCard({
  title,
  value,
  delta,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: number;
  delta: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  const positive = delta >= 0;
  return (
    <motion.div variants={fadeUp}>
      <Card className="hover:shadow-card-hover transition-shadow duration-300">
        <CardContent className="pt-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-600 text-primary/50 uppercase tracking-wider mb-1">
                {title}
              </p>
              <p className="text-2xl font-800 text-primary">{formatCurrency(value)}</p>
              <div className="flex items-center gap-1 mt-1.5">
                {positive ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                )}
                <span
                  className={`text-xs font-600 ${positive ? "text-emerald-600" : "text-red-500"}`}
                >
                  {positive ? "+" : ""}
                  {delta.toFixed(1)}% vs. mês anterior
                </span>
              </div>
            </div>
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: iconBg }}
            >
              <Icon className="w-5 h-5" style={{ color: iconColor }} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Dashboard() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 max-w-7xl"
    >
      {/* Summary cards */}
      <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="Saldo Atual"
          value={14832.5}
          delta={8.3}
          icon={Wallet}
          iconBg="rgba(28,47,58,0.1)"
          iconColor="#1C2F3A"
        />
        <SummaryCard
          title="Receitas do Mês"
          value={9800}
          delta={4.2}
          icon={TrendingUp}
          iconBg="rgba(16,185,129,0.12)"
          iconColor="#10B981"
        />
        <SummaryCard
          title="Despesas do Mês"
          value={8100}
          delta={-6.1}
          icon={TrendingDown}
          iconBg="rgba(239,68,68,0.1)"
          iconColor="#EF4444"
        />
      </motion.div>

      {/* Chart + AI insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card className="h-full hover:shadow-card-hover transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Receitas vs. Despesas</CardTitle>
                  <p className="text-xs text-primary/40 mt-0.5">Últimos 7 meses</p>
                </div>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Atualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
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
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "rgba(28,47,58,0.45)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "rgba(28,47,58,0.45)" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => (
                      <span style={{ fontSize: 12, color: "rgba(28,47,58,0.6)" }}>
                        {value === "receitas" ? "Receitas" : "Despesas"}
                      </span>
                    )}
                  />
                  <Area
                    type="monotone"
                    dataKey="receitas"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fill="url(#colorReceitas)"
                    dot={{ r: 3, fill: "#10B981", strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="despesas"
                    stroke="#EF4444"
                    strokeWidth={2.5}
                    fill="url(#colorDespesas)"
                    dot={{ r: 3, fill: "#EF4444", strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Insights */}
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
                <p className="text-white/40 text-xs">IA analisou suas finanças</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 flex-1">
              {AI_INSIGHTS.map((insight) => (
                <motion.div
                  key={insight.id}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl p-3.5 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-base leading-none mt-0.5">{insight.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-xs leading-relaxed">{insight.text}</p>
                      <Badge variant={insight.tagVariant} className="mt-2 text-[10px]">
                        {insight.tag}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              variant="gold"
              size="sm"
              className="w-full gap-2 rounded-xl"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              Ver todos os insights
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
              <Button variant="outline" size="sm" className="gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                Ver todas
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-gray-50">
              {RECENT_TX.map((tx, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.07, duration: 0.4 }}
                  className="flex items-center gap-4 py-3 hover:bg-gray-50/80 rounded-xl px-2 -mx-2 transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-lavender-light flex items-center justify-center shrink-0">
                    <span className="text-sm">
                      {tx.value > 0 ? "💰" : tx.category === "Alimentação" ? "🍽️" : tx.category === "Transporte" ? "🚗" : "🎬"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-600 text-primary truncate">{tx.desc}</p>
                    <p className="text-xs text-primary/40">{tx.category} · {tx.date}</p>
                  </div>
                  <span
                    className={`text-sm font-700 tabular-nums ${
                      tx.value > 0 ? "text-emerald-600" : "text-primary"
                    }`}
                  >
                    {tx.value > 0 ? "+" : ""}
                    {formatCurrency(tx.value)}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
