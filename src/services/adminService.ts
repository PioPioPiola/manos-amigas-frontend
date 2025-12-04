import api from "../lib/api";
import { User, UpdateAccountStatusDTO } from "../types/User";

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
  async fetchUsers(accountStatus?: 'U' | 'V' | 'S' | null): Promise<FetchUsersResult> {
    try {
      let url = "api/Personas/GetPersons";

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
    newStatus: 'V' | 'S'
  ): Promise<UpdateStatusResult> {
    try {
      const payload: UpdateAccountStatusDTO = {
        accountStatus: newStatus,
      };

      await api.patch(`api/Personas/${personId}`, payload);

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || "Error al actualizar estado de cuenta",
      };
    }
  },
};
