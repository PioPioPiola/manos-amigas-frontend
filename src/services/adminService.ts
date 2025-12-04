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

export const adminService = {
    async fetchUsers(accountStatus?: StatusType | null): Promise<FetchUsersResult> {
        try {
            let url = "api/Person";

            if (accountStatus) {
                url += `?accountStatus=${accountStatus}`;
            }

            const response = await api.get<User[]>(url);

            return {
                success: true,
                users: response.data,
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