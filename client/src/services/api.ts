import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ── Categories ── */
export const categoriesService = {
  list: () => api.get("/categories"),
  create: (data: { name: string; color: string; icon: string }) =>
    api.post("/categories", data),
};

/* ── Transactions ── */
export const transactionsService = {
  list: (params?: { page?: number; limit?: number; category?: string }) =>
    api.get("/transactions", { params }),
  create: (data: unknown) => api.post("/transactions", data),
  update: (id: number, data: unknown) => api.patch(`/transactions/${id}`, data),
  remove: (id: number) => api.delete(`/transactions/${id}`),
};

/* ── Goals ── */
export const goalsService = {
  list: () => api.get("/goals"),
  create: (data: unknown) => api.post("/goals", data),
  update: (id: number, data: unknown) => api.patch(`/goals/${id}`, data),
  remove: (id: number) => api.delete(`/goals/${id}`),
};

/* ── Dashboard ── */
export const dashboardService = {
  summary: () => api.get("/dashboard/summary"),
  chartData: (period?: string) => api.get("/dashboard/chart", { params: { period } }),
  aiInsights: () => api.get("/dashboard/insights"),
};

export default api;
