import api from "../lib/api";

export interface CreateServiceRequestDTO {
    prestadorId: string;
    titulo: string;
    descripcion: string;
    categoria: string;
    precioMin: number;
    precioMax: number;
}

export interface ServiceResponse {
    serviceId: string;
    titulo: string;
}

export interface CreateServiceResult {
    success: boolean;
    service?: ServiceResponse;
    error?: string;
}

export const serviceRequestService = {
    async createService(serviceDto: CreateServiceRequestDTO): Promise<CreateServiceResult> {
        try {
            const response = await api.post<ServiceResponse>("api/ServiceRequest", serviceDto);
            
            return { 
                success: true, 
                service: response.data 
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message 
                               || error.response?.data?.error 
                               || "Error al crear la solicitud de servicio.";
            
            return {
                success: false,
                error: errorMessage,
            };
        }
    },
};