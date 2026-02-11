const API_BASE_URL = '/api';

function getAuthHeaders(includeContentType = true): HeadersInit {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {};
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data.message || 'An error occurred';
    throw new ApiError(errorMsg, response.status, data.errors?.join(', '));
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

// --- Common Types ---
// Backend uses { status: "success", message: "...", data: ... }

export interface ApiResponse<T = unknown> {
  status: string;
  message?: string;
  data: T;
  errors?: string[];
}

export interface PaginationResponse {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// --- Auth Types ---

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  userType: 'CUSTOMER' | 'EXPERT' | 'ADMIN' | 'CUSTOMER_SERVICE';
}

export interface AuthData {
  token: string;
  userId: number;
  email: string;
  name: string;
  userType: string;
}

export interface UserProfile {
  userId: number;
  name: string;
  email: string;
  phone?: string;
  userType: string;
  createdAt?: string;
  updatedAt?: string;
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

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  skills?: string;
  specialization?: string;
  bio?: string;
  currentPassword?: string;
  newPassword?: string;
}

// --- Service Types ---

export interface ExpertInfo {
  expertId: number;
  name: string;
  avatar?: string;
  level?: string;
  badge?: string;
  rating?: number;
}

export interface ServiceResponse {
  serviceId: number;
  serviceName: string;
  description?: string;
  price: number;
  duration?: number;
  status?: string;
  rating?: number;
  thumbnail?: string;
  category?: { categoryId: number; name: string };
  subcategory?: { subcategoryId: number; name: string };
  expert?: ExpertInfo;
  createdAt?: string;
  updatedAt?: string;
  // Mapped fields for UI compatibility
  id: number | string;
  title: string;
  deliveryTime?: number;
  reviewCount?: number;
  sales?: number;
}

// Helper to normalize a service from backend format to UI format
function normalizeService(s: any): ServiceResponse {
  return {
    ...s,
    id: s.serviceId ?? s.id,
    title: s.serviceName ?? s.title ?? '',
    deliveryTime: s.duration ?? s.deliveryTime,
    thumbnail: s.thumbnail ? (s.thumbnail.startsWith('http') ? s.thumbnail : `${API_BASE_URL.replace('/api', '')}${s.thumbnail}`) : undefined,
    expert: s.expert ? {
      ...s.expert,
      name: s.expert.name || '',
      rating: s.expert.rating,
    } : undefined,
    category: s.category,
    subcategory: s.subcategory,
  };
}

export interface ServiceListData {
  services: ServiceResponse[];
  pagination: PaginationResponse;
}

export interface ServiceListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

export interface CreateServiceRequest {
  serviceName: string;
  description: string;
  price: number;
  duration: number;
  categoryId: number;
  subcategoryId: number;
}

// --- Category Types ---

export interface SubcategoryResponse {
  subcategoryId: number;
  name: string;
  description?: string;
  id: string;
}

export interface CategoryResponse {
  categoryId: number;
  name: string;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
  subcategories?: SubcategoryResponse[];
  // UI compat
  id: string;
  icon?: string;
  nameEn?: string;
  descriptionEn?: string;
}

function normalizeCategory(c: any): CategoryResponse {
  return {
    ...c,
    id: String(c.categoryId ?? c.id),
    icon: c.iconUrl || c.icon,
    nameEn: c.name,
    descriptionEn: c.description,
    subcategories: (c.subcategories || []).map((sc: any) => ({
      ...sc,
      id: String(sc.subcategoryId ?? sc.id),
    })),
  };
}

export interface CategoryListData {
  categories: CategoryResponse[];
}

// --- Admin Types ---

export interface DashboardStats {
  totalUsers: number;
  totalExperts: number;
  totalServices: number;
  pendingApprovals: {
    services: number;
    experts: number;
  };
}

// --- Auth API ---

export const authApi = {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthData>> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse<ApiResponse<AuthData>>(response);
  },

  async register(data: RegisterRequest): Promise<ApiResponse<AuthData>> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<AuthData>>(response);
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

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse>(response);
  },

  async getUserById(userId: number): Promise<ApiResponse<UserProfile>> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<ApiResponse<UserProfile>>(response);
  },
};

// --- Service API ---

export const serviceApi = {
  async list(params: ServiceListParams = {}): Promise<ApiResponse<ServiceListData>> {
    const query = new URLSearchParams();
    if (params.search) query.set('keyword', params.search);

    const queryStr = query.toString();
    let url: string;

    if (params.search) {
      url = `${API_BASE_URL}/services/search?${queryStr}`;
    } else if (params.category) {
      url = `${API_BASE_URL}/services/category/${params.category}`;
    } else if (params.subcategory) {
      url = `${API_BASE_URL}/services/subcategory/${params.subcategory}`;
    } else {
      url = `${API_BASE_URL}/services`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const res = await handleResponse<ApiResponse<any>>(response);

    // Backend returns array directly for services list
    const rawServices = Array.isArray(res.data) ? res.data : (res.data?.services || []);
    const services = rawServices.map(normalizeService);

    return {
      ...res,
      data: {
        services,
        pagination: res.data?.pagination || {
          currentPage: params.page || 1,
          totalPages: 1,
          totalItems: services.length,
          itemsPerPage: params.limit || services.length,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
    };
  },

  async getById(serviceId: string | number): Promise<ApiResponse<ServiceResponse>> {
    const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    return { ...res, data: normalizeService(res.data) };
  },

  async getMyServices(): Promise<ApiResponse<ServiceResponse[]>> {
    const response = await fetch(`${API_BASE_URL}/services/my-services`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    const raw = Array.isArray(res.data) ? res.data : [];
    return { ...res, data: raw.map(normalizeService) };
  },

  async create(data: CreateServiceRequest, thumbnail?: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: getAuthHeaders(false),
      body: formData,
    });
    return handleResponse<ApiResponse>(response);
  },

  async update(serviceId: number, data: Partial<CreateServiceRequest>, thumbnail?: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
      method: 'PUT',
      headers: getAuthHeaders(false),
      body: formData,
    });
    return handleResponse<ApiResponse>(response);
  },

  async delete(serviceId: number): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },
};

// --- Category API ---

export const categoryApi = {
  async list(): Promise<ApiResponse<CategoryResponse[]>> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    const raw = Array.isArray(res.data) ? res.data : [];
    return { ...res, data: raw.map(normalizeCategory) };
  },

  async listWithSubcategories(): Promise<ApiResponse<CategoryListData>> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    const raw = Array.isArray(res.data) ? res.data : [];
    return { ...res, data: { categories: raw.map(normalizeCategory) } };
  },

  async getByIdentifier(identifier: string): Promise<ApiResponse<CategoryResponse>> {
    const response = await fetch(`${API_BASE_URL}/categories/${identifier}`, {
      method: 'GET',
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    return { ...res, data: normalizeCategory(res.data) };
  },

  async getSubcategories(categoryId: number): Promise<ApiResponse<SubcategoryResponse[]>> {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/subcategories`, {
      method: 'GET',
    });
    return handleResponse<ApiResponse<SubcategoryResponse[]>>(response);
  },
};

// --- Admin API ---

export const adminApi = {
  async getDashboard(): Promise<ApiResponse<DashboardStats>> {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<ApiResponse<DashboardStats>>(response);
  },

  async getAllServices(): Promise<ApiResponse<ServiceResponse[]>> {
    const response = await fetch(`${API_BASE_URL}/admin/services`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    const raw = Array.isArray(res.data) ? res.data : [];
    return { ...res, data: raw.map(normalizeService) };
  },

  async getPendingServices(): Promise<ApiResponse<ServiceResponse[]>> {
    const response = await fetch(`${API_BASE_URL}/admin/services/pending`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    const raw = Array.isArray(res.data) ? res.data : [];
    return { ...res, data: raw.map(normalizeService) };
  },

  async approveService(serviceId: number, status: 'APPROVED' | 'ACTIVE' | 'INACTIVE'): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/services/${serviceId}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse<ApiResponse>(response);
  },

  async createCategory(data: { name: string; description?: string; iconUrl?: string }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse>(response);
  },

  async updateCategory(categoryId: number, data: { name?: string; description?: string; iconUrl?: string }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse>(response);
  },

  async deleteCategory(categoryId: number): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },

  async createSubcategory(categoryId: number, data: { name: string; description?: string }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}/subcategories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse>(response);
  },

  async updateSubcategory(subcategoryId: number, data: { name?: string; description?: string }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/subcategories/${subcategoryId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse>(response);
  },

  async deleteSubcategory(subcategoryId: number): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/subcategories/${subcategoryId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },
};
