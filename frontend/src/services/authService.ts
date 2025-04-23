import {API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from '../utils/apiConfig';
import { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials, 
  ProfileResponse 
} from '../types/auth.types';
import axios from 'axios';

/**
 * Service for handling authentication-related API calls
 */
class AuthService {
  /**
   * Register a new user
   * @param credentials User registration data
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        credentials,
        { withCredentials: true } // Important for cookies
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    }
  }

  /**
   * Login with username/email and password
   * @param credentials Login credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, // Ghép thủ công API_BASE_URL với endpoint
        credentials,
        { withCredentials: true } // Quan trọng để gửi cookie
      );      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<AuthResponse> {
    try {
      const token = this.getToken();
      
      console.log('Gọi API đăng xuất:', `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`);
      
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`,
        {}, // Empty body
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      
      console.log('Đăng xuất thành công từ server');
      
      // Xóa token và thông tin người dùng
      this.removeToken();
      localStorage.removeItem(STORAGE_KEYS.USER);
      
      // Xóa các cookie liên quan đến xác thực
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Đăng xuất thất bại:', error.response || error);
      // Vẫn xóa token và thông tin người dùng ngay cả khi API thất bại
      this.removeToken();
      localStorage.removeItem(STORAGE_KEYS.USER);
      throw new Error(error.response?.data?.message || 'Đăng xuất thất bại');
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ProfileResponse> {
    try {
      const token = this.getToken();
      
      const response = await axios.get<ProfileResponse>(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.PROFILE}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể tải thông tin người dùng');
    }
  }

  /**
   * Refresh the access token using refresh token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      console.log('Đang gọi API refresh token...');
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        {}, // Empty body
        { 
          withCredentials: true, // Quan trọng: Đảm bảo cookie refreshToken được gửi
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Phản hồi API refresh token:', response.data);
      
      if (response.data.success && response.data.data?.token) {
        this.setToken(response.data.data.token);
        console.log('Đã lưu token mới vào localStorage');
      }
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi làm mới token:', error.response || error);
      throw new Error(error.response?.data?.message || 'Làm mới token thất bại');
    }
  }

  /**
   * Store token in localStorage
   */
  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Remove token from localStorage
   */
  removeToken(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();