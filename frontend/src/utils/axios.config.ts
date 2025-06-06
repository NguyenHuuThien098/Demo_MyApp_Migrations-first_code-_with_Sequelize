import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './apiConfig';

// Tạo một instance Axios với các cài đặt mặc định
const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Đảm bảo cookies được gửi với mọi request
});

// Token used for authenticated requests - stored in memory
let inMemoryToken: string | null = null;

// Function to set the token from outside (typically from AuthContext)
export const setAuthToken = (token: string | null) => {
  inMemoryToken = token;
  console.log('Auth token updated in axios instance');
};

// Thêm interceptor cho request để tự động gắn token xác thực
axiosInstance.interceptors.request.use(
  (config) => {
    // Use token from memory instead of localStorage
    if (inMemoryToken) {
      config.headers.Authorization = `Bearer ${inMemoryToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor xử lý response để bắt lỗi 401 và làm mới token nếu cần
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Nếu là lỗi 401 (Unauthorized) và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log("Đang thử làm mới token sau lỗi 401...");
        
        // Gọi API refresh token với withCredentials để gửi cookie
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, 
          {}, 
          { 
            withCredentials: true, // Quan trọng để đảm bảo gửi cookie refreshToken
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.success && response.data.data?.token) {
          const newToken = response.data.data.token;
          console.log("Token đã được làm mới thành công!");
          
          // Update the in-memory token
          setAuthToken(newToken);
          
          // Trigger an auth state update event
          const tokenRefreshEvent = new CustomEvent('token-refreshed', { 
            detail: { token: newToken }
          });
          window.dispatchEvent(tokenRefreshEvent);
          
          // Cập nhật token trong header và thử lại request ban đầu
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        } else {
          console.log("Server trả về thành công nhưng không có token mới");
        }
      } catch (refreshError) {
        console.error('Không thể làm mới token:', refreshError);
        
        // Xem phản hồi từ server nếu có
        if (axios.isAxiosError(refreshError) && refreshError.response) {
          console.error('Chi tiết lỗi từ server:', refreshError.response.data);
        }
        
        // Clear the in-memory token
        setAuthToken(null);
        
        // Trigger an auth state update event for logout
        const logoutEvent = new CustomEvent('auth-logout');
        window.dispatchEvent(logoutEvent);
        
        // Chuyển hướng người dùng đến trang đăng nhập
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;