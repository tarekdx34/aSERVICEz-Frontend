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
    id: s.id ?? s.serviceId,
    title: s.title ?? s.serviceName ?? '',
    deliveryTime: s.deliveryTime ?? s.duration,
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
  slug?: string;
  id: string;
}

export interface CategoryResponse {
  categoryId: number;
  name: string;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
  subcategories?: SubcategoryResponse[];
  slug?: string;
  // UI compat
  id: string;
  icon?: string;
  nameEn?: string;
  descriptionEn?: string;
}

function normalizeCategory(c: any): CategoryResponse {
  return {
    ...c,
    categoryId: Number(c.id ?? c.categoryId),
    id: String(c.id ?? c.categoryId),
    icon: c.icon || c.iconUrl,
    iconUrl: c.icon || c.iconUrl,
    nameEn: c.name,
    descriptionEn: c.description,
    subcategories: (c.subcategories || []).map((sc: any) => ({
      ...sc,
      subcategoryId: Number(sc.id ?? sc.subcategoryId),
      id: String(sc.id ?? sc.subcategoryId),
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
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('size', String(params.limit));

    let url: string;

    if (params.search) {
      url = `${API_BASE_URL}/services/search?${query.toString()}`;
    } else if (params.subcategory) {
      url = `${API_BASE_URL}/services/subcategory/${params.subcategory}`;
      if (params.page) url += `?page=${params.page}`;
    } else if (params.category) {
      url = `${API_BASE_URL}/services/category/${params.category}`;
      if (params.page) url += `?page=${params.page}`;
    } else {
      url = `${API_BASE_URL}/services?${query.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const res = await handleResponse<ApiResponse<any>>(response);

    // Backend returns { data: { services: [...], pagination: {...} } } or { data: [...] }
    const rawServices = Array.isArray(res.data) ? res.data : (res.data?.services || []);
    const services = rawServices.map(normalizeService);
    const apiPagination = res.data?.pagination;

    return {
      ...res,
      data: {
        services,
        pagination: apiPagination || {
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
    const raw = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.services) ? res.data.services : [];
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
    // API returns { data: { categories: [...] } }
    const raw = Array.isArray(res.data) ? res.data : (res.data?.categories || []);
    return { ...res, data: raw.map(normalizeCategory) };
  },

  async listWithSubcategories(): Promise<ApiResponse<CategoryListData>> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    const raw = Array.isArray(res.data) ? res.data : (res.data?.categories || []);
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
    const raw = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.services) ? res.data.services : [];
    return { ...res, data: raw.map(normalizeService) };
  },

  async getPendingServices(): Promise<ApiResponse<ServiceResponse[]>> {
    const response = await fetch(`${API_BASE_URL}/admin/services/pending`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    const raw = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.services) ? res.data.services : [];
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
    const response = await fetch(`${API_BASE_URL}/admin/categories/subcategories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...data, categoryId }),
    });
    return handleResponse<ApiResponse>(response);
  },

  async updateSubcategory(subcategoryId: number, data: { name?: string; description?: string }): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/categories/subcategories/${subcategoryId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse>(response);
  },

  async deleteSubcategory(subcategoryId: number): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/categories/subcategories/${subcategoryId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },
};

// --- Order Types ---

export interface OrderExpert {
  id: string;
  name: string;
  avatar?: string;
  rating?: number;
}

export interface OrderCustomer {
  id: string;
  name: string;
  avatar?: string;
}

export interface OrderResponse {
  id: string;
  serviceTitle: string;
  thumbnail?: string;
  price: number;
  status: string;
  orderDate: string;
  deliveryDate?: string;
  daysRemaining?: number;
  requirements?: string;
  expert?: OrderExpert;
  customer?: OrderCustomer;
  completedDate?: string;
  deliveryMessage?: string;
  declineReason?: string;
  cancelReason?: string;
  revisionReason?: string;
  revisionDetails?: string;
  extensionReason?: string;
}

export interface OrderListData {
  orders: OrderResponse[];
  pagination: PaginationResponse;
  counts?: {
    all: number;
    pending: number;
    inProgress: number;
    delivered: number;
    completed: number;
    cancelled: number;
    dispute?: number;
    active: number;
  };
}

export interface OrderRequest {
  serviceId: number;
  requirements?: string;
  deliveryDeadline?: string;
}

export interface OrderCancelRequest {
  reason: string;
}

export interface OrderDeclineRequest {
  reason: string;
}

export interface OrderRevisionRequest {
  reason: string;
  details?: string;
}

export interface OrderExtendRequest {
  additionalDays: number;
  reason?: string;
}

export interface OrderStatusUpdateRequest {
  status: string;
}

// Helper to normalize order from backend
function normalizeOrder(o: any): OrderResponse {
  return {
    id: String(o.id ?? o.orderId),
    serviceTitle: o.serviceTitle || o.service?.title || o.service?.serviceName || '',
    thumbnail: o.thumbnail || o.service?.thumbnail ? 
      ((o.thumbnail || o.service?.thumbnail).startsWith('http') 
        ? (o.thumbnail || o.service?.thumbnail) 
        : `${API_BASE_URL.replace('/api', '')}${o.thumbnail || o.service?.thumbnail}`) 
      : undefined,
    price: o.price ?? o.totalAmount ?? 0,
    status: o.status?.toLowerCase() || o.orderStatus?.toLowerCase() || 'pending',
    orderDate: o.orderDate || '',
    deliveryDate: o.deliveryDate || o.deliveryDeadline || undefined,
    daysRemaining: o.daysRemaining,
    requirements: o.requirements,
    expert: o.expert ? {
      id: String(o.expert.id || o.expert.expertId || ''),
      name: o.expert.name || '',
      avatar: o.expert.avatar,
      rating: o.expert.rating,
    } : undefined,
    customer: o.customer ? {
      id: String(o.customer.id || o.customer.customerId || ''),
      name: o.customer.name || '',
      avatar: o.customer.avatar,
    } : undefined,
    completedDate: o.completedDate,
    deliveryMessage: o.deliveryMessage,
    declineReason: o.declineReason,
    cancelReason: o.cancelReason,
    revisionReason: o.revisionReason,
    revisionDetails: o.revisionDetails,
    extensionReason: o.extensionReason,
  };
}

// Helper to extract numeric order ID from "ORD-123" format
function getNumericOrderId(orderId: string): string {
  // Strip "ORD-" prefix if present
  return orderId.replace(/^ORD-/i, '');
}

// --- Order API ---

export const orderApi = {
  // Place a new order (CUSTOMER only)
  async placeOrder(data: OrderRequest): Promise<ApiResponse<{ orderId: string }>> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<{ orderId: string }>>(response);
  },

  // Get order by ID
  async getById(orderId: string): Promise<ApiResponse<OrderResponse>> {
    const numericId = getNumericOrderId(orderId);
    const response = await fetch(`${API_BASE_URL}/orders/${numericId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    return { ...res, data: normalizeOrder(res.data) };
  },

  // Get my orders (CUSTOMER)
  async getMyOrders(params: { status?: string; page?: number; limit?: number } = {}): Promise<ApiResponse<OrderListData>> {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'all') query.set('status', params.status);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    const url = `${API_BASE_URL}/orders/my-orders${query.toString() ? '?' + query.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    const rawOrders = Array.isArray(res.data) ? res.data : (res.data?.orders || []);
    const orders = rawOrders.map(normalizeOrder);

    return {
      ...res,
      data: {
        orders,
        pagination: res.data?.pagination || {
          currentPage: params.page || 1,
          totalPages: 1,
          totalItems: orders.length,
          itemsPerPage: params.limit || orders.length,
          hasNextPage: false,
          hasPrevPage: false,
        },
        counts: res.data?.counts,
      },
    };
  },

  // Get expert orders (EXPERT)
  async getExpertOrders(params: { status?: string; page?: number; limit?: number } = {}): Promise<ApiResponse<OrderListData>> {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'all') query.set('status', params.status);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    const url = `${API_BASE_URL}/orders/expert-orders${query.toString() ? '?' + query.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    const rawOrders = Array.isArray(res.data) ? res.data : (res.data?.orders || []);
    const orders = rawOrders.map(normalizeOrder);

    return {
      ...res,
      data: {
        orders,
        pagination: res.data?.pagination || {
          currentPage: params.page || 1,
          totalPages: 1,
          totalItems: orders.length,
          itemsPerPage: params.limit || orders.length,
          hasNextPage: false,
          hasPrevPage: false,
        },
        counts: res.data?.counts,
      },
    };
  },

  // Accept order (EXPERT)
  async acceptOrder(orderId: string): Promise<ApiResponse<OrderResponse>> {
    const numericId = getNumericOrderId(orderId);
    const response = await fetch(`${API_BASE_URL}/orders/${numericId}/accept`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    return { ...res, data: normalizeOrder(res.data) };
  },

  // Decline order (EXPERT)
  async declineOrder(orderId: string, data: OrderDeclineRequest): Promise<ApiResponse<OrderResponse>> {
    const numericId = getNumericOrderId(orderId);
    const response = await fetch(`${API_BASE_URL}/orders/${numericId}/decline`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    return { ...res, data: normalizeOrder(res.data) };
  },

  // Deliver order (EXPERT)
  async deliverOrder(orderId: string, message: string, files?: File[]): Promise<ApiResponse<OrderResponse>> {
    const numericId = getNumericOrderId(orderId);
    const formData = new FormData();
    formData.append('message', message);
    if (files && files.length > 0) {
      files.forEach(file => formData.append('files', file));
    }

    const response = await fetch(`${API_BASE_URL}/orders/${numericId}/deliver`, {
      method: 'POST',
      headers: getAuthHeaders(false),
      body: formData,
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    return { ...res, data: normalizeOrder(res.data) };
  },

  // Accept delivery (CUSTOMER)
  async acceptDelivery(orderId: string): Promise<ApiResponse<OrderResponse>> {
    const numericId = getNumericOrderId(orderId);
    const response = await fetch(`${API_BASE_URL}/orders/${numericId}/accept-delivery`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    return { ...res, data: normalizeOrder(res.data) };
  },

  // Request revision (CUSTOMER)
  async requestRevision(orderId: string, data: OrderRevisionRequest): Promise<ApiResponse<OrderResponse>> {
    const numericId = getNumericOrderId(orderId);
    const response = await fetch(`${API_BASE_URL}/orders/${numericId}/revision`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    return { ...res, data: normalizeOrder(res.data) };
  },

  // Cancel order
  async cancelOrder(orderId: string, data: OrderCancelRequest): Promise<ApiResponse<OrderResponse>> {
    const numericId = getNumericOrderId(orderId);
    const response = await fetch(`${API_BASE_URL}/orders/${numericId}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    return { ...res, data: normalizeOrder(res.data) };
  },

  // Extend delivery time
  async extendDelivery(orderId: string, data: OrderExtendRequest): Promise<ApiResponse<OrderResponse>> {
    const numericId = getNumericOrderId(orderId);
    const response = await fetch(`${API_BASE_URL}/orders/${numericId}/extend`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    return { ...res, data: normalizeOrder(res.data) };
  },

  // Update order status
  async updateStatus(orderId: string, data: OrderStatusUpdateRequest): Promise<ApiResponse<OrderResponse>> {
    const numericId = getNumericOrderId(orderId);
    const response = await fetch(`${API_BASE_URL}/orders/${numericId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    return { ...res, data: normalizeOrder(res.data) };
  },
};

// --- Notification Types ---

export interface NotificationResponse {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListData {
  notifications: NotificationResponse[];
  unreadCount: number;
  pagination: PaginationResponse;
}

// Helper to normalize notification
function normalizeNotification(n: any): NotificationResponse {
  return {
    id: n.id ?? n.notificationId,
    type: n.type || 'GENERAL',
    title: n.title || '',
    message: n.message || '',
    isRead: n.isRead ?? n.read ?? (n.status === 'READ'),
    createdAt: n.createdAt || new Date().toISOString(),
  };
}

// --- Notification API ---

export const notificationApi = {
  // Get notifications
  async getAll(params: { filter?: string; page?: number; limit?: number } = {}): Promise<ApiResponse<NotificationListData>> {
    const query = new URLSearchParams();
    if (params.filter) query.set('filter', params.filter);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    const url = `${API_BASE_URL}/notifications${query.toString() ? '?' + query.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const res = await handleResponse<ApiResponse<any>>(response);
    const rawNotifications = Array.isArray(res.data) ? res.data : (res.data?.notifications || []);
    const notifications = rawNotifications.map(normalizeNotification);

    return {
      ...res,
      data: {
        notifications,
        unreadCount: res.data?.unreadCount ?? notifications.filter(n => !n.isRead).length,
        pagination: res.data?.pagination || {
          currentPage: params.page || 1,
          totalPages: 1,
          totalItems: notifications.length,
          itemsPerPage: params.limit || notifications.length,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
    };
  },

  // Mark notification as read
  async markAsRead(notificationId: number): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },

  // Mark all as read
  async markAllAsRead(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },

  // Delete notification
  async delete(notificationId: number): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },

  // Clear all notifications
  async clearAll(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },
};
