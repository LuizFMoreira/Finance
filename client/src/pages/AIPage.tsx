import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EASE_OUT } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
}

const SUGGESTIONS = [
  "Como está meu saldo este mês?",
  "Onde estou gastando mais?",
  "Estou no caminho das minhas metas?",
  "Me dê dicas para economizar mais.",
];

let idSeq = 1;

const COMING_SOON_REPLY =
  "Olá! Sou a Inteligência Pluma. Em breve estarei totalmente integrada com seus dados financeiros para responder perguntas como essa. Fique ligado! 🚀";

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: idSeq++,
      role: "assistant",
      text: "Olá! Sou a Inteligência Pluma, seu assistente financeiro pessoal. Em breve você poderá me fazer perguntas sobre suas finanças. O que gostaria de saber?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: idSeq++, role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: idSeq++, role: "assistant", text: COMING_SOON_REPLY },
      ]);
      setLoading(false);
    }, 900);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className="flex items-center gap-3 mb-4"
      >
        <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h2 className="text-base font-700 text-primary">Inteligência Pluma</h2>
          <p className="text-xs text-primary/40">Seu assistente financeiro com IA</p>
        </div>
        <span className="ml-auto text-[10px] font-600 px-2.5 py-1 rounded-full bg-gold/20 text-gold-dark uppercase tracking-wider">
          Em breve
        </span>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-4 pr-1">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                msg.role === "assistant"
                  ? "bg-primary"
                  : "bg-lavender-dark"
              }`}>
                {msg.role === "assistant"
                  ? <Bot className="w-4 h-4 text-white" />
                  : <span className="text-xs font-700 text-primary">Eu</span>
                }
              </div>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "assistant"
                  ? "bg-white border border-gray-100 text-primary shadow-card"
                  : "bg-primary text-white"
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-card">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary/40"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="px-3 py-1.5 text-xs font-500 rounded-xl border border-gray-200 text-primary/60 hover:bg-lavender-light hover:text-primary hover:border-primary/20 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre suas finanças..."
          disabled={loading}
          className="flex-1 px-4 py-3 text-sm bg-white border border-gray-200 rounded-2xl text-primary placeholder:text-primary/35 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all disabled:opacity-50"
        />
        <Button type="submit" disabled={loading || !input.trim()} className="w-12 h-12 p-0 rounded-2xl shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
