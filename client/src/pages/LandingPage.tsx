import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState } from "react";
import {
  Building2, MessageSquare, RefreshCw, TrendingUp, Shield,
  ChevronDown, Star, ArrowRight, Sparkles, Wallet, Bell,
  Menu, X, Check, Wifi, Zap, Lock, BarChart2,
} from "lucide-react";

/* ── tokens ── */
const C = {
  bg: "#08090D",
  surface: "#0F1117",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  purple: "#7C3AED",
  purpleGlow: "rgba(124,58,237,0.45)",
  gold: "#FFD700",
  lavender: "#E6E1F9",
  light: "#FFFFFF",
  muted: "rgba(255,255,255,0.5)",
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function useView(amount = 0.15) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount });
  return { ref, isInView };
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

/* ── gradient orbs background ── */
function Orbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "-20%", right: "-10%",
          width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute", bottom: "-10%", left: "-5%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.18) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{
          position: "absolute", top: "40%", left: "40%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,215,0,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}

/* ── subtle grid overlay ── */
function Grid() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
      }}
    />
  );
}

/* ── credit cards ── */
const CARDS = [
  {
    id: "gold", delay: 0.1, initialY: -600, initialRotate: -20, initialRotateX: 65,
    finalY: -30, finalRotate: -14, finalX: 20, zIndex: 10, floatAmp: 9, floatDur: 4.4,
    gradient: "linear-gradient(135deg, #92650A 0%, #FFD700 35%, #C9900C 65%, #7A5208 100%)",
    label: "Pluma Gold", number: "•••• •••• •••• 4721", holder: "CARLOS MENDES", expiry: "08/29", chip: true,
  },
  {
    id: "dark", delay: 0.38, initialY: -720, initialRotate: 10, initialRotateX: 55,
    finalY: 50, finalRotate: 5, finalX: -30, zIndex: 20, floatAmp: 12, floatDur: 5.2,
    gradient: "linear-gradient(135deg, #0D0D1A 0%, #1A1A3E 50%, #0D2060 100%)",
    label: "Pluma Black", number: "•••• •••• •••• 8834", holder: "ANA RIBEIRO", expiry: "03/28", chip: true,
  },
  {
    id: "purple", delay: 0.65, initialY: -560, initialRotate: 25, initialRotateX: 48,
    finalY: 120, finalRotate: 20, finalX: 55, zIndex: 5, floatAmp: 8, floatDur: 3.9,
    gradient: "linear-gradient(135deg, #4C1D95 0%, #7C3AED 45%, #3730A3 100%)",
    label: "Pluma Plus", number: "•••• •••• •••• 2093", holder: "LUCAS SILVA", expiry: "11/27", chip: false,
  },
];

function CreditCard({ card }: { card: (typeof CARDS)[0] }) {
  const [landed, setLanded] = useState(false);
  return (
    <motion.div
      initial={{ y: card.initialY, rotate: card.initialRotate, rotateX: card.initialRotateX, x: card.finalX, opacity: 0 }}
      animate={{ y: card.finalY, rotate: card.finalRotate, rotateX: 0, x: card.finalX, opacity: 1 }}
      transition={{ delay: card.delay, duration: 1.15, type: "spring", stiffness: 52, damping: 13, mass: 1.3 }}
      onAnimationComplete={() => setLanded(true)}
      whileHover={{ y: card.finalY - 22, rotate: card.finalRotate * 0.6, transition: { duration: 0.4, ease: "easeOut" } }}
      style={{ position: "absolute", zIndex: card.zIndex, transformStyle: "preserve-3d", cursor: "grab" }}
    >
      <motion.div
        animate={landed ? { y: ["0px", `${-card.floatAmp}px`, "0px"] } : {}}
        transition={landed ? { duration: card.floatDur, repeat: Infinity, ease: "easeInOut" } : {}}
      >
        <div style={{
          width: 310, height: 190, borderRadius: 20,
          background: card.gradient,
          boxShadow: "0 40px 90px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.15)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "linear-gradient(130deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)" }} />
          <div style={{ position: "absolute", right: -50, top: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", right: 0, top: 40, width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
          <div style={{ position: "absolute", top: 18, left: 22, right: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles style={{ width: 13, height: 13, color: "rgba(255,255,255,0.9)" }} />
              </div>
              <span style={{ color: "rgba(255,255,255,0.92)", fontSize: 12, fontWeight: 700, letterSpacing: 1.2 }}>{card.label}</span>
            </div>
            <Wifi style={{ width: 16, height: 16, color: "rgba(255,255,255,0.65)", transform: "rotate(90deg)" }} />
          </div>
          {card.chip && (
            <div style={{
              position: "absolute", left: 22, top: 60, width: 36, height: 26, borderRadius: 5,
              background: "linear-gradient(135deg, #E8C96A 0%, #C49A22 50%, #E8C96A 100%)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.4)", display: "grid",
              gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 2, padding: 4,
            }}>
              {[...Array(4)].map((_, i) => <div key={i} style={{ background: "rgba(0,0,0,0.18)", borderRadius: 1 }} />)}
            </div>
          )}
          <div style={{ position: "absolute", bottom: 45, left: 22, color: "rgba(255,255,255,0.88)", fontSize: 14, fontWeight: 600, letterSpacing: 2.5, fontFamily: "monospace" }}>
            {card.number}
          </div>
          <div style={{ position: "absolute", bottom: 18, left: 22, right: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 8, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 2 }}>Titular</div>
              <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{card.holder}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 8, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 2 }}>Validade</div>
              <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 11, fontWeight: 700 }}>{card.expiry}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FloatBadge({ icon: Icon, label, value, color, delay, style, className = "" }: {
  icon: React.ElementType; label: string; value: string; color: string; delay: number; style: React.CSSProperties; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.55, type: "spring", stiffness: 180 }}
      className={className}
      style={{ position: "absolute", zIndex: 30, ...style }}
    >
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: delay * 0.6 }}
        style={{
          background: "rgba(15,17,23,0.85)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14,
          padding: "10px 16px", display: "flex", alignItems: "center", gap: 10,
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${color}22`,
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ width: 32, height: 32, borderRadius: 9, background: color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon style={{ width: 15, height: 15, color }} />
        </div>
        <div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 500, marginBottom: 1, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</div>
          <div style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>{value}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════ NAVBAR ═══════════════════════════════════ */
function Navbar() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(8,9,13,0)", "rgba(8,9,13,0.92)"]);
  const shadow = useTransform(scrollY, [0, 80], ["0 0 0 0 transparent", "0 1px 0 0 rgba(255,255,255,0.06)"]);

  return (
    <motion.nav style={{ backgroundColor: bg, boxShadow: shadow }} className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-2.5">
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #7C3AED, #4F46E5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(124,58,237,0.5)" }}>
            <Sparkles style={{ width: 16, height: 16, color: "#fff" }} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Pluma</span>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="hidden md:flex items-center gap-8">
          {["Produto", "Recursos", "Preços", "Empresa"].map((t) => (
            <a key={t} href="#" style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.6)" }} className="hover:text-white transition-colors">{t}</a>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="hidden md:flex items-center gap-3">
          <a href="/login" style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.6)", padding: "8px 16px" }} className="hover:text-white transition-colors">Entrar</a>
          <motion.a
            href="/dashboard"
            whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(124,58,237,0.6)" }}
            whileTap={{ scale: 0.96 }}
            style={{ fontSize: 14, fontWeight: 700, color: "#fff", padding: "10px 22px", borderRadius: 12, background: "linear-gradient(135deg, #7C3AED, #4F46E5)", boxShadow: "0 0 18px rgba(124,58,237,0.4)", textDecoration: "none", display: "inline-block" }}
          >
            Teste grátis
          </motion.a>
        </motion.div>

        <button className="md:hidden" style={{ color: "rgba(255,255,255,0.8)" }} onClick={() => setOpen(!open)}>
          {open ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ background: "rgba(8,9,13,0.97)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
            className="md:hidden px-6 py-5 flex flex-col gap-5"
          >
            {["Produto", "Recursos", "Preços", "Empresa"].map((t) => (
              <a key={t} href="#" style={{ fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>{t}</a>
            ))}
            <a href="/dashboard" style={{ color: "#fff", fontWeight: 700, padding: "13px", borderRadius: 12, background: "linear-gradient(135deg, #7C3AED, #4F46E5)", textAlign: "center", display: "block", textDecoration: "none" }}>Teste grátis</a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ═══════════════════════════════════ HERO ═══════════════════════════════════ */
function HeroSection() {
  return (
    <section style={{ background: C.bg, minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: 80 }}>
      <Orbs />
      <Grid />

      <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-16 items-center py-14 md:py-20" style={{ position: "relative", zIndex: 1 }}>
        {/* LEFT */}
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, marginBottom: 28,
              background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.35)",
              fontSize: 11, fontWeight: 700, color: "#A78BFA", textTransform: "uppercase", letterSpacing: 2 }}
          >
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <Sparkles style={{ width: 12, height: 12 }} />
            </motion.div>
            Open Finance · IA Conversacional
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.9, ease: EASE }}
            style={{ fontSize: "clamp(2.6rem, 4.5vw, 4rem)", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.04em", color: "#fff", marginBottom: 24 }}
          >
            O assistente{" "}
            <span style={{ background: "linear-gradient(135deg, #A78BFA 0%, #7C3AED 40%, #FFD700 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              financeiro com IA
            </span>{" "}
            que entende seu dinheiro
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}
            style={{ fontSize: 18, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 480, marginBottom: 36 }}
          >
            Conecta todos os seus bancos via Open Finance e responde qualquer pergunta sobre suas finanças em segundos — sem planilhas, sem jargões.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }} style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 40 }}>
            <motion.a
              href="/dashboard"
              whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(124,58,237,0.65)" }}
              whileTap={{ scale: 0.96 }}
              style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", fontWeight: 800,
                padding: "16px 32px", borderRadius: 16, fontSize: 16, textDecoration: "none",
                background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
                boxShadow: "0 0 30px rgba(124,58,237,0.45), 0 4px 20px rgba(0,0,0,0.3)" }}
            >
              Teste grátis por 14 dias
              <ArrowRight style={{ width: 18, height: 18 }} />
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.3)" }}
              whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.75)", fontWeight: 600,
                padding: "16px 28px", borderRadius: 16, fontSize: 15,
                border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}
            >
              Ver demo
            </motion.button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex" }}>
              {["#7C3AED","#10B981","#F59E0B","#EF4444","#3B82F6"].map((c, i) => (
                <div key={i} style={{ width: 34, height: 34, borderRadius: "50%", background: c, border: "2.5px solid #08090D", marginLeft: i > 0 ? -10 : 0 }} />
              ))}
            </div>
            <div>
              <div style={{ display: "flex", gap: 2, marginBottom: 3 }}>
                {[...Array(5)].map((_, i) => <Star key={i} style={{ width: 13, height: 13, fill: "#FFD700", color: "#FFD700" }} />)}
              </div>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                <strong style={{ color: "rgba(255,255,255,0.8)" }}>4.9/5</strong> · +12.000 usuários ativos
              </span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT — falling cards (hidden on mobile) */}
        <div className="hidden md:flex" style={{ position: "relative", height: 540, perspective: "1400px", alignItems: "center", justifyContent: "center" }}>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.6, duration: 0.9, ease: "easeOut" }}
            style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", width: 280, height: 28, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(124,58,237,0.25) 0%, transparent 75%)", filter: "blur(10px)", zIndex: 1 }}
          />
          {[...CARDS].sort((a, b) => a.zIndex - b.zIndex).map((c) => <CreditCard key={c.id} card={c} />)}
          <FloatBadge icon={TrendingUp} label="Economizado" value="+R$ 1.240" color="#10B981" delay={1.7} style={{ bottom: 70, left: -30 }} className="hidden lg:block" />
          <FloatBadge icon={Wallet} label="Saldo total" value="R$ 14.832" color="#7C3AED" delay={2.0} style={{ top: 60, right: -40 }} className="hidden lg:block" />
          <FloatBadge icon={Zap} label="IA ativa" value="24h / 7 dias" color="#FFD700" delay={2.25} style={{ top: 220, left: -45 }} className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════ TICKER ═══════════════════════════════════ */
function Ticker() {
  const banks = ["Nubank","Itaú","Bradesco","Santander","XP Investimentos","Banco do Brasil","Inter","C6 Bank","Caixa","BTG Pactual"];
  const repeated = [...banks, ...banks];
  return (
    <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "18px 0", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(90deg, ${C.surface}, transparent)`, zIndex: 2 }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(-90deg, ${C.surface}, transparent)`, zIndex: 2 }} />
      <motion.div
        animate={{ x: [0, -50 * banks.length] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: 0, width: "max-content" }}
      >
        {repeated.map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 28px", borderRight: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.purple }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{b}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════ FEATURES ═══════════════════════════════════ */
function FeaturesSection() {
  const { ref, isInView } = useView();
  const features = [
    { icon: Building2, color: "#A78BFA", title: "Conecta automaticamente", text: "Open Finance do Banco Central. Todos os seus bancos, corretoras e cartões em um lugar só." },
    { icon: MessageSquare, color: "#34D399", title: "Responde em linguagem humana", text: "Pergunte qualquer coisa e receba respostas claras e ações sugeridas. Seu consultor 24h." },
    { icon: RefreshCw, color: "#FBBF24", title: "Atualiza sozinho", text: "Organize, categorize e monitore tudo automaticamente. Você só conversa e decide." },
    { icon: Lock, color: "#60A5FA", title: "Segurança máxima", text: "Criptografia de ponta a ponta, adequação à LGPD e tokens temporários. Seus dados, protegidos." },
    { icon: BarChart2, color: "#F87171", title: "Insights poderosos", text: "Relatórios visuais e análise de padrões para você tomar decisões mais inteligentes." },
    { icon: Bell, color: "#C084FC", title: "Alertas inteligentes", text: "Seja avisado antes de gastar demais. Crie metas e acompanhe em tempo real." },
  ];

  return (
    <section className="py-16 md:py-24" style={{ background: C.bg }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={isInView ? "show" : "hidden"} className="text-center mb-12 md:mb-16">
          <motion.p variants={item} style={{ fontSize: 11, fontWeight: 700, color: C.purple, textTransform: "uppercase", letterSpacing: 3, marginBottom: 14 }}>
            Por que Pluma?
          </motion.p>
          <motion.h2 variants={item} style={{ fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Finanças inteligentes,{" "}
            <span style={{ background: "linear-gradient(135deg,#A78BFA,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              sem esforço
            </span>
          </motion.h2>
          <motion.p variants={item} style={{ fontSize: 17, color: "rgba(255,255,255,0.45)", marginTop: 14, maxWidth: 480, margin: "14px auto 0" }}>
            Tudo que você precisa para controle total do seu dinheiro.
          </motion.p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate={isInView ? "show" : "hidden"} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i} variants={item}
              whileHover={{ y: -10, borderColor: "rgba(124,58,237,0.4)", boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.3)" }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "32px 28px", cursor: "pointer" }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: f.color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <f.icon style={{ width: 22, height: 22, color: f.color }} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>{f.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════ APP PREVIEW ═══════════════════════════════════ */
function AppPreviewSection() {
  const { ref, isInView } = useView();
  const chats = [
    { q: "Qual é meu saldo consolidado?", a: "Seu saldo total é R$ 14.832,50 em 6 contas. Nubank R$ 5.420 · Itaú R$ 3.840 · XP R$ 4.200 · outros R$ 1.372", delay: 0.1 },
    { q: "Quanto gastei com delivery este mês?", a: "R$ 487 em 18 pedidos — 23% acima da média. Quer que eu crie um alerta quando passar de R$ 300?", delay: 0.3 },
    { q: "Quando atinjo minha meta de R$ 15.000?", a: "Com o ritmo atual de R$ 1.240/mês economizados, você atinge em 3 meses. Parabéns!", delay: 0.5 },
  ];

  return (
    <section className="py-16 md:py-24" style={{ background: "#0B0D14", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
      <div className="max-w-7xl mx-auto px-6" style={{ position: "relative", zIndex: 1 }}>
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={isInView ? "show" : "hidden"} className="text-center mb-12 md:mb-16">
          <motion.p variants={item} style={{ fontSize: 11, fontWeight: 700, color: "#A78BFA", textTransform: "uppercase", letterSpacing: 3, marginBottom: 14 }}>
            Pluma responde
          </motion.p>
          <motion.h2 variants={item} style={{ fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            <span style={{ color: "#fff" }}>Pergunte qualquer coisa sobre </span>
            <span style={{ color: C.gold }}>suas finanças</span>
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {chats.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: c.delay, duration: 0.7, ease: EASE }}
              whileHover={{ y: -8, boxShadow: "0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.25)" }}
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MessageSquare style={{ width: 15, height: 15, color: "#A78BFA" }} />
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{c.q}</p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: C.purple, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sparkles style={{ width: 10, height: 10, color: "#fff" }} />
                  </div>
                  <span style={{ fontSize: 11, color: "#A78BFA", fontWeight: 700 }}>Pluma IA</span>
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", lineHeight: 1.65 }}>{c.a}</p>
              </div>
              <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.05)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${[60, 78, 92][i]}%` } : {}}
                  transition={{ delay: c.delay + 0.5, duration: 0.9 }}
                  style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${C.purple}, #A78BFA)` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════ TESTIMONIALS ═══════════════════════════════════ */
function TestimonialsSection() {
  const { ref, isInView } = useView();
  const testimonials = [
    { name: "Marina Costa", role: "Designer · SP", text: "Em uma semana, o Pluma me mostrou que eu gastava R$ 800/mês a mais do que percebia. Mudou minha relação com o dinheiro.", avatar: "#7C3AED" },
    { name: "Rafael Souza", role: "Engenheiro · RJ", text: "Conectei 5 bancos em 2 minutos. A IA entende exatamente o que pergunto e as respostas são incrivelmente precisas.", avatar: "#059669" },
    { name: "Ana Ferreira", role: "Médica · BH", text: "Finalmente uma ferramenta que fala em português de verdade. Não preciso saber de finanças para usar. Simplesmente funciona.", avatar: "#D97706" },
  ];

  return (
    <section className="py-16 md:py-24" style={{ background: C.bg }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={isInView ? "show" : "hidden"} className="text-center mb-12 md:mb-16">
          <motion.p variants={item} style={{ fontSize: 11, fontWeight: 700, color: C.purple, textTransform: "uppercase", letterSpacing: 3, marginBottom: 14 }}>Depoimentos</motion.p>
          <motion.h2 variants={item} style={{ fontSize: "clamp(2rem,3.5vw,2.8rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>
            Quem usa, <span style={{ color: C.gold }}>recomenda</span>
          </motion.h2>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" animate={isInView ? "show" : "hidden"} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={item} whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, display: "flex", flexDirection: "column", gap: 20 }}
            >
              <div style={{ display: "flex", gap: 2 }}>
                {[...Array(5)].map((_, j) => <Star key={j} style={{ width: 14, height: 14, fill: C.gold, color: C.gold }} />)}
              </div>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: t.avatar, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{t.name[0]}</span>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════ PRICING ═══════════════════════════════════ */
function PricingSection() {
  const { ref, isInView } = useView();
  const plans = [
    { name: "Básico", price: "Grátis", desc: "Comece agora", highlight: false,
      features: ["Até 2 contas", "Resumo mensal", "Histórico 3 meses", "Suporte por e-mail"], cta: "Começar grátis" },
    { name: "Pro", price: "R$ 29", period: "/mês", desc: "Controle total", highlight: true,
      features: ["Contas ilimitadas", "IA conversacional completa", "Alertas e metas", "Histórico completo", "Relatórios avançados", "Suporte prioritário"], cta: "Teste 14 dias grátis" },
    { name: "Família", price: "R$ 49", period: "/mês", desc: "Para toda família", highlight: false,
      features: ["Tudo do Pro", "Até 5 perfis", "Metas familiares", "Dashboard compartilhado"], cta: "Assinar agora" },
  ];

  return (
    <section className="py-16 md:py-24" style={{ background: "#0B0D14", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(124,58,237,0.1) 0%, transparent 70%)" }} />
      <div className="max-w-7xl mx-auto px-6" style={{ position: "relative", zIndex: 1 }}>
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={isInView ? "show" : "hidden"} className="text-center mb-12 md:mb-16">
          <motion.p variants={item} style={{ fontSize: 11, fontWeight: 700, color: C.purple, textTransform: "uppercase", letterSpacing: 3, marginBottom: 14 }}>Preços</motion.p>
          <motion.h2 variants={item} style={{ fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>
            Simples e transparente
          </motion.h2>
          <motion.p variants={item} style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>Cancele quando quiser. Sem surpresas.</motion.p>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" animate={isInView ? "show" : "hidden"} className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {plans.map((p, i) => (
            <motion.div key={i} variants={item} whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}
              style={{ borderRadius: 22, padding: 32, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
                background: p.highlight ? "linear-gradient(145deg, rgba(124,58,237,0.25) 0%, rgba(79,70,229,0.15) 100%)" : C.card,
                border: p.highlight ? "1px solid rgba(124,58,237,0.5)" : `1px solid ${C.border}`,
                boxShadow: p.highlight ? "0 0 60px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.05)" : "none" }}
            >
              {p.highlight && (
                <>
                  <div style={{ position: "absolute", top: -40, right: -40, width: 150, height: 150, borderRadius: "50%", background: "rgba(124,58,237,0.15)", filter: "blur(30px)" }} />
                  <div style={{ position: "absolute", top: 18, right: 18, fontSize: 11, fontWeight: 800, color: "#111", padding: "4px 12px", borderRadius: 99, background: C.gold }}>POPULAR</div>
                </>
              )}
              <div style={{ marginBottom: 24, position: "relative", zIndex: 1 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: p.highlight ? "#A78BFA" : "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>{p.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                  <span style={{ fontSize: 44, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>{p.price}</span>
                  {p.period && <span style={{ fontSize: 15, color: "rgba(255,255,255,0.4)" }}>{p.period}</span>}
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>{p.desc}</p>
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28, flex: 1, position: "relative", zIndex: 1 }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: p.highlight ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check style={{ width: 10, height: 10, color: p.highlight ? "#A78BFA" : "rgba(255,255,255,0.5)" }} />
                    </div>
                    <span style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)" }}>{f}</span>
                  </li>
                ))}
              </ul>
              <motion.a href="/dashboard" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ width: "100%", padding: "14px", borderRadius: 14, fontWeight: 800, fontSize: 14, position: "relative", zIndex: 1, display: "block", textAlign: "center", textDecoration: "none",
                  background: p.highlight ? C.gold : "rgba(255,255,255,0.07)",
                  color: p.highlight ? "#111" : "rgba(255,255,255,0.7)",
                  border: p.highlight ? "none" : "1px solid rgba(255,255,255,0.1)" }}
              >
                {p.cta}
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════ FAQ ═══════════════════════════════════ */
function FAQSection() {
  const { ref, isInView } = useView();
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "O que é o Pluma?", a: "O Pluma é um assistente financeiro com IA que conecta todas as suas contas via Open Finance e responde dúvidas em linguagem natural. Como um consultor financeiro pessoal 24h por dia." },
    { q: "Meus dados financeiros estão seguros?", a: "Sim. Criptografia de ponta a ponta, adequação total à LGPD e uso apenas de tokens temporários fornecidos pelo Open Finance. Suas senhas bancárias nunca são armazenadas." },
    { q: "Posso conectar todos os meus bancos?", a: "Sim! Compatível com o Open Finance brasileiro — Nubank, Itaú, Bradesco, Santander, XP, Inter, C6 e todos os demais participantes do sistema." },
    { q: "Como funciona a IA?", a: "Nossa IA analisa todas as suas transações em tempo real e responde qualquer pergunta sobre seu dinheiro em português natural. Ela aprende seus padrões e faz sugestões personalizadas." },
    { q: "Posso cancelar quando quiser?", a: "Sim, sem burocracia. Cancele direto no app, sem multas ou taxas. Você tem 14 dias grátis para experimentar sem compromisso." },
  ];

  return (
    <section className="py-16 md:py-24" style={{ background: C.bg }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={isInView ? "show" : "hidden"} className="text-center mb-10 md:mb-14">
          <motion.p variants={item} style={{ fontSize: 11, fontWeight: 700, color: C.purple, textTransform: "uppercase", letterSpacing: 3, marginBottom: 14 }}>Dúvidas</motion.p>
          <motion.h2 variants={item} style={{ fontSize: "clamp(2rem,3.5vw,2.8rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>
            Perguntas Frequentes
          </motion.h2>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" animate={isInView ? "show" : "hidden"} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((f, i) => (
            <motion.div key={i} variants={item} style={{ background: C.card, border: `1px solid ${open === i ? "rgba(124,58,237,0.4)" : C.border}`, borderRadius: 16, overflow: "hidden", transition: "border-color 0.3s" }}>
              <button onClick={() => setOpen(open === i ? null : i)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", textAlign: "left", gap: 16, background: "none", border: "none", cursor: "pointer" }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{f.q}</span>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }}
                  style={{ width: 26, height: 26, borderRadius: "50%", background: open === i ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  <ChevronDown style={{ width: 14, height: 14, color: open === i ? "#A78BFA" : "rgba(255,255,255,0.5)" }} />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} style={{ overflow: "hidden" }}>
                    <div style={{ padding: "16px 24px 20px", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, borderTop: `1px solid ${C.border}` }}>
                      {f.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════ CTA ═══════════════════════════════════ */
function CTASection() {
  const { ref, isInView } = useView();
  return (
    <section className="py-20 md:py-32" style={{ background: "#0B0D14", position: "relative", overflow: "hidden" }}>
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)", filter: "blur(30px)", zIndex: 0 }}
      />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <motion.div ref={ref} variants={stagger} initial="hidden" animate={isInView ? "show" : "hidden"}>
          <motion.div variants={item}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 100, marginBottom: 28,
              background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.35)", fontSize: 11, fontWeight: 700, color: "#A78BFA", textTransform: "uppercase", letterSpacing: 2 }}
          >
            <Sparkles style={{ width: 12, height: 12 }} /> Comece agora, é grátis
          </motion.div>

          <motion.h2 variants={item} style={{ fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 900, color: "#fff", lineHeight: 1.08, letterSpacing: "-0.04em", marginBottom: 20 }}>
            Seu dinheiro merece{" "}
            <span style={{ background: "linear-gradient(135deg,#A78BFA,#7C3AED,#FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              inteligência real
            </span>
          </motion.h2>

          <motion.p variants={item} style={{ fontSize: 18, color: "rgba(255,255,255,0.45)", marginBottom: 44, maxWidth: 520, margin: "0 auto 44px" }}>
            Junte-se a +12.000 pessoas que já tomam decisões financeiras mais inteligentes com o Pluma.
          </motion.p>

          <motion.div variants={item} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, marginBottom: 22 }}>
            <motion.a
              href="/dashboard"
              whileHover={{ scale: 1.06, boxShadow: "0 0 60px rgba(124,58,237,0.7)" }}
              whileTap={{ scale: 0.96 }}
              style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", fontWeight: 800,
                padding: "18px 38px", borderRadius: 18, fontSize: 17, textDecoration: "none",
                background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
                boxShadow: "0 0 40px rgba(124,58,237,0.5), 0 4px 24px rgba(0,0,0,0.4)" }}
            >
              Teste grátis por 14 dias <ArrowRight style={{ width: 20, height: 20 }} />
            </motion.a>
          </motion.div>
          <motion.p variants={item} style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>
            Sem cartão de crédito · Cancele a qualquer momento
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════ FOOTER ═══════════════════════════════════ */
function Footer() {
  const cols: Record<string, string[]> = {
    Produto: ["Recursos","Preços","Segurança","Open Finance"],
    Empresa: ["Sobre nós","Blog","Carreiras","Imprensa"],
    Suporte: ["Ajuda","Comunidade","Status","Contato"],
    Social: ["Instagram","LinkedIn","Twitter/X","YouTube"],
  };
  return (
    <footer style={{ background: "#06070A", borderTop: `1px solid ${C.border}`, padding: "64px 0 40px" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#7C3AED,#4F46E5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(124,58,237,0.45)" }}>
                <Sparkles style={{ width: 15, height: 15, color: "#fff" }} />
              </div>
              <span style={{ fontSize: 19, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Pluma</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.7 }}>Inteligência financeira para todos os brasileiros.</p>
          </div>
          {Object.entries(cols).map(([group, links]) => (
            <div key={group}>
              <h4 style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>{group}</h4>
              <ul style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {links.map((l) => (
                  <li key={l}><a href="#" style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }} className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 32, display: "flex", flexDirection: "column", gap: 10, alignItems: "center", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>© 2026 Pluma Tecnologia Financeira Ltda. Todos os direitos reservados.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.18)" }}>
            <Shield style={{ width: 12, height: 12 }} />
            LGPD · Criptografia ponta a ponta · Open Finance regulado pelo Banco Central do Brasil
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════ ROOT ═══════════════════════════════════ */
export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", overflowX: "hidden", width: "100%" }}>
      <Navbar />
      <HeroSection />
      <Ticker />
      <FeaturesSection />
      <AppPreviewSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
