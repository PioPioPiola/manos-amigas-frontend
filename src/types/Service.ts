export type ServiceStatus = 'pendiente' | 'aceptada' | 'en_progreso' | 'completada' | 'cancelada';

export interface Service {
  service_id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  fecha_solicitada: string;
  hora_solicitada?: string;
  direccion: string;
  precio_estimado?: number;
  estado: ServiceStatus;
  solicitante_id: string;
  solicitante_nombre?: string;
  solicitante_telefono?: string;
  prestador_id?: string;
  prestador_nombre?: string;
  prestador_calificacion?: number;
  fecha_creacion: string;
  fecha_actualizacion?: string;
}

export interface ServiceRequest {
  titulo: string;
  descripcion: string;
  categoria: string;
  fecha_solicitada: string;
  hora_solicitada?: string;
  direccion: string;
  precio_estimado?: number;
}

export interface ServiceCategory {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'reparaciones',
    nombre: 'Reparaciones',
    descripcion: 'Asistencia y reparaciones en el hogar',
    icono: 'wrench',
    color: '#2E4A73'
  },
  {
    id: 'hogar',
    nombre: 'Tareas del Hogar',
    descripcion: 'Limpieza, cocina y organización',
    icono: 'home',
    color: '#7ECBF2'
  },
  {
    id: 'tramites',
    nombre: 'Trámites',
    descripcion: 'Acompañamiento en procesos',
    icono: 'users',
    color: '#A8D8EA'
  },
  {
    id: 'compras',
    nombre: 'Compras',
    descripcion: 'Mandados y diligencias',
    icono: 'shopping-cart',
    color: '#5B9FC8'
  },
  {
    id: 'administrativo',
    nombre: 'Apoyo Administrativo',
    descripcion: 'Tareas administrativas',
    icono: 'briefcase',
    color: '#3A6B8F'
  }
];

export interface PrestadorStats {
  servicios_completados: number;
  calificacion_promedio: number;
  ingresos_mes: number;
  servicios_pendientes: number;
  servicios_en_curso: number;
}

export const TYPES_LOADED = true;
