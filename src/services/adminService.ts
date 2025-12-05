import api from "../lib/api";
import { User, UpdateAccountStatusDTO, StatusType, AccountStatus } from "../types/User";

export { AccountStatus };

export interface FetchUsersResult {
    success: boolean;
    users?: User[];
    error?: string;
}

export interface UpdateStatusResult {
    success: boolean;
    error?: string;
}

type AdminPersonResponse = {
    token: string;
    person_id: string;
    email: string;
    name: string;
    rol: string;
    gender: string;
    account_status?: StatusType;
};

const mapApiResponseToUser = (apiData: AdminPersonResponse): User => {
    return {
        persona_id: apiData.person_id,
        nombres: apiData.name,
        apellidos: "",
        tipo_identificacion: "",
        numero_identificacion: "",
        email: apiData.email,
        telefono: "",
        fecha_nacimiento: "",
        genero: apiData.gender,
        rol: apiData.rol,
        estado_cuenta: apiData.account_status || AccountStatus.Unverified,
        direccion: undefined,
        ciudad: undefined,
        departamento: undefined,
        codigo_postal: undefined,
        pregunta_seguridad: undefined,
        respuesta_seguridad: undefined,
        aceptar_terminos: false,
        aceptar_datos: false,
        recibir_notificaciones: false,
    };
};

export const adminService = {
    async fetchUsers(accountStatus?: StatusType | null): Promise<FetchUsersResult> {
        try {
            let url = "api/Person";
            if (accountStatus) {
                url += `?accountStatus=${accountStatus}`;
            }
            
            const response = await api.get<AdminPersonResponse[]>(url);

            const mappedUsers: User[] = response.data.map(mapApiResponseToUser);

            return {
                success: true,
                users: mappedUsers, 
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || "Error al obtener usuarios",
            };
        }
    },

    async updateAccountStatus(
        personId: string,
        newStatus: StatusType 
    ): Promise<UpdateStatusResult> {
        try {
            const payload: UpdateAccountStatusDTO = {
                accountStatus: newStatus,
            };
            
            await api.patch(`api/Person/${personId}`, payload); 

            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.error || "Error al actualizar estado de cuenta",
            };
        }
    },
};
