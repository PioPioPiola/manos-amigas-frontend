import { useState } from 'react';
import { User, Mail, Phone, Calendar, FileText, MapPin, Lock, Eye, EyeOff, ChevronLeft, ChevronRight, AlertCircle, Check } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { RegisterFormData } from '../types/User';

interface RegisterProps {
  onRegister: (userData: RegisterFormData) => Promise<void>;
  onBackToLogin: () => void;
  isLoading?: boolean;
  apiError?: string | null;
}

export default function Register({ onRegister, onBackToLogin, isLoading: externalLoading = false, apiError }: RegisterProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<RegisterFormData>({
    Name: '',
    Email: '',
    PhoneNumber: '',
    Role: '0',
    DateOfBirth: '',
    Gender: '',
    IdentificationType: '',
    IdentificationNumber: '',
    IssueDate: '',
    IssuePlace: '',
    DocTypeId: 1,
    DocumentFront: null,
    DocumentBack: null,
    SelfieWithDocument: null,
    Address: '',
    City: '',
    Department: '',
    PostalCode: '',
    Password: '',
    ConfirmPassword: '',
    SecurityQuestion: '',
    SecurityAnswer: '',
    AcceptTerms: false,
    AcceptDataPolicy: false,
    WantsNotifications: false
  });

  const colombianCities = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué'];
  const colombianDepartments = ['Antioquia', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas', 'Cundinamarca', 'Magdalena', 'Santander', 'Valle del Cauca'];

  const validateEmail = (Email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(Email);
  };

  const validatePhone = (PhoneNumber: string) => {
    return PhoneNumber.replace(/\D/g, '').length === 10;
  };

  const getPasswordStrength = (Password: string): { level: number; text: string; color: string } => {
    let strength = 0;
    if (Password.length >= 8) strength++;
    if (/[A-Z]/.test(Password)) strength++;
    if (/[0-9]/.test(Password)) strength++;
    if (/[^A-Za-z0-9]/.test(Password)) strength++;

    if (strength <= 1) return { level: 1, text: 'Débil', color: '#EF4444' };
    if (strength === 2 || strength === 3) return { level: 2, text: 'Media', color: '#F59E0B' };
    return { level: 3, text: 'Fuerte', color: '#10B981' };
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.Name.trim()) newErrors.Name = 'El nombre es requerido';
      if (!formData.Email.trim()) newErrors.Email = 'El email es requerido';
      else if (!validateEmail(formData.Email)) newErrors.Email = 'Email inválido';
      if (!formData.PhoneNumber.trim()) newErrors.PhoneNumber = 'El teléfono es requerido';
      else if (!validatePhone(formData.PhoneNumber)) newErrors.PhoneNumber = 'Teléfono debe tener 10 dígitos';
      if (!formData.DateOfBirth) newErrors.DateOfBirth = 'La fecha de nacimiento es requerida';
    }

    if (step === 2) {
      if (!formData.IdentificationType) newErrors.IdentificationType = 'El tipo de documento es requerido';
      if (!formData.IdentificationNumber.trim()) newErrors.IdentificationNumber = 'El número de documento es requerido';
    }

    if (step === 3) {
      // if (!formData.DocumentFront) newErrors.DocumentFront = 'La foto frontal es requerida';
      // if (!formData.DocumentBack) newErrors.DocumentBack = 'La foto trasera es requerida';
      // if (!formData.SelfieWithDocument) newErrors.SelfieWithDocument = 'La selfie con documento es requerida';
    }

    if (step === 4) {
      if (!formData.Address.trim()) newErrors.Address = 'La dirección es requerida';
      if (!formData.City) newErrors.City = 'La ciudad es requerida';
      if (!formData.Department) newErrors.Department = 'El departamento es requerido';
    }

    if (step === 5) {
      if (!formData.Password) newErrors.Password = 'La contraseña es requerida';
      else if (formData.Password.length < 8) newErrors.Password = 'Mínimo 8 caracteres';
      else if (!/[A-Z]/.test(formData.Password)) newErrors.Password = 'Debe contener al menos una mayúscula';
      else if (!/[0-9]/.test(formData.Password)) newErrors.Password = 'Debe contener al menos un número';

      if (!formData.ConfirmPassword) newErrors.ConfirmPassword = 'Confirma tu contraseña';
      else if (formData.Password !== formData.ConfirmPassword) newErrors.ConfirmPassword = 'Las contraseñas no coinciden';

      if (!formData.SecurityQuestion) newErrors.SecurityQuestion = 'Selecciona una pregunta de seguridad';
      if (!formData.SecurityAnswer.trim()) newErrors.SecurityAnswer = 'La respuesta es requerida';
    }

    if (step === 6) {
      if (!formData.AcceptTerms) newErrors.AcceptTerms = 'Debes aceptar los términos y condiciones';
      if (!formData.AcceptDataPolicy) newErrors.AcceptDataPolicy = 'Debes aceptar el tratamiento de datos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
      } else {
        await onRegister(formData);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4" style={{ color: '#2E4A73' }}>
              Información Personal
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.Name}
                  onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: errors.Name ? '#EF4444' : '#E5E7EB' }}
                  placeholder="Juan Pérez García"
                />
              </div>
              {errors.Name && <p className="text-xs text-red-500 mt-1">{errors.Name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.Email}
                  onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: errors.Email ? '#EF4444' : '#E5E7EB' }}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              {errors.Email && <p className="text-xs text-red-500 mt-1">{errors.Email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de celular <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.PhoneNumber}
                  onChange={(e) => setFormData({ ...formData, PhoneNumber: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: errors.PhoneNumber ? '#EF4444' : '#E5E7EB' }}
                  placeholder="+57 300 123 4567"
                />
              </div>
              {errors.PhoneNumber && <p className="text-xs text-red-500 mt-1">{errors.PhoneNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de nacimiento <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.DateOfBirth}
                  onChange={(e) => setFormData({ ...formData, DateOfBirth: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: errors.DateOfBirth ? '#EF4444' : '#E5E7EB' }}
                />
              </div>
              {errors.DateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.DateOfBirth}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
              <select
                value={formData.Gender}
                onChange={(e) => setFormData({ ...formData, Gender: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                style={{ borderColor: '#E5E7EB' }}
              >
                <option value="">Selecciona una opción</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
                <option value="N">Prefiero no decir</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4" style={{ color: '#2E4A73' }}>
              Documento de Identidad
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de documento <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  value={formData.IdentificationType}
                  onChange={(e) => setFormData({ ...formData, IdentificationType: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: errors.IdentificationType ? '#EF4444' : '#E5E7EB' }}
                >
                  <option value=" ">Seleccione un tipo de documento...</option>
                  <option value="0">Cédula de ciudadanía (CC)</option>
                  <option value="1">Tarjeta de identidad (TI)</option>
                  <option value="2">Cédula de extranjería (CE)</option>
                  <option value="3">Pasaporte (PA)</option>
                  <option value="4">Registro Civil (RC)</option>
                  <option value="5">NIT</option>
                  <option value="6">PEP (Permiso Especial de Permanencia)</option>
                  <option value="7">Salvoconducto (SC)</option>
                  <option value="8">Documento de Identificación de Menores (DIM)</option>
                  <option value="9">Permiso Temporal (TEMP)</option>
                </select>
              </div>
              {errors.IdentificationType && <p className="text-xs text-red-500 mt-1">{errors.IdentificationType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de documento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.IdentificationNumber}
                onChange={(e) => setFormData({ ...formData, IdentificationNumber: e.target.value.replace(/\D/g, '') })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                style={{ borderColor: errors.IdentificationNumber ? '#EF4444' : '#E5E7EB' }}
                placeholder="1234567890"
              />
              {errors.IdentificationNumber && <p className="text-xs text-red-500 mt-1">{errors.IdentificationNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de expedición</label>
              <input
                type="date"
                value={formData.IssueDate}
                onChange={(e) => setFormData({ ...formData, IssueDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                style={{ borderColor: '#E5E7EB' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lugar de expedición</label>
              <input
                type="text"
                value={formData.IssuePlace}
                onChange={(e) => setFormData({ ...formData, IssuePlace: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                style={{ borderColor: '#E5E7EB' }}
                placeholder="Bogotá D.C."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4" style={{ color: '#2E4A73' }}>
              Documentos
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Por favor, carga imágenes claras de tu documento de identidad
            </p>

            <FileUpload
              label="Foto frontal del documento"
              required
              value={formData.DocumentFront}
              onFileSelect={(file) => setFormData({ ...formData, DocumentFront: file })}
              acceptedFormats={['image/jpeg', 'image/png', 'application/pdf']}
              maxSize={5}
            />
            {errors.DocumentFront && <p className="text-xs text-red-500 mt-1">{errors.DocumentFront}</p>}

            <FileUpload
              label="Foto reverso del documento"
              required
              value={formData.DocumentBack}
              onFileSelect={(file) => setFormData({ ...formData, DocumentBack: file })}
              acceptedFormats={['image/jpeg', 'image/png', 'application/pdf']}
              maxSize={5}
            />
            {errors.DocumentBack && <p className="text-xs text-red-500 mt-1">{errors.DocumentBack}</p>}

            <FileUpload
              label="Selfie con documento"
              required
              value={formData.SelfieWithDocument}
              onFileSelect={(file) => setFormData({ ...formData, SelfieWithDocument: file })}
              acceptedFormats={['image/jpeg', 'image/png']}
              maxSize={5}
              hint="Toma una foto sosteniendo tu documento junto a tu rostro"
            />
            {errors.SelfieWithDocument && <p className="text-xs text-red-500 mt-1">{errors.SelfieWithDocument}</p>}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4" style={{ color: '#2E4A73' }}>
              Dirección
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección completa <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.Address}
                  onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: errors.Address ? '#EF4444' : '#E5E7EB' }}
                  placeholder="Calle 123 #45-67"
                />
              </div>
              {errors.Address && <p className="text-xs text-red-500 mt-1">{errors.Address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.City}
                onChange={(e) => setFormData({ ...formData, City: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                style={{ borderColor: errors.City ? '#EF4444' : '#E5E7EB' }}
              >
                <option value="">Selecciona una ciudad</option>
                {colombianCities.map(City => (
                  <option key={City} value={City}>{City}</option>
                ))}
              </select>
              {errors.City && <p className="text-xs text-red-500 mt-1">{errors.City}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.Department}
                onChange={(e) => setFormData({ ...formData, Department: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                style={{ borderColor: errors.Department ? '#EF4444' : '#E5E7EB' }}
              >
                <option value="">Selecciona un departamento</option>
                {colombianDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.Department && <p className="text-xs text-red-500 mt-1">{errors.Department}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código postal <span className="text-gray-400">(opcional)</span>
              </label>
              <input
                type="text"
                value={formData.PostalCode}
                onChange={(e) => setFormData({ ...formData, PostalCode: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                style={{ borderColor: '#E5E7EB' }}
                placeholder="110111"
              />
            </div>
          </div>
        );

      case 5:
        const passwordStrength = formData.Password ? getPasswordStrength(formData.Password) : null;

        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4" style={{ color: '#2E4A73' }}>
              Información de Seguridad
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.Password}
                  onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
                  className="w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: errors.Password ? '#EF4444' : '#E5E7EB' }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map(level => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded"
                        style={{
                          backgroundColor: level <= passwordStrength.level ? passwordStrength.color : '#E5E7EB'
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: passwordStrength.color }}>
                    Fortaleza: {passwordStrength.text}
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 8 caracteres, 1 mayúscula, 1 número, 1 carácter especial
              </p>
              {errors.Password && <p className="text-xs text-red-500 mt-1">{errors.Password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'Password'}
                  value={formData.ConfirmPassword}
                  onChange={(e) => setFormData({ ...formData, ConfirmPassword: e.target.value })}
                  className="w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: errors.ConfirmPassword ? '#EF4444' : formData.ConfirmPassword && formData.Password === formData.ConfirmPassword ? '#10B981' : '#E5E7EB' }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {formData.ConfirmPassword && formData.Password === formData.ConfirmPassword && (
                  <Check className="absolute right-12 top-3 w-5 h-5 text-green-500" />
                )}
              </div>
              {errors.ConfirmPassword && <p className="text-xs text-red-500 mt-1">{errors.ConfirmPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pregunta de seguridad <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.SecurityQuestion}
                onChange={(e) => setFormData({ ...formData, SecurityQuestion: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                style={{ borderColor: errors.SecurityQuestion ? '#EF4444' : '#E5E7EB' }}
              >
                <option value="">Selecciona una pregunta</option>
                <option value="0">¿Nombre de tu primera mascota?</option>
                <option value="1">¿Ciudad donde naciste?</option>
                <option value="2">¿Nombre de tu mejor amigo de infancia?</option>
                <option value="3">¿Comida favorita?</option>
              </select>
              {errors.SecurityQuestion && <p className="text-xs text-red-500 mt-1">{errors.SecurityQuestion}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Respuesta de seguridad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.SecurityAnswer}
                onChange={(e) => setFormData({ ...formData, SecurityAnswer: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                style={{ borderColor: errors.SecurityAnswer ? '#EF4444' : '#E5E7EB' }}
                placeholder="Tu respuesta"
              />
              {errors.SecurityAnswer && <p className="text-xs text-red-500 mt-1">{errors.SecurityAnswer}</p>}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4" style={{ color: '#2E4A73' }}>
              Términos y Condiciones
            </h3>

            <div className="space-y-3">
              <div className="border rounded-lg p-4" style={{ borderColor: errors.AcceptTerms ? '#EF4444' : '#E5E7EB' }}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.AcceptTerms}
                    onChange={(e) => setFormData({ ...formData, AcceptTerms: e.target.checked })}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    Acepto los{' '}
                    <a href="#" className="text-blue-500 hover:underline">
                      términos y condiciones
                    </a>{' '}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.AcceptTerms && <p className="text-xs text-red-500 mt-1 ml-7">{errors.AcceptTerms}</p>}
              </div>

              <div className="border rounded-lg p-4" style={{ borderColor: errors.AcceptDataPolicy ? '#EF4444' : '#E5E7EB' }}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.AcceptDataPolicy}
                    onChange={(e) => setFormData({ ...formData, AcceptDataPolicy: e.target.checked })}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    Acepto el{' '}
                    <a href="#" className="text-blue-500 hover:underline">
                      tratamiento de datos personales
                    </a>{' '}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.AcceptDataPolicy && <p className="text-xs text-red-500 mt-1 ml-7">{errors.AcceptDataPolicy}</p>}
              </div>

              <div className="border rounded-lg p-4" style={{ borderColor: '#E5E7EB' }}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.WantsNotifications}
                    onChange={(e) => setFormData({ ...formData, WantsNotifications: e.target.checked })}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    Deseo recibir notificaciones y ofertas
                  </span>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-semibold mb-1">Protección de datos</p>
                  <p>
                    Tus datos personales están protegidos y solo serán utilizados para proporcionar
                    nuestros servicios. Lee nuestra{' '}
                    <a href="#" className="underline">
                      política de privacidad
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F7FA' }}>
      <div className="max-w-2xl mx-auto w-full p-6 flex-1">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBackToLogin}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </button>
            <div className="text-sm font-medium text-gray-600">
              Paso {currentStep} de 6
            </div>
          </div>

          <div className="flex gap-1 mb-6">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className="h-2 flex-1 rounded-full transition-all"
                style={{
                  backgroundColor: step <= currentStep ? '#7ECBF2' : '#E5E7EB'
                }}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Crear cuenta nueva</h2>
            <p className="text-sm text-gray-600 mt-1">
              Completa todos los pasos para crear tu cuenta en ManosAmigas
            </p>
          </div>
          
          {apiError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 border border-red-200 rounded-lg mb-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{apiError}</p>
            </div>
          )}

          {renderStep()}
        </div>

        <div className="flex justify-between gap-4">
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 px-6 py-3 border rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={externalLoading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#0A2540' }}
          >
            {externalLoading && currentStep === 6 ? 'Registrando...' : currentStep === 6 ? 'Finalizar registro' : 'Siguiente'}
            {currentStep < 6 && !externalLoading && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={onBackToLogin}
            className="font-semibold hover:underline"
            style={{ color: '#7ECBF2' }}
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}