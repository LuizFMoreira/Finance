import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, EASE_OUT } from "@/lib/utils";
import api from "@/services/api";

interface Category { id: string; name: string; color: string }
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  nature: "income" | "expense";
  category_id: string | null;
  categories: { name: string; color: string } | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.045, duration: 0.4, ease: EASE_OUT },
  }),
};

function CategoryBadge({ cat }: { cat: { name: string; color: string } | null }) {
  if (!cat) return <span className="text-xs text-primary/30">—</span>;
  const bg = cat.color + "22"; // ~13% opacity
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-600"
      style={{ backgroundColor: bg, color: cat.color }}
    >
      {cat.name}
    </span>
  );
}

// ── Modal (create + edit) ────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editing?: Transaction;
}

function Modal({ open, onClose, onSaved, editing }: ModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    nature: "expense" as "income" | "expense",
    date: new Date().toISOString().split("T")[0],
    category_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (open) {
      api.get("/categories").then((r) => setCategories(r.data)).catch(() => {});
      if (editing) {
        setForm({
          description: editing.description,
          amount: String(editing.amount),
          nature: editing.nature,
          date: editing.date,
          category_id: editing.category_id ?? "",
        });
      } else {
        setForm({ description: "", amount: "", nature: "expense", date: new Date().toISOString().split("T")[0], category_id: "" });
      }
      setError("");
    }
  }, [open, editing]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const body = {
      description: form.description,
      amount: parseFloat(form.amount),
      nature: form.nature,
      date: form.date,
      ...(form.category_id ? { category_id: form.category_id } : { category_id: null }),
    };
    try {
      if (editing) {
        await api.patch(`/transactions/${editing.id}`, body);
      } else {
        await api.post("/transactions", body);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      const raw = err?.response?.data?.message;
      setError(Array.isArray(raw) ? raw.join(", ") : (raw ?? "Erro ao salvar."));
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
            <h2 className="text-base font-700 text-primary">
              {editing ? "Editar Transação" : "Nova Transação"}
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-primary/50" />
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-600 text-primary/50 uppercase tracking-wider">Descrição</label>
              <input
                required value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Ex: Mercado, Salário..."
                className="mt-1 w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-600 text-primary/50 uppercase tracking-wider">Valor (R$)</label>
                <input
                  required type="number" min="0.01" step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0,00"
                  className="mt-1 w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/40"
                />
              </div>
              <div>
                <label className="text-xs font-600 text-primary/50 uppercase tracking-wider">Data</label>
                <input
                  required type="date" value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="mt-1 w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-primary focus:outline-none focus:border-primary/40"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-600 text-primary/50 uppercase tracking-wider">Tipo</label>
              <div className="flex gap-2 mt-1">
                {(["expense", "income"] as const).map((n) => (
                  <button
                    key={n} type="button"
                    onClick={() => setForm({ ...form, nature: n })}
                    className={`flex-1 py-2 rounded-xl text-sm font-600 transition-all ${
                      form.nature === n
                        ? n === "income" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                        : "bg-gray-100 text-primary/50 hover:bg-gray-200"
                    }`}
                  >
                    {n === "income" ? "Receita" : "Despesa"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-600 text-primary/50 uppercase tracking-wider">Categoria (opcional)</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="mt-1 w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-primary focus:outline-none focus:border-primary/40"
              >
                <option value="">Sem categoria</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {error && <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Salvando..." : editing ? "Salvar alterações" : "Salvar Transação"}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Row actions dropdown ─────────────────────────────────────────────────────

function RowActions({ tx, onEdit, onDelete }: {
  tx: Transaction;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <MoreHorizontal className="w-3.5 h-3.5 text-primary/40" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-7 z-20 w-36 bg-white rounded-xl shadow-card-hover border border-gray-100 overflow-hidden"
          >
            <button
              onClick={() => { setOpen(false); onEdit(tx); }}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-primary/70 hover:bg-lavender-light hover:text-primary transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Editar
            </button>
            <button
              onClick={() => { setOpen(false); onDelete(tx.id); }}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Excluir
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;

export default function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Transaction | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, limit: ITEMS_PER_PAGE };
      if (filter !== "all") params.nature = filter;
      if (search) params.search = search;
      const { data } = await api.get("/transactions", { params });
      setTransactions(data.data ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [page, filter, search]);

  useEffect(() => { load(); }, [load]);

  // Sync search state into URL so Topbar deep-link works
  useEffect(() => {
    if (search) {
      setSearchParams({ q: search }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [search, setSearchParams]);

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta transação?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      load();
    } catch {
      alert("Erro ao excluir.");
    }
  }

  function openEdit(tx: Transaction) {
    setEditing(tx);
    setShowModal(true);
  }

  function openCreate() {
    setEditing(undefined);
    setShowModal(true);
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSaved={load}
        editing={editing}
      />

      {/* Filters bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
      >
        <div className="flex gap-2">
          {(["all", "income", "expense"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-600 transition-all duration-200 ${
                filter === f
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-primary/60 border border-gray-200 hover:bg-lavender-light hover:text-primary"
              }`}
            >
              {f === "all" ? "Todas" : f === "income" ? "Receitas" : "Despesas"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary/40" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar transação..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl text-primary placeholder:text-primary/35 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-primary/30 hover:text-primary/60" />
              </button>
            )}
          </div>
          <Button onClick={openCreate} size="sm" className="gap-1.5 shrink-0">
            <Plus className="w-3.5 h-3.5" />
            Nova
          </Button>
        </div>
      </motion.div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Movimentações</CardTitle>
            <span className="text-xs text-primary/40">{total} registros</span>
          </div>
        </CardHeader>
        <CardContent className="pt-0 overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-primary/30 text-sm">Carregando...</div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-primary/30 text-sm mb-3">Nenhuma transação encontrada.</p>
              <Button size="sm" onClick={openCreate} className="gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Adicionar primeira transação
              </Button>
            </div>
          ) : (
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Data", "Descrição", "Categoria", "Tipo", "Valor"].map((h) => (
                    <th key={h} className="text-left text-xs font-700 text-primary/40 uppercase tracking-wider pb-3 pr-4 last:pr-0 last:text-right">
                      {h}
                    </th>
                  ))}
                  <th className="pb-3 w-8" />
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <motion.tr
                    key={tx.id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="group border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="py-3.5 pr-4 text-xs text-primary/50 whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3.5 pr-4">
                      <p className="text-sm font-600 text-primary leading-tight">{tx.description}</p>
                    </td>
                    <td className="py-3.5 pr-4">
                      <CategoryBadge cat={tx.categories} />
                    </td>
                    <td className="py-3.5 pr-4">
                      {tx.nature === "income" ? (
                        <Badge variant="income">Receita</Badge>
                      ) : (
                        <Badge variant="superfluous">Despesa</Badge>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      <span className={`text-sm font-700 tabular-nums ${tx.nature === "income" ? "text-emerald-600" : "text-primary"}`}>
                        {tx.nature === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="py-3.5 pl-3 w-8">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <RowActions tx={tx} onEdit={openEdit} onDelete={handleDelete} />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
              <span className="text-xs text-primary/40">Página {page} de {totalPages}</span>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-600 transition-all ${
                      page === p ? "bg-primary text-white" : "text-primary/50 hover:bg-lavender-light hover:text-primary"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
