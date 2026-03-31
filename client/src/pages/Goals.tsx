import { useState } from "react";
import { motion } from "framer-motion";
import {
  Smartphone,
  ShieldCheck,
  Plane,
  Home,
  Car,
  GraduationCap,
  Plus,
  Target,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, EASE_OUT } from "@/lib/utils";

/* ── types ── */
interface Goal {
  id: number;
  title: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  current: number;
  target: number;
  deadline: string;
  monthlyContrib: number;
  progressColor: string;
  status: "on_track" | "behind" | "achieved";
}

/* ── mock data ── */
const GOALS: Goal[] = [
  {
    id: 1, title: "Reserva de Emergência",
    icon: ShieldCheck, iconBg: "rgba(16,185,129,0.12)", iconColor: "#10B981",
    current: 8500, target: 15000, deadline: "Dez/2024",
    monthlyContrib: 1240, progressColor: "bg-emerald-500",
    status: "on_track",
  },
  {
    id: 2, title: "Celular Novo",
    icon: Smartphone, iconBg: "rgba(124,58,237,0.12)", iconColor: "#7C3AED",
    current: 3750, target: 5000, deadline: "Set/2024",
    monthlyContrib: 450, progressColor: "bg-purple-500",
    status: "on_track",
  },
  {
    id: 3, title: "Viagem para Europa",
    icon: Plane, iconBg: "rgba(59,130,246,0.12)", iconColor: "#3B82F6",
    current: 4200, target: 18000, deadline: "Jul/2025",
    monthlyContrib: 800, progressColor: "bg-blue-500",
    status: "on_track",
  },
  {
    id: 4, title: "Entrada do Apartamento",
    icon: Home, iconBg: "rgba(245,158,11,0.12)", iconColor: "#F59E0B",
    current: 12000, target: 60000, deadline: "Dez/2026",
    monthlyContrib: 1500, progressColor: "bg-amber-500",
    status: "behind",
  },
  {
    id: 5, title: "Carro Novo",
    icon: Car, iconBg: "rgba(239,68,68,0.12)", iconColor: "#EF4444",
    current: 9800, target: 25000, deadline: "Mar/2026",
    monthlyContrib: 600, progressColor: "bg-red-500",
    status: "behind",
  },
  {
    id: 6, title: "Pós-Graduação",
    icon: GraduationCap, iconBg: "rgba(255,215,0,0.15)", iconColor: "#B45309",
    current: 6000, target: 6000, deadline: "Concluído",
    monthlyContrib: 0, progressColor: "bg-gold",
    status: "achieved",
  },
];

const STATUS_LABEL: Record<Goal["status"], { label: string; variant: "income" | "superfluous" | "gold" }> = {
  on_track: { label: "No prazo", variant: "income" },
  behind: { label: "Atrasada", variant: "superfluous" },
  achieved: { label: "Concluída!", variant: "gold" },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

function GoalCard({ goal }: { goal: Goal }) {
  const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
  const { label, variant } = STATUS_LABEL[goal.status];
  const Icon = goal.icon;

  return (
    <motion.div variants={fadeUp}>
      <Card className="hover:shadow-card-hover transition-all duration-300 group">
        <CardContent className="pt-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: goal.iconBg }}
              >
                <Icon className="w-5 h-5" style={{ color: goal.iconColor }} />
              </div>
              <div>
                <p className="text-sm font-700 text-primary">{goal.title}</p>
                <p className="text-xs text-primary/40 mt-0.5">Prazo: {goal.deadline}</p>
              </div>
            </div>
            <Badge variant={variant}>{label}</Badge>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-primary/50 font-500">
                {formatCurrency(goal.current)}
              </span>
              <span className="font-700 text-primary">{pct}%</span>
              <span className="text-primary/50 font-500">
                {formatCurrency(goal.target)}
              </span>
            </div>
            <Progress
              value={goal.current}
              max={goal.target}
              colorClass={goal.progressColor}
              className="h-2.5"
            />
          </div>

          {/* Bottom */}
          {goal.status !== "achieved" && (
            <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-primary/50">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>{formatCurrency(goal.monthlyContrib)}/mês aportado</span>
              </div>
              <span className="text-xs text-primary/40">
                Faltam {formatCurrency(goal.target - goal.current)}
              </span>
            </div>
          )}

          {goal.status === "achieved" && (
            <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-gray-100">
              <span className="text-sm">🎉</span>
              <span className="text-xs font-600 text-emerald-600">
                Meta concluída! Parabéns!
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Goals() {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? GOALS : GOALS.slice(0, 5);
  const totalSaved = GOALS.reduce((acc, g) => acc + g.current, 0);
  const totalTarget = GOALS.reduce((acc, g) => acc + g.target, 0);
  const achieved = GOALS.filter((g) => g.status === "achieved").length;

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 max-w-7xl"
    >
      {/* Summary row */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Guardado", value: formatCurrency(totalSaved), icon: Target, iconColor: "#1C2F3A", iconBg: "rgba(28,47,58,0.1)" },
          { label: "Objetivo Total", value: formatCurrency(totalTarget), icon: TrendingUp, iconColor: "#10B981", iconBg: "rgba(16,185,129,0.12)" },
          { label: "Metas Concluídas", value: `${achieved} de ${GOALS.length}`, icon: Sparkles, iconColor: "#B45309", iconBg: "rgba(255,215,0,0.15)" },
        ].map((s) => (
          <Card key={s.label} className="hover:shadow-card-hover transition-shadow duration-300">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-600 text-primary/50 uppercase tracking-wider mb-1">{s.label}</p>
                  <p className="text-2xl font-800 text-primary">{s.value}</p>
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: s.iconBg }}>
                  <s.icon className="w-5 h-5" style={{ color: s.iconColor }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* AI suggestion banner */}
      <motion.div
        variants={fadeUp}
        className="rounded-2xl p-4 flex items-start gap-4"
        style={{
          background: "linear-gradient(135deg, #1C2F3A 0%, #243b4a 100%)",
          boxShadow: "0 4px 24px rgba(28,47,58,0.2)",
        }}
      >
        <div className="w-9 h-9 rounded-xl bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-gold" />
        </div>
        <div className="flex-1">
          <p className="text-white font-700 text-sm mb-0.5">Sugestão da Pluma IA</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Aumentando seu aporte mensal em{" "}
            <span className="text-gold font-600">R$ 300</span>, você atingiria a{" "}
            <span className="text-white font-600">Reserva de Emergência</span> 2 meses antes do prazo. Quer criar um lembrete automático?
          </p>
        </div>
        <Button variant="gold" size="sm" className="shrink-0 rounded-xl">
          Criar lembrete
        </Button>
      </motion.div>

      {/* Goals header */}
      <div className="flex items-center justify-between">
        <motion.div variants={fadeUp}>
          <h2 className="text-base font-700 text-primary">Minhas Metas</h2>
          <p className="text-xs text-primary/40 mt-0.5">{GOALS.length} metas cadastradas</p>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Button variant="gold" size="sm" className="gap-2">
            <Plus className="w-3.5 h-3.5" />
            Nova meta
          </Button>
        </motion.div>
      </div>

      {/* Goals grid */}
      <motion.div
        variants={stagger}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {displayed.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </motion.div>

      {GOALS.length > 5 && (
        <motion.div variants={fadeUp} className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowAll((s) => !s)}
          >
            {showAll ? "Ver menos" : `Ver todas as ${GOALS.length} metas`}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
