import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 Автоматически добавляем токен
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const api = {
  // === КНИГИ ===
  async getBooks() {
    const res = await client.get("/books");
    return res.data;
  },
  async getBook(id: number) {
    const res = await client.get(`/books/${id}`);
    return res.data;
  },
  async createBook(payload: any) {
    const res = await client.post("/books", payload);
    return res.data;
  },
  async updateBook(id: number, payload: any) {
    const res = await client.put(`/books/${id}`, payload);
    return res.data;
  },
  async deleteBook(id: number) {
    const res = await client.delete(`/books/${id}`);
    return res.data;
  },

  // === ФИЛИАЛЫ ===
  async getBranches() {
    const res = await client.get("/branches");
    return res.data;
  },
  async getBranch(id: number) {
    const res = await client.get(`/branches/${id}`);
    return res.data;
  },
  async createBranch(payload: any) {
    const res = await client.post("/branches", payload);
    return res.data;
  },
  async updateBranch(id: number, payload: any) {
    const res = await client.put(`/branches/${id}`, payload);
    return res.data;
  },
  async deleteBranch(id: number) {
    const res = await client.delete(`/branches/${id}`);
    return res.data;
  },

  // === ПОЛЬЗОВАТЕЛИ ===
  async getUsers() {
    const res = await client.get("/users");
    return res.data;
  },
  async createUser(payload: {
    username: string;
    password_hash: string;
    role: string;
    full_name: string;
    email: string;
    is_active: boolean;
  }) {
    const res = await client.post("/users", payload);
    return res.data;
  },
  async changePassword(username: string, password: string) {
    const res = await client.put(`/users/${username}/password`, { password });
    return res.data;
  },
  async deleteUser(userId: number) {
    const res = await client.delete(`/users/${userId}`);
    return res.data;
  },

  // === АУТЕНТИФИКАЦИЯ ===
  async login(username: string, password: string) {
    const res = await client.post("/auth/login", { username, password });
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
    }
    return res.data;
  },
  async logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  },
};

export default api;
