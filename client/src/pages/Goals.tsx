import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, X, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, EASE_OUT } from "@/lib/utils";
import api from "@/services/api";

interface Goal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  monthly_contribution: number;
  deadline: string | null;
  status: "on_track" | "behind" | "achieved";
}

const STATUS: Record<Goal["status"], { label: string; variant: "income" | "superfluous" | "gold"; color: string }> = {
  on_track: { label: "No prazo", variant: "income", color: "bg-emerald-500" },
  behind: { label: "Atrasada", variant: "superfluous", color: "bg-red-500" },
  achieved: { label: "Concluída!", variant: "gold", color: "bg-gold" },
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } } };

function formatDeadline(d: string | null) {
  if (!d) return "Sem prazo";
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" }).replace(". ", "/");
}

function GoalCard({ goal }: { goal: Goal }) {
  const pct = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
  const { label, variant, color } = STATUS[goal.status];

  return (
    <motion.div variants={fadeUp}>
      <Card className="hover:shadow-card-hover transition-all duration-300">
        <CardContent className="pt-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-700 text-primary">{goal.title}</p>
                <p className="text-xs text-primary/40 mt-0.5">Prazo: {formatDeadline(goal.deadline)}</p>
              </div>
            </div>
            <Badge variant={variant}>{label}</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-primary/50 font-500">{formatCurrency(goal.current_amount)}</span>
              <span className="font-700 text-primary">{pct}%</span>
              <span className="text-primary/50 font-500">{formatCurrency(goal.target_amount)}</span>
            </div>
            <Progress value={goal.current_amount} max={goal.target_amount} colorClass={color} className="h-2.5" />
          </div>

          {goal.status !== "achieved" && (
            <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-primary/50">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>{formatCurrency(goal.monthly_contribution)}/mês</span>
              </div>
              <span className="text-xs text-primary/40">Faltam {formatCurrency(goal.target_amount - goal.current_amount)}</span>
            </div>
          )}

          {goal.status === "achieved" && (
            <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-gray-100">
              <span className="text-sm">🎉</span>
              <span className="text-xs font-600 text-emerald-600">Meta concluída! Parabéns!</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Modal({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ title: "", target_amount: "", current_amount: "0", monthly_contribution: "0", deadline: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/goals", {
        title: form.title,
        target_amount: parseFloat(form.target_amount),
        current_amount: parseFloat(form.current_amount) || 0,
        monthly_contribution: parseFloat(form.monthly_contribution) || 0,
        ...(form.deadline ? { deadline: form.deadline } : {}),
      });
      setForm({ title: "", target_amount: "", current_amount: "0", monthly_contribution: "0", deadline: "" });
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-700 text-primary">Nova Meta</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-primary/50" />
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-600 text-primary/50 uppercase tracking-wider">Título</label>
              <input
                required value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Reserva de Emergência"
                className="mt-1 w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-600 text-primary/50 uppercase tracking-wider">Objetivo (R$)</label>
                <input
                  required type="number" min="0.01" step="0.01"
                  value={form.target_amount}
                  onChange={(e) => setForm({ ...form, target_amount: e.target.value })}
                  placeholder="15.000"
                  className="mt-1 w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40"
                />
              </div>
              <div>
                <label className="text-xs font-600 text-primary/50 uppercase tracking-wider">Já guardado (R$)</label>
                <input
                  type="number" min="0" step="0.01"
                  value={form.current_amount}
                  onChange={(e) => setForm({ ...form, current_amount: e.target.value })}
                  placeholder="0"
                  className="mt-1 w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-600 text-primary/50 uppercase tracking-wider">Aporte mensal (R$)</label>
                <input
                  type="number" min="0" step="0.01"
                  value={form.monthly_contribution}
                  onChange={(e) => setForm({ ...form, monthly_contribution: e.target.value })}
                  placeholder="500"
                  className="mt-1 w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40"
                />
              </div>
              <div>
                <label className="text-xs font-600 text-primary/50 uppercase tracking-wider">Prazo (opcional)</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="mt-1 w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-primary focus:outline-none focus:border-primary/40"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Salvando..." : "Criar Meta"}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/goals");
      setGoals(data ?? []);
    } catch {
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalSaved = goals.reduce((acc, g) => acc + Number(g.current_amount), 0);
  const totalTarget = goals.reduce((acc, g) => acc + Number(g.target_amount), 0);
  const achieved = goals.filter((g) => g.status === "achieved").length;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-6 max-w-7xl">
      <Modal open={showModal} onClose={() => setShowModal(false)} onSaved={load} />

      {/* Summary */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Guardado", value: formatCurrency(totalSaved), icon: Target, iconColor: "#1C2F3A", iconBg: "rgba(28,47,58,0.1)" },
          { label: "Objetivo Total", value: formatCurrency(totalTarget), icon: TrendingUp, iconColor: "#10B981", iconBg: "rgba(16,185,129,0.12)" },
          { label: "Metas Concluídas", value: `${achieved} de ${goals.length}`, icon: Sparkles, iconColor: "#B45309", iconBg: "rgba(255,215,0,0.15)" },
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div variants={fadeUp}>
          <h2 className="text-base font-700 text-primary">Minhas Metas</h2>
          <p className="text-xs text-primary/40 mt-0.5">{goals.length} meta{goals.length !== 1 ? "s" : ""} cadastrada{goals.length !== 1 ? "s" : ""}</p>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Button variant="gold" size="sm" className="gap-2" onClick={() => setShowModal(true)}>
            <Plus className="w-3.5 h-3.5" />
            Nova meta
          </Button>
        </motion.div>
      </div>

      {/* Goals grid */}
      {loading ? (
        <div className="py-12 text-center text-primary/30 text-sm">Carregando...</div>
      ) : goals.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-primary/30 text-sm mb-3">Você ainda não tem metas.</p>
          <Button size="sm" onClick={() => setShowModal(true)} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Criar primeira meta
          </Button>
        </div>
      ) : (
        <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}
        </motion.div>
      )}
    </motion.div>
  );
}
