import api from "../lib/api.ts";
import { User, RegisterFormData } from "../types/User.ts";

type AuthSuccessResponse = {
    token: string;
    id: string; 
    email: string;
    name: string;
    rol: string;
    gender: string;
};

type AuthResult = { success: boolean; user?: User; error?: string };

const mapApiResponseToUser = (apiData: Omit<AuthSuccessResponse, 'token'>): User => {
    return {
        persona_id: apiData.id,
        nombres: apiData.name, 
        apellidos: "", 
        tipo_identificacion: "", 
        numero_identificacion: "", 
        email: apiData.email,
        telefono: "", 
        fecha_nacimiento: "", 
        genero: apiData.gender,
        rol: apiData.rol,
        estado_cuenta: "Pendiente verificación",
        direccion: undefined,
        ciudad: undefined,
        departamento: undefined,
        codigo_postal: undefined,
        pregunta_seguridad: undefined,
        respuesta_seguridad: undefined,
        aceptar_terminos: false,
        aceptar_datos: false,
        recibir_notificaciones: false,
    } as User;
};

export const authService = {
  async register(formData: RegisterFormData): Promise<AuthResult> {
    try {
      const response = await api.post<AuthSuccessResponse>("api/Auth/register", formData);
      
      const { token, ...restData } = response.data; 

      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      
      const user: User = mapApiResponseToUser(restData as any); 
      
      return { success: true, user };
      
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || "Error al registrar usuario",
      };
    }
  },

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const response = await api.post<AuthSuccessResponse>("api/Auth/login", { email, password });
      
      const { token, ...restData } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const user: User = mapApiResponseToUser(restData as any);

      return { success: true, user };
      
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || "Error al iniciar sesión",
      };
    }
  },

  async logout() {
    try {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];

      await api.post("api/Auth/logout");
    }
    catch(error: any)
    {
      console.error("Error during logout:", error);
    }
  },
};