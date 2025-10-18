export interface User {
  persona_id: string;
  nombres: string;
  apellidos: string;
  tipo_identificacion: string;
  numero_identificacion: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  genero: string;
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
  Email: string;
  Password: string;
  Name: string;
  IdentificationType: string;
  IdentificationNumber: string;
  PhoneNumber: string;
  DateOfBirth: string;
  Role?: string;
  Gender?: string;
  DocTypeId: number;
  IssueDate: string;
  IssuePlace: string;
  DocumentFront: File | null;
  DocumentBack: File | null;
  SelfieWithDocument: File | null;
  Address: string;
  City: string;
  Department: string;
  PostalCode?: string;
  SecurityQuestion: string;
  SecurityAnswer: string;
  AcceptTerms: boolean;
  AcceptDataPolicy: boolean;
  WantsNotifications: boolean;
  ConfirmPassword: string;
}

// export interface RegisterFormData {
//   name: string;
//   email: string;
//   phone: string;
//   birthDate: string;
//   gender: string;
//   documentType: string;
//   documentNumber: string;
//   documentExpedition: string;
//   documentPlace: string;
//   address: string;
//   city: string;
//   department: string;
//   postalCode?: string;
//   password: string;
//   confirmPassword: string;
//   securityQuestion: string;
//   securityAnswer: string;
//   acceptTerms: boolean;
//   acceptDataTreatment: boolean;
//   receiveNotifications: boolean;
// }

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

export const TYPES_LOADED = true;