import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface FileUploadProps {
  label: string;
  required?: boolean;
  onFileSelect: (file: File | null) => void;
  acceptedFormats?: string[];
  maxSize?: number;
  hint?: string;
  value?: File | null;
}

export default function FileUpload({
  label,
  required = false,
  onFileSelect,
  acceptedFormats = ['image/jpeg', 'image/png', 'application/pdf'],
  maxSize = 5,
  hint,
  value
}: FileUploadProps) {
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setError('');
      setPreview(null);
      onFileSelect(null);
      return;
    }

    if (!acceptedFormats.includes(file.type)) {
      setError(`Formato no válido. Solo se permiten: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`);
      return;
    }

    if (file.size > maxSize * 1024 * 1024) {
      setError(`El archivo excede el tamaño máximo de ${maxSize}MB`);
      return;
    }

    setError('');

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleRemove = () => {
    handleFileChange(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {hint && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}

      {!value ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
          style={{ borderColor: error ? '#EF4444' : '#7ECBF2' }}
          onClick={() => document.getElementById(`file-${label}`)?.click()}
        >
          <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: '#7ECBF2' }} />
          <p className="text-sm text-gray-600 mb-1">
            Arrastra tu archivo o haz clic para seleccionar
          </p>
          <p className="text-xs text-gray-400">
            {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} - Máx {maxSize}MB
          </p>
          <input
            id={`file-${label}`}
            type="file"
            className="hidden"
            accept={acceptedFormats.join(',')}
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          />
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-gray-50">
          {preview ? (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded" />
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">{value.name}</p>
                  <p className="text-xs text-gray-500">
                    {(value.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemove}
                className="text-red-500 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1 text-red-500 text-xs">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
}
