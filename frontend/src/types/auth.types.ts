/**
 * Loại dữ liệu cho thông tin người dùng
 */
export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  role: string;
}

/**
 * Thông tin đăng nhập
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Thông tin đăng ký
 */
export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

/**
 * Phản hồi xác thực từ API
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    username: string;
    email: string;
    fullName?: string;
    role: string;
    token: string;
  };
}

/**
 * Phản hồi lấy thông tin profile từ API
 */
export interface ProfileResponse {
  success: boolean;
  data?: {
    user: User;
    customerProfile?: any;
  };
}

/**
 * Trạng thái xác thực trong Context
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}