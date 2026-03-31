import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn, EASE_OUT } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Visão Geral" },
  { to: "/transactions", icon: ArrowLeftRight, label: "Transações" },
  { to: "/goals", icon: Target, label: "Metas" },
  { to: "/ai", icon: Sparkles, label: "Inteligência Pluma" },
  { to: "/settings", icon: Settings, label: "Configurações" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
      className="relative flex flex-col h-screen bg-sidebar-gradient border-r border-white/5 shrink-0 overflow-hidden"
      style={{ zIndex: 40 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-8">
        <div className="shrink-0 w-9 h-9 rounded-xl bg-gold flex items-center justify-center shadow-lg">
          <Sparkles className="w-4.5 h-4.5 text-primary" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="text-white font-800 text-xl tracking-tight whitespace-nowrap"
            >
              Pluma
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-2 flex-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-white/10"
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                />
              )}
              <Icon
                className={cn(
                  "shrink-0 w-5 h-5 relative z-10 transition-colors",
                  active ? "text-gold" : "text-white/50 group-hover:text-white/70"
                )}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.18 }}
                    className="text-sm font-500 whitespace-nowrap relative z-10"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 pb-6">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs font-500"
              >
                Recolher
              </motion.span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
