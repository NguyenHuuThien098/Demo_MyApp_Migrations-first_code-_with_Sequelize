import axios from 'axios';
import { STORAGE_KEYS } from './apiConfig';

// Tạo một instance Axios với các cài đặt mặc định
const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Thêm interceptor cho request để tự động gắn token xác thực
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    // Nếu token tồn tại, thêm vào header của mọi request
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
        // TODO: Thêm logic refresh token ở đây
        // Ví dụ:
        // const response = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        // const newToken = response.data.token;
        // localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
        // originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // return axios(originalRequest);
      } catch (refreshError) {
        // Nếu không thể làm mới token, xóa token hiện tại và đăng xuất
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        // Có thể chuyển hướng người dùng đến trang đăng nhập
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;