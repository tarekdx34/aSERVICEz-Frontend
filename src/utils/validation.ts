// Simulated API calls for validation
export async function checkUsernameAvailability(username: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock logic: usernames containing 'admin' or 'test' are taken
  const takenUsernames = ['admin', 'test', 'user', 'aSERVICEa'];
  return !takenUsernames.some(taken => username.toLowerCase().includes(taken));
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock logic: certain domains are taken
  const takenEmails = ['test@example.com', 'admin@aservicea.com'];
  return !takenEmails.includes(email.toLowerCase());
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUsername(username: string): {
  valid: boolean;
  error?: string;
} {
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }
  if (username.length > 20) {
    return { valid: false, error: 'Username must be less than 20 characters' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  return { valid: true };
}

export function validatePassword(password: string): {
  valid: boolean;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
} {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const valid = Object.values(requirements).every(req => req);

  return { valid, requirements };
}

export function calculatePasswordStrength(password: string): number {
  const { requirements } = validatePassword(password);
  const metCount = Object.values(requirements).filter(Boolean).length;
  
  if (metCount === 0) return 0;
  if (metCount <= 2) return 1; // Weak
  if (metCount <= 4) return 2; // Medium
  return 3; // Strong
}
