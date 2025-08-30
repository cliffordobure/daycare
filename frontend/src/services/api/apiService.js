import axios from "axios";

// Create axios instance
const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    
    // Handle other errors
    if (error.response?.status === 403) {
      console.error("Access denied:", error.response.data);
    }
    
    if (error.response?.status === 500) {
      console.error("Server error:", error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (credentials) => apiService.post("/auth/login", credentials),
  register: (userData) => apiService.post("/auth/register", userData),
  logout: () => apiService.post("/auth/logout"),
  refreshToken: (refreshToken) => apiService.post("/auth/refresh-token", { refreshToken }),
  forgotPassword: (email) => apiService.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => apiService.post(`/auth/reset-password/${token}`, { password }),
  changePassword: (passwords) => apiService.post("/auth/change-password", passwords),
  getProfile: () => apiService.get("/auth/me"),
};

export const centerAPI = {
  getDetails: (centerId) => apiService.get(`/centers/${centerId}`),
  update: (centerId, updateData) => apiService.put(`/centers/${centerId}`, updateData),
  getUsers: (centerId, params) => apiService.get(`/centers/${centerId}/users`, { params }),
  createUser: (centerId, userData) => apiService.post(`/centers/${centerId}/users`, userData),
};

export const userAPI = {
  getAll: (params) => apiService.get("/users", { params }),
  getById: (userId) => apiService.get(`/users/${userId}`),
  update: (userId, updateData) => apiService.put(`/users/${userId}`, updateData),
  delete: (userId) => apiService.delete(`/users/${userId}`),
  updateProfile: (updateData) => apiService.put("/users/profile", updateData),
};

export const childAPI = {
  getAll: (params) => apiService.get("/children", { params }),
  getById: (childId) => apiService.get(`/children/${childId}`),
  create: (childData) => apiService.post("/children", childData),
  update: (childId, updateData) => apiService.put(`/children/${childId}`, updateData),
  delete: (childId) => apiService.delete(`/children/${childId}`),
  getStats: (params) => apiService.get("/children/stats/summary", { params }),
};

export const classAPI = {
  getAll: (params) => apiService.get("/classes", { params }),
  getById: (classId) => apiService.get(`/classes/${classId}`),
  create: (classData) => apiService.post("/classes", classData),
  update: (classId, updateData) => apiService.put(`/classes/${classId}`, updateData),
  delete: (classId) => apiService.delete(`/classes/${classId}`),
  getStats: (params) => apiService.get("/classes/stats/summary", { params }),
};

export const attendanceAPI = {
  getAll: (params) => apiService.get("/attendance", { params }),
  getById: (attendanceId) => apiService.get(`/attendance/${attendanceId}`),
  create: (attendanceData) => apiService.post("/attendance", attendanceData),
  update: (attendanceId, updateData) => apiService.put(`/attendance/${attendanceId}`, updateData),
  delete: (attendanceId) => apiService.delete(`/attendance/${attendanceId}`),
  bulkCreate: (attendanceData) => apiService.post("/attendance/bulk", attendanceData),
};

export const activityAPI = {
  getAll: (params) => apiService.get("/activities", { params }),
  getById: (activityId) => apiService.get(`/activities/${activityId}`),
  create: (activityData) => apiService.post("/activities", activityData),
  update: (activityId, updateData) => apiService.put(`/activities/${activityId}`, updateData),
  delete: (activityId) => apiService.delete(`/activities/${activityId}`),
};

export const paymentAPI = {
  getAll: (params) => apiService.get("/payments", { params }),
  getById: (paymentId) => apiService.get(`/payments/${paymentId}`),
  create: (paymentData) => apiService.post("/payments", paymentData),
  update: (paymentId, updateData) => apiService.put(`/payments/${paymentId}`, updateData),
  delete: (paymentId) => apiService.delete(`/payments/${paymentId}`),
  processPayment: (paymentId) => apiService.post(`/payments/${paymentId}/process`),
};

export const communicationAPI = {
  getAll: (params) => apiService.get("/communication", { params }),
  getById: (messageId) => apiService.get(`/communication/${messageId}`),
  send: (messageData) => apiService.post("/communication", messageData),
  update: (messageId, updateData) => apiService.put(`/communication/${messageId}`, updateData),
  delete: (messageId) => apiService.delete(`/communication/${messageId}`),
  markAsRead: (messageId) => apiService.put(`/communication/${messageId}/read`),
};

export const healthAPI = {
  getAll: (params) => apiService.get("/health", { params }),
  getById: (healthId) => apiService.get(`/health/${healthId}`),
  create: (healthData) => apiService.post("/health", healthData),
  update: (healthId, updateData) => apiService.put(`/health/${healthId}`, updateData),
  delete: (healthId) => apiService.delete(`/health/${healthId}`),
};

export const reportAPI = {
  getAll: (params) => apiService.get("/reports", { params }),
  getById: (reportId) => apiService.get(`/reports/${reportId}`),
  generate: (reportType, params) => apiService.post(`/reports/${reportType}`, params),
  export: (reportId, format) => apiService.get(`/reports/${reportId}/export`, { 
    params: { format },
    responseType: 'blob'
  }),
};

// Export the main apiService instance
export { apiService };

// Export default for backward compatibility
export default apiService;
