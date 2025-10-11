import { useState } from 'react';
import { User, Mail, Phone, Calendar, FileText, MapPin, Lock, Eye, EyeOff, ChevronLeft, ChevronRight, AlertCircle, Check } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { RegisterFormData } from '../types/User';

interface RegisterProps {
  onRegister: (userData: RegisterFormData) => Promise<void>;
  onBackToLogin: () => void;
  isLoading?: boolean;
}

export default function Register({ onRegister, onBackToLogin, isLoading: externalLoading = false }: RegisterProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    documentType: '',
    documentNumber: '',
    documentExpedition: '',
    documentPlace: '',
    documentFront: null,
    documentBack: null,
    selfieWithDocument: null,
    address: '',
    city: '',
    department: '',
    postalCode: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
    acceptTerms: false,
    acceptDataTreatment: false,
    receiveNotifications: false
  });

  const colombianCities = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué'];
  const colombianDepartments = ['Antioquia', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas', 'Cundinamarca', 'Magdalena', 'Santander', 'Valle del Cauca'];

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    return phone.replace(/\D/g, '').length === 10;
  };

  const getPasswordStrength = (password: string): { level: number; text: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) return { level: 1, text: 'Débil', color: '#EF4444' };
    if (strength === 2 || strength === 3) return { level: 2, text: 'Media', color: '#F59E0B' };
    return { level: 3, text: 'Fuerte', color: '#10B981' };
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
      if (!formData.email.trim()) newErrors.email = 'El email es requerido';
      else if (!validateEmail(formData.email)) newErrors.email = 'Email inválido';
      if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
      else if (!validatePhone(formData.phone)) newErrors.phone = 'Teléfono debe tener 10 dígitos';
      if (!formData.birthDate) newErrors.birthDate = 'La fecha de nacimiento es requerida';
    }

    if (step === 2) {
      if (!formData.documentType) newErrors.documentType = 'El tipo de documento es requerido';
      if (!formData.documentNumber.trim()) newErrors.documentNumber = 'El número de documento es requerido';
    }

    if (step === 3) {
      if (!formData.documentFront) newErrors.documentFront = 'La foto frontal es requerida';
      if (!formData.documentBack) newErrors.documentBack = 'La foto trasera es requerida';
      if (!formData.selfieWithDocument) newErrors.selfieWithDocument = 'La selfie con documento es requerida';
    }

    if (step === 4) {
      if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
      if (!formData.city) newErrors.city = 'La ciudad es requerida';
      if (!formData.department) newErrors.department = 'El departamento es requerido';
    }

    if (step === 5) {
      if (!formData.password) newErrors.password = 'La contraseña es requerida';
      else if (formData.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
      else if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Debe contener al menos una mayúscula';
      else if (!/[0-9]/.test(formData.password)) newErrors.password = 'Debe contener al menos un número';

      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirma tu contraseña';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';

      if (!formData.securityQuestion) newErrors.securityQuestion = 'Selecciona una pregunta de seguridad';
      if (!formData.securityAnswer.trim()) newErrors.securityAnswer = 'La respuesta es requerida';
    }

    if (step === 6) {
      if (!formData.acceptTerms) newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
      if (!formData.acceptDataTreatment) newErrors.acceptDataTreatment = 'Debes aceptar el tratamiento de datos';
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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: errors.name ? '#EF4444' : '#E5E7EB' }}
                  placeholder="Juan Pérez García"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: errors.email ? '#EF4444' : '#E5E7EB' }}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de celular <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: errors.phone ? '#EF4444' : '#E5E7EB' }}
                  placeholder="+57 300 123 4567"
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de nacimiento <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: errors.birthDate ? '#EF4444' : '#E5E7EB' }}
                />
              </div>
              {errors.birthDate && <p className="text-xs text-red-500 mt-1">{errors.birthDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                style={{ borderColor: '#E5E7EB' }}
              >
                <option value="">Selecciona una opción</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
                <option value="Prefiero no decir">Prefiero no decir</option>
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
                  value={formData.documentType}
                  onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: errors.documentType ? '#EF4444' : '#E5E7EB' }}
                >
                  <option value="">Selecciona el tipo</option>
                  <option value="CC">Cédula de ciudadanía (CC)</option>
                  <option value="CE">Cédula de extranjería (CE)</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="PEP">PEP (Permiso Especial de Permanencia)</option>
                </select>
              </div>
              {errors.documentType && <p className="text-xs text-red-500 mt-1">{errors.documentType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de documento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.documentNumber}
                onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value.replace(/\D/g, '') })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                style={{ borderColor: errors.documentNumber ? '#EF4444' : '#E5E7EB' }}
                placeholder="1234567890"
              />
              {errors.documentNumber && <p className="text-xs text-red-500 mt-1">{errors.documentNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de expedición</label>
              <input
                type="date"
                value={formData.documentExpedition}
                onChange={(e) => setFormData({ ...formData, documentExpedition: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                style={{ borderColor: '#E5E7EB' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lugar de expedición</label>
              <input
                type="text"
                value={formData.documentPlace}
                onChange={(e) => setFormData({ ...formData, documentPlace: e.target.value })}
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
              value={formData.documentFront}
              onFileSelect={(file) => setFormData({ ...formData, documentFront: file })}
              acceptedFormats={['image/jpeg', 'image/png', 'application/pdf']}
              maxSize={5}
            />
            {errors.documentFront && <p className="text-xs text-red-500 mt-1">{errors.documentFront}</p>}

            <FileUpload
              label="Foto reverso del documento"
              required
              value={formData.documentBack}
              onFileSelect={(file) => setFormData({ ...formData, documentBack: file })}
              acceptedFormats={['image/jpeg', 'image/png', 'application/pdf']}
              maxSize={5}
            />
            {errors.documentBack && <p className="text-xs text-red-500 mt-1">{errors.documentBack}</p>}

            <FileUpload
              label="Selfie con documento"
              required
              value={formData.selfieWithDocument}
              onFileSelect={(file) => setFormData({ ...formData, selfieWithDocument: file })}
              acceptedFormats={['image/jpeg', 'image/png']}
              maxSize={5}
              hint="Toma una foto sosteniendo tu documento junto a tu rostro"
            />
            {errors.selfieWithDocument && <p className="text-xs text-red-500 mt-1">{errors.selfieWithDocument}</p>}
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
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: errors.address ? '#EF4444' : '#E5E7EB' }}
                  placeholder="Calle 123 #45-67"
                />
              </div>
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                style={{ borderColor: errors.city ? '#EF4444' : '#E5E7EB' }}
              >
                <option value="">Selecciona una ciudad</option>
                {colombianCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                style={{ borderColor: errors.department ? '#EF4444' : '#E5E7EB' }}
              >
                <option value="">Selecciona un departamento</option>
                {colombianDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código postal <span className="text-gray-400">(opcional)</span>
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                style={{ borderColor: '#E5E7EB' }}
                placeholder="110111"
              />
            </div>
          </div>
        );

      case 5:
        const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null;

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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: errors.password ? '#EF4444' : '#E5E7EB' }}
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
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                  style={{ borderColor: errors.confirmPassword ? '#EF4444' : formData.confirmPassword && formData.password === formData.confirmPassword ? '#10B981' : '#E5E7EB' }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <Check className="absolute right-12 top-3 w-5 h-5 text-green-500" />
                )}
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pregunta de seguridad <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.securityQuestion}
                onChange={(e) => setFormData({ ...formData, securityQuestion: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                style={{ borderColor: errors.securityQuestion ? '#EF4444' : '#E5E7EB' }}
              >
                <option value="">Selecciona una pregunta</option>
                <option value="mascota">¿Nombre de tu primera mascota?</option>
                <option value="ciudad">¿Ciudad donde naciste?</option>
                <option value="amigo">¿Nombre de tu mejor amigo de infancia?</option>
                <option value="comida">¿Comida favorita?</option>
              </select>
              {errors.securityQuestion && <p className="text-xs text-red-500 mt-1">{errors.securityQuestion}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Respuesta de seguridad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.securityAnswer}
                onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                style={{ borderColor: errors.securityAnswer ? '#EF4444' : '#E5E7EB' }}
                placeholder="Tu respuesta"
              />
              {errors.securityAnswer && <p className="text-xs text-red-500 mt-1">{errors.securityAnswer}</p>}
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
              <div className="border rounded-lg p-4" style={{ borderColor: errors.acceptTerms ? '#EF4444' : '#E5E7EB' }}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
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
                {errors.acceptTerms && <p className="text-xs text-red-500 mt-1 ml-7">{errors.acceptTerms}</p>}
              </div>

              <div className="border rounded-lg p-4" style={{ borderColor: errors.acceptDataTreatment ? '#EF4444' : '#E5E7EB' }}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptDataTreatment}
                    onChange={(e) => setFormData({ ...formData, acceptDataTreatment: e.target.checked })}
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
                {errors.acceptDataTreatment && <p className="text-xs text-red-500 mt-1 ml-7">{errors.acceptDataTreatment}</p>}
              </div>

              <div className="border rounded-lg p-4" style={{ borderColor: '#E5E7EB' }}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.receiveNotifications}
                    onChange={(e) => setFormData({ ...formData, receiveNotifications: e.target.checked })}
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
