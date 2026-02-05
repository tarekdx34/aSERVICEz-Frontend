import { useState, InputHTMLAttributes } from 'react';
import { Eye, EyeOff, Check, X, Loader2 } from 'lucide-react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  isRTL?: boolean;
  showPasswordToggle?: boolean;
  validationState?: 'idle' | 'validating' | 'success' | 'error';
  successMessage?: string;
}

export function FormInput({
  label,
  error,
  icon,
  isRTL = true,
  showPasswordToggle = false,
  validationState = 'idle',
  successMessage,
  type = 'text',
  className = '',
  ...props
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  const hasError = !!error || validationState === 'error';
  const hasSuccess = validationState === 'success';

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="relative">
        {/* Leading Icon */}
        {icon && (
          <div className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-gray-400 pointer-events-none`}>
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          type={inputType}
          className={`
            w-full h-12 px-4 ${icon ? (isRTL ? 'pl-10' : 'pr-10') : ''} 
            ${(showPasswordToggle || validationState !== 'idle') ? (isRTL ? 'pr-10' : 'pl-10') : ''}
            border-[1.5px] rounded-lg
            text-base transition-all duration-200
            focus:outline-none focus:ring-3
            ${hasError 
              ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' 
              : hasSuccess
              ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100'
              : 'border-gray-300 bg-white focus:border-teal-600 focus:ring-teal-100'
            }
            ${props.disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
            ${className}
          `}
          {...props}
        />

        {/* Trailing Icon (Password Toggle or Validation Icon) */}
        <div className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} flex items-center gap-1`}>
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          
          {!showPasswordToggle && validationState === 'validating' && (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          )}
          
          {!showPasswordToggle && validationState === 'success' && (
            <Check className="w-5 h-5 text-green-500" />
          )}
          
          {!showPasswordToggle && validationState === 'error' && error && (
            <X className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>

      {/* Error Message */}
      {hasError && error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1 animate-shake">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}

      {/* Success Message */}
      {hasSuccess && successMessage && (
        <p className="mt-1.5 text-sm text-green-600 flex items-center gap-1">
          <Check className="w-4 h-4" />
          {successMessage}
        </p>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
