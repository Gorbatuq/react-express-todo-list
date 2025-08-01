import { api, safeRequest } from "./http";

export const authApi = {
  register: (email: string, password: string) =>
    safeRequest(api.post("/auth/register", { email, password }, { withCredentials: true })),

  login: (email: string, password: string) =>
    safeRequest(api.post("/auth/login", { email, password }, { withCredentials: true })),

  logout: () =>
    safeRequest(api.post("/auth/logout")),
  
getMe: async () => {
  const res = await api.get("/auth/me", { withCredentials: true });
  return res.data;
}

};
