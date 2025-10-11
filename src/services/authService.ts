import api from "../lib/api";
import { User, RegisterFormData } from "../types/User";

export const authService = {
  // Registro de usuario
  async register(formData: RegisterFormData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await api.post("/auth/register", formData);
      return { success: true, user: response.data };
    } catch (error: any) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Error al registrar usuario",
      };
    }
  },

  // Inicio de sesión
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      // Guardar token localmente
      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      return { success: true, user };
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
  },

  // Cerrar sesión
  async logout() {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  },
};
