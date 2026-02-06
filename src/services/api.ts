const API_BASE_URL = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new ApiError(
      data.message || 'An error occurred',
      data.errorCode || response.status,
      data.error
    );
  }
  return data;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public error?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// --- Auth API ---

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  userType: 'customer' | 'expert' | 'admin' | 'customer_service';
  skills?: string;
  specialization?: string;
  bio?: string;
  salary?: number;
  employeeRank?: string;
}

export interface ApiResponse<T = unknown> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
  error?: string;
  errorCode?: number;
}

export interface UserProfile {
  userId: number;
  name: string;
  email: string;
  phone?: string;
  userType: 'customer' | 'expert' | 'admin' | 'customer_service';
  createdAt: string;
  updatedAt: string;
  loyaltyPoints?: number;
  expertId?: number;
  skills?: string;
  specialization?: string;
  rating?: number;
  bio?: string;
  adminId?: number;
  salary?: number;
  employeeRank?: string;
  csId?: number;
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse<ApiResponse>(response);
  },

  async register(data: RegisterRequest): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse>(response);
  },

  async logout(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },

  async getProfile(): Promise<ApiResponse<UserProfile>> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<ApiResponse<UserProfile>>(response);
  },
};
