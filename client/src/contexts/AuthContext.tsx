import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/services/api";

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Ao montar, verifica se já existe sessão válida via cookie
  useEffect(() => {
    api.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post("/auth/login", { email, password });
    // Cookie HttpOnly é definido pelo backend — não tocamos nele aqui
    setUser(data.user);
  }

  async function signup(name: string, email: string, password: string) {
    const { data } = await api.post("/auth/signup", { name, email, password });
    setUser(data.user);
  }

  async function logout() {
    await api.post("/auth/logout").catch(() => {});
    // Backend limpa o cookie; só limpamos o estado local
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
