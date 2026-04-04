import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // envia o cookie HttpOnly automaticamente em todas as requisições
});

/* ── Categories ── */
export const categoriesService = {
  list: () => api.get("/categories"),
  create: (data: { name: string; color: string; icon: string }) =>
    api.post("/categories", data),
};

/* ── Transactions ── */
export const transactionsService = {
  list: (params?: { page?: number; limit?: number; nature?: string; search?: string }) =>
    api.get("/transactions", { params }),
  create: (data: unknown) => api.post("/transactions", data),
  update: (id: string, data: unknown) => api.patch(`/transactions/${id}`, data),
  remove: (id: string) => api.delete(`/transactions/${id}`),
};

/* ── Goals ── */
export const goalsService = {
  list: () => api.get("/goals"),
  create: (data: unknown) => api.post("/goals", data),
  update: (id: string, data: unknown) => api.patch(`/goals/${id}`, data),
  remove: (id: string) => api.delete(`/goals/${id}`),
};

/* ── Dashboard ── */
export const dashboardService = {
  summary: () => api.get("/dashboard/summary"),
  chartData: (months = 6) => api.get("/dashboard/chart", { params: { months } }),
  insights: () => api.get("/dashboard/insights"),
};

export default api;
