import {API_BASE_URL, API_ENDPOINTS } from '../utils/apiConfig';
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
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
        credentials,
        { withCredentials: true } // Important for cookies
      );
      
      // No longer storing token in localStorage
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
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
        credentials,
        { withCredentials: true } // Important for cookies
      );      
      
      // No longer storing token in localStorage
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }

  /**
   * Logout the current user
   * @param token Access token from memory state
   */
  async logout(token: string | null): Promise<AuthResponse> {
    try {
      console.log('Gọi API đăng xuất:', `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`);
      
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`,
        {}, // Empty body
        {
          headers: token ? {
            Authorization: `Bearer ${token}`
          } : {},
          withCredentials: true // Important for sending refresh token cookie
        }
      );
      
      console.log('Đăng xuất thành công từ server');
      
      // No need to remove from localStorage, token is now in memory
      return response.data;
    } catch (error: any) {
      console.error('Đăng xuất thất bại:', error.response || error);
      throw new Error(error.response?.data?.message || 'Đăng xuất thất bại');
    }
  }

  /**
   * Get current user profile
   * @param token Access token from memory state
   */
  async getProfile(token?: string | null): Promise<ProfileResponse> {
    try {
      const response = await axios.get<ProfileResponse>(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.PROFILE}`,
        {
          headers: token ? {
            Authorization: `Bearer ${token}`
          } : {},
          withCredentials: true // Send cookies for possible refresh
        }
      );
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Không thể tải thông tin người dùng');
    }
  }

  /**
   * Refresh the access token using refresh token cookie
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      console.log('Đang gọi API refresh token...');
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        {}, // Empty body
        { 
          withCredentials: true, // Important: Ensure refreshToken cookie is sent
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Phản hồi API refresh token:', response.data);
      
      // No longer storing token in localStorage
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi làm mới token:', error.response || error);
      throw new Error(error.response?.data?.message || 'Làm mới token thất bại');
    }
  }
}

export const authService = new AuthService();