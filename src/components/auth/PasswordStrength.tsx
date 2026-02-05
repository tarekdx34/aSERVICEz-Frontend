import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
  isRTL?: boolean;
}

export function PasswordStrength({ password, isRTL = true }: PasswordStrengthProps) {
  const requirements = [
    {
      label: isRTL ? '8 أحرف على الأقل' : 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      label: isRTL ? 'حرف كبير (A-Z)' : 'Uppercase letter (A-Z)',
      met: /[A-Z]/.test(password),
    },
    {
      label: isRTL ? 'حرف صغير (a-z)' : 'Lowercase letter (a-z)',
      met: /[a-z]/.test(password),
    },
    {
      label: isRTL ? 'رقم واحد على الأقل (0-9)' : 'At least one number (0-9)',
      met: /\d/.test(password),
    },
    {
      label: isRTL ? 'رمز خاص (!@#$%)' : 'Special character (!@#$%)',
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  const metCount = requirements.filter(r => r.met).length;
  const strength = metCount === 0 ? 0 : metCount <= 2 ? 1 : metCount <= 4 ? 2 : 3;
  
  const strengthLabels = {
    0: { label: '', color: 'bg-gray-200' },
    1: { label: isRTL ? 'ضعيفة' : 'Weak', color: 'bg-red-500' },
    2: { label: isRTL ? 'متوسطة' : 'Medium', color: 'bg-orange-500' },
    3: { label: isRTL ? 'قوية' : 'Strong', color: 'bg-green-500' },
  };

  if (!password) return null;

  return (
    <div className="mt-3 space-y-3">
      {/* Strength Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">
            {isRTL ? 'قوة كلمة المرور' : 'Password Strength'}
          </span>
          {strength > 0 && (
            <span className={`text-xs font-medium ${
              strength === 1 ? 'text-red-600' : strength === 2 ? 'text-orange-600' : 'text-green-600'
            }`}>
              {strengthLabels[strength as keyof typeof strengthLabels].label}
            </span>
          )}
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${strengthLabels[strength as keyof typeof strengthLabels].color}`}
            style={{ width: `${(strength / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1.5">
        {requirements.map((req, index) => (
          <div 
            key={index} 
            className={`flex items-center gap-2 text-xs transition-colors ${
              req.met ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            {req.met ? (
              <Check className="w-4 h-4 flex-shrink-0" />
            ) : (
              <X className="w-4 h-4 flex-shrink-0 opacity-50" />
            )}
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
