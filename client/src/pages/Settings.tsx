import { motion } from "framer-motion";
import { User, Shield, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { EASE_OUT } from "@/lib/utils";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "?";

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 max-w-xl"
    >
      {/* Profile */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary/60" />
              Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white text-xl font-700 shrink-0">
                {initials}
              </div>
              <div>
                <p className="text-base font-700 text-primary">{user?.name ?? "—"}</p>
                <p className="text-sm text-primary/50">{user?.email ?? "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary/60" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex flex-col gap-3">
            <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
              <div>
                <p className="text-sm font-600 text-primary">Sessão</p>
                <p className="text-xs text-primary/40">Cookie HttpOnly · expira em 7 dias</p>
              </div>
              <span className="text-[10px] font-600 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 uppercase tracking-wider">
                Ativa
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <div>
                <p className="text-sm font-600 text-primary">Autenticação</p>
                <p className="text-xs text-primary/40">Gerenciada pelo Supabase Auth</p>
              </div>
              <span className="text-[10px] font-600 px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                Supabase
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary/60" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-primary/40">
              Configurações de notificações em breve.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger zone */}
      <motion.div variants={fadeUp}>
        <Card className="border-red-100">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-600 text-primary">Sair da conta</p>
                <p className="text-xs text-primary/40">Encerra sua sessão atual</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
                onClick={handleLogout}
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
