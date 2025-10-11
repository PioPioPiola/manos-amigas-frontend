export interface User {
  persona_id: string;
  nombres: string;
  apellidos: string;
  tipo_identificacion: string;
  numero_identificacion: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  rol: string;
  estado_cuenta: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
  codigo_postal?: string;
  pregunta_seguridad?: string;
  respuesta_seguridad?: string;
  aceptar_terminos: boolean;
  aceptar_datos: boolean;
  recibir_notificaciones: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  documentType: string;
  documentNumber: string;
  documentExpedition: string;
  documentPlace: string;
  documentFront: File | null;
  documentBack: File | null;
  selfieWithDocument: File | null;
  address: string;
  city: string;
  department: string;
  postalCode?: string;
  password: string;
  confirmPassword: string;
  securityQuestion: string;
  securityAnswer: string;
  acceptTerms: boolean;
  acceptDataTreatment: boolean;
  receiveNotifications: boolean;
}

export interface DocumentoPersona {
  persona_id: string;
  documento_id: number;
  numero_documento: string;
  fecha_emision?: string;
  fecha_expiracion?: string;
  archivo_url: string;
  estado_validacion?: string;
  fecha_validacion?: string;
  observaciones?: string;
  tipodoc_id: number;
}
