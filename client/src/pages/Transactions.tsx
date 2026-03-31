import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  ShoppingCart,
  Car,
  Utensils,
  Monitor,
  Zap,
  Briefcase,
  Heart,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, EASE_OUT } from "@/lib/utils";

/* ── types ── */
type Nature = "essential" | "superfluous";

interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  categoryIcon: React.ElementType;
  value: number;
  nature: Nature;
}

/* ── mock data ── */
const TRANSACTIONS: Transaction[] = [
  { id: 1, date: "2024-07-10", description: "Salário - Empresa XYZ", category: "Renda", categoryIcon: Briefcase, value: 9800, nature: "essential" },
  { id: 2, date: "2024-07-09", description: "iFood - Pedido #4821", category: "Alimentação", categoryIcon: Utensils, value: -68.9, nature: "superfluous" },
  { id: 3, date: "2024-07-08", description: "Netflix", category: "Entretenimento", categoryIcon: Monitor, value: -55.9, nature: "superfluous" },
  { id: 4, date: "2024-07-08", description: "Posto Ipiranga", category: "Transporte", categoryIcon: Car, value: -180, nature: "essential" },
  { id: 5, date: "2024-07-07", description: "Supermercado Extra", category: "Alimentação", categoryIcon: ShoppingCart, value: -284.6, nature: "essential" },
  { id: 6, date: "2024-07-06", description: "Conta de Luz", category: "Utilidades", categoryIcon: Zap, value: -142.3, nature: "essential" },
  { id: 7, date: "2024-07-05", description: "Plano de Saúde", category: "Saúde", categoryIcon: Heart, value: -320, nature: "essential" },
  { id: 8, date: "2024-07-04", description: "Amazon - Compras", category: "Compras", categoryIcon: ShoppingCart, value: -234.5, nature: "superfluous" },
  { id: 9, date: "2024-07-03", description: "Uber", category: "Transporte", categoryIcon: Car, value: -32.4, nature: "superfluous" },
  { id: 10, date: "2024-07-02", description: "Spotify", category: "Entretenimento", categoryIcon: Monitor, value: -21.9, nature: "superfluous" },
  { id: 11, date: "2024-07-01", description: "Farmácia Ultrafarma", category: "Saúde", categoryIcon: Heart, value: -87.6, nature: "essential" },
  { id: 12, date: "2024-06-30", description: "Rappi - Delivery", category: "Alimentação", categoryIcon: Utensils, value: -78.4, nature: "superfluous" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Renda: "bg-emerald-50 text-emerald-700",
  Alimentação: "bg-orange-50 text-orange-700",
  Entretenimento: "bg-purple-50 text-purple-700",
  Transporte: "bg-blue-50 text-blue-700",
  Utilidades: "bg-yellow-50 text-yellow-700",
  Saúde: "bg-red-50 text-red-700",
  Compras: "bg-pink-50 text-pink-700",
};

const ITEMS_PER_PAGE = 8;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.045, duration: 0.4, ease: EASE_OUT },
  }),
};

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "essential" | "superfluous">("all");
  const [page, setPage] = useState(1);

  const filtered = TRANSACTIONS.filter((t) => {
    const matchSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.nature === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      {/* Filters bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
      >
        <div className="flex gap-2">
          {(["all", "essential", "superfluous"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-600 transition-all duration-200 ${
                filter === f
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-primary/60 border border-gray-200 hover:bg-lavender-light hover:text-primary"
              }`}
            >
              {f === "all" ? "Todos" : f === "essential" ? "Essenciais" : "Supérfluos"}
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
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="w-3.5 h-3.5" />
          </Button>
          <Button variant="outline" size="icon" className="shrink-0">
            <Download className="w-3.5 h-3.5" />
          </Button>
        </div>
      </motion.div>

      {/* Table card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Movimentações</CardTitle>
            <span className="text-xs text-primary/40">{filtered.length} registros</span>
          </div>
        </CardHeader>
        <CardContent className="pt-0 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100">
                {["Data", "Descrição", "Categoria", "Natureza", "Valor"].map((h) => (
                  <th key={h} className="text-left text-xs font-700 text-primary/40 uppercase tracking-wider pb-3 pr-4 last:pr-0 last:text-right">
                    {h}
                  </th>
                ))}
                <th className="pb-3 w-8" />
              </tr>
            </thead>
            <tbody>
              {paginated.map((tx, i) => {
                const Icon = tx.categoryIcon;
                const colorCls = CATEGORY_COLORS[tx.category] ?? "bg-gray-50 text-gray-600";
                return (
                  <motion.tr
                    key={tx.id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="group border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 pr-4 text-xs text-primary/50 whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3.5 pr-4">
                      <p className="text-sm font-600 text-primary leading-tight">{tx.description}</p>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-600 ${colorCls}`}>
                        <Icon className="w-3 h-3" />
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      {tx.value > 0 ? (
                        <Badge variant="income">Receita</Badge>
                      ) : tx.nature === "essential" ? (
                        <Badge variant="essential">Essencial</Badge>
                      ) : (
                        <Badge variant="superfluous">Supérfluo</Badge>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      <span
                        className={`text-sm font-700 tabular-nums ${
                          tx.value > 0 ? "text-emerald-600" : "text-primary"
                        }`}
                      >
                        {tx.value > 0 ? "+" : ""}
                        {formatCurrency(tx.value)}
                      </span>
                    </td>
                    <td className="py-3.5 pl-3 w-8">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-gray-100">
                        <MoreHorizontal className="w-3.5 h-3.5 text-primary/40" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
              <span className="text-xs text-primary/40">
                Página {page} de {totalPages}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-600 transition-all ${
                      page === p
                        ? "bg-primary text-white"
                        : "text-primary/50 hover:bg-lavender-light hover:text-primary"
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
