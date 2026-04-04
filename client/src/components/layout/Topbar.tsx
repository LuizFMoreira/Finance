import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, ChevronDown, Check, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const PAGE_TITLES: Record<string, { title: string; subtitle: (name: string) => string }> = {
  "/dashboard": { title: "Visão Geral", subtitle: (name) => `Olá, ${name}! Aqui está seu resumo financeiro.` },
  "/transactions": { title: "Transações", subtitle: () => "Todas as movimentações das suas contas." },
  "/goals": { title: "Metas", subtitle: () => "Acompanhe seus objetivos financeiros." },
  "/ai": { title: "Inteligência Pluma", subtitle: () => "Converse com sua IA financeira pessoal." },
  "/settings": { title: "Configurações", subtitle: () => "Gerencie sua conta e preferências." },
};

const NOTIFICATIONS = [
  { id: 1, text: "Gasto com delivery 20% acima do normal", time: "há 2h", read: false },
  { id: 2, text: "Meta 'Celular Novo' atingiu 75%", time: "há 5h", read: false },
  { id: 3, text: "3 novas transações sincronizadas", time: "ontem", read: true },
];

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "você";
  const initials = user?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";
  const pageDef = PAGE_TITLES[location.pathname] ?? { title: "Pluma", subtitle: () => "" };
  const page = { title: pageDef.title, subtitle: pageDef.subtitle(firstName) };
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQ.trim()) return;
    navigate(`/transactions?q=${encodeURIComponent(searchQ.trim())}`);
    setSearchQ("");
    searchRef.current?.blur();
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
      {/* Page title */}
      <div>
        <h1 className="text-lg font-700 text-primary">{page.title}</h1>
        <p className="text-xs text-primary/50 mt-0.5">{page.subtitle}</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:block">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-52 text-sm hover:border-primary/30 hover:bg-lavender-light transition-all focus-within:border-primary/40 focus-within:bg-lavender-light">
            <Search className="w-3.5 h-3.5 shrink-0 text-primary/40" />
            <input
              ref={searchRef}
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Buscar transações..."
              className="bg-transparent outline-none text-primary placeholder:text-primary/40 w-full"
            />
          </div>
        </form>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs((s) => !s)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-primary/60 hover:bg-lavender-light hover:border-primary/30 hover:text-primary transition-all"
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-primary text-[9px] font-800 flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-card-hover border border-gray-100 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-700 text-primary">Notificações</span>
                  <span className="text-xs text-primary/40">{unread} não lidas</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer",
                        !n.read && "bg-lavender-light/50"
                      )}
                    >
                      <div
                        className={cn(
                          "shrink-0 w-2 h-2 rounded-full mt-1.5",
                          n.read ? "bg-gray-200" : "bg-gold"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-primary/80 leading-snug">{n.text}</p>
                        <p className="text-xs text-primary/40 mt-0.5">{n.time}</p>
                      </div>
                      {n.read && <Check className="w-3.5 h-3.5 text-primary/20 shrink-0 mt-0.5" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar */}
        <div className="relative">
          <button
            onClick={() => setShowUser((s) => !s)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-lavender-light transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white text-sm font-700 shrink-0">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-600 text-primary leading-tight">{user?.name ?? "Usuário"}</p>
              <p className="text-[10px] text-primary/40">{user?.email}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-primary/30 hidden md:block" />
          </button>

          <AnimatePresence>
            {showUser && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-card-hover border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={async () => { await logout(); navigate("/login"); }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
