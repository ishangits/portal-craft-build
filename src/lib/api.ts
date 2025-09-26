const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.com/api' 
  : 'http://localhost:5000/api';

// Auth token management
let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('auth_token', token);
};

export const getAuthToken = () => {
  if (!authToken) {
    authToken = localStorage.getItem('auth_token');
  }
  return authToken;
};

export const removeAuthToken = () => {
  authToken = null;
  localStorage.removeItem('auth_token');
};

// API utility function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: (email: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (userData: {
    email: string;
    password: string;
    role: string;
    name: string;
    vendorId?: string;
  }) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  logout: () =>
    apiRequest('/auth/logout', { method: 'POST' }),
  
  verify: () =>
    apiRequest('/auth/verify'),
};

// Dashboard API
export const dashboardAPI = {
  getStats: (role: string) =>
    apiRequest(`/dashboard/stats/${role}`),
  
  getActivities: () =>
    apiRequest('/dashboard/activities'),
  
  getEmployeeActivity: () =>
    apiRequest('/dashboard/employee-activity'),
  
  getVendorSummary: () =>
    apiRequest('/dashboard/vendor-summary'),
};

// Inventory API
export const inventoryAPI = {
  getAll: (params?: {
    vendorId?: string;
    status?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.vendorId) queryParams.append('vendorId', params.vendorId);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    
    return apiRequest(`/inventory?${queryParams.toString()}`);
  },
  
  getBySKU: (sku: string) =>
    apiRequest(`/inventory/sku/${sku}`),
  
  create: (itemData: {
    sku: string;
    product: string;
    vendorId: string;
    vendorName: string;
    initialStock: number;
  }) =>
    apiRequest('/inventory', {
      method: 'POST',
      body: JSON.stringify(itemData),
    }),
  
  updateStock: (sku: string, updateData: {
    quantity: number;
    operation: 'add' | 'subtract' | 'set';
    reason: string;
  }) =>
    apiRequest(`/inventory/stock/${sku}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    }),
  
  getLowStockAlerts: () =>
    apiRequest('/inventory/alerts/low-stock'),
};

// Inbound API
export const inboundAPI = {
  getAll: (params?: {
    status?: string;
    vendorId?: string;
    date?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.vendorId) queryParams.append('vendorId', params.vendorId);
    if (params?.date) queryParams.append('date', params.date);
    
    return apiRequest(`/inbound?${queryParams.toString()}`);
  },
  
  getByAWB: (awb: string) =>
    apiRequest(`/inbound/awb/${awb}`),
  
  create: (recordData: {
    awb: string;
    vendorId: string;
    vendorName: string;
    sku: string;
    product: string;
    quantity: number;
    notes?: string;
  }) =>
    apiRequest('/inbound', {
      method: 'POST',
      body: JSON.stringify(recordData),
    }),
  
  scan: (scanData: {
    awb: string;
    scannedBy: string;
    receivedQuantity: number;
    notes?: string;
  }) =>
    apiRequest('/inbound/scan', {
      method: 'POST',
      body: JSON.stringify(scanData),
    }),
  
  getPending: () =>
    apiRequest('/inbound/pending'),
  
  getStats: () =>
    apiRequest('/inbound/stats'),
};

// Outbound API
export const outboundAPI = {
  getAll: (params?: {
    status?: string;
    vendorId?: string;
    courier?: string;
    date?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.vendorId) queryParams.append('vendorId', params.vendorId);
    if (params?.courier) queryParams.append('courier', params.courier);
    if (params?.date) queryParams.append('date', params.date);
    
    return apiRequest(`/outbound?${queryParams.toString()}`);
  },
  
  getByAWB: (awb: string) =>
    apiRequest(`/outbound/awb/${awb}`),
  
  create: (orderData: {
    awb: string;
    vendorId: string;
    vendorName: string;
    sku: string;
    product: string;
    quantity: number;
    notes?: string;
  }) =>
    apiRequest('/outbound', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  
  package: (packageData: {
    awb: string;
    packagedBy: string;
    notes?: string;
  }) =>
    apiRequest('/outbound/package', {
      method: 'POST',
      body: JSON.stringify(packageData),
    }),
  
  dispatch: (dispatchData: {
    awb: string;
    courierName: string;
    trackingNumber?: string;
  }) =>
    apiRequest('/outbound/dispatch', {
      method: 'POST',
      body: JSON.stringify(dispatchData),
    }),
  
  getCourierGroups: () =>
    apiRequest('/outbound/courier-groups'),
  
  getPOD: (awb: string) =>
    apiRequest(`/outbound/pod/${awb}`),
  
  getStats: () =>
    apiRequest('/outbound/stats'),
};

// Returns API
export const returnsAPI = {
  getAll: (params?: {
    status?: string;
    vendorId?: string;
    condition?: string;
    date?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.vendorId) queryParams.append('vendorId', params.vendorId);
    if (params?.condition) queryParams.append('condition', params.condition);
    if (params?.date) queryParams.append('date', params.date);
    
    return apiRequest(`/returns?${queryParams.toString()}`);
  },
  
  getById: (returnId: string) =>
    apiRequest(`/returns/${returnId}`),
  
  create: (returnData: {
    returnId: string;
    originalAwb: string;
    vendorId: string;
    vendorName: string;
    sku: string;
    product: string;
    quantity: number;
    reason: string;
    condition: string;
    notes?: string;
  }) =>
    apiRequest('/returns', {
      method: 'POST',
      body: JSON.stringify(returnData),
    }),
  
  scan: (scanData: {
    returnId: string;
    receivedBy: string;
    condition: string;
    restockedQuantity: number;
    notes?: string;
  }) =>
    apiRequest('/returns/scan', {
      method: 'POST',
      body: JSON.stringify(scanData),
    }),
  
  getPending: () =>
    apiRequest('/returns/pending'),
  
  getDamaged: () =>
    apiRequest('/returns/damaged'),
  
  getStats: () =>
    apiRequest('/returns/stats'),
};

// Users API
export const usersAPI = {
  getAll: (params?: {
    role?: string;
    isActive?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append('role', params.role);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    
    return apiRequest(`/users?${queryParams.toString()}`);
  },
  
  getById: (id: number) =>
    apiRequest(`/users/${id}`),
  
  update: (id: number, userData: {
    name?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
    vendorId?: string;
  }) =>
    apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  
  delete: (id: number) =>
    apiRequest(`/users/${id}`, { method: 'DELETE' }),
  
  getByRole: (role: string) =>
    apiRequest(`/users/role/${role}`),
  
  getStats: () =>
    apiRequest('/users/stats/overview'),
};

// Reports API
export const reportsAPI = {
  getDaily: (date?: string) => {
    const queryParams = new URLSearchParams();
    if (date) queryParams.append('date', date);
    
    return apiRequest(`/reports/daily?${queryParams.toString()}`);
  },
  
  getWeekly: (startDate?: string, endDate?: string) => {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    return apiRequest(`/reports/weekly?${queryParams.toString()}`);
  },
  
  getMonthly: (month?: number, year?: number) => {
    const queryParams = new URLSearchParams();
    if (month) queryParams.append('month', month.toString());
    if (year) queryParams.append('year', year.toString());
    
    return apiRequest(`/reports/monthly?${queryParams.toString()}`);
  },
  
  getVendor: (vendorId: string, startDate?: string, endDate?: string) => {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    return apiRequest(`/reports/vendor/${vendorId}?${queryParams.toString()}`);
  },
  
  getEmployee: (employeeId: string, startDate?: string, endDate?: string) => {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    return apiRequest(`/reports/employee/${employeeId}?${queryParams.toString()}`);
  },
  
  export: (exportData: {
    reportType: string;
    format?: string;
    filters?: Record<string, any>;
  }) =>
    apiRequest('/reports/export', {
      method: 'POST',
      body: JSON.stringify(exportData),
    }),
};

export default {
  auth: authAPI,
  dashboard: dashboardAPI,
  inventory: inventoryAPI,
  inbound: inboundAPI,
  outbound: outboundAPI,
  returns: returnsAPI,
  users: usersAPI,
  reports: reportsAPI,
};