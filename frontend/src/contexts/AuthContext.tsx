import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { STORAGE_KEYS } from '../utils/apiConfig';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '../types/auth.types';

// Default authentication state
const defaultAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Context interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    ...defaultAuthState,
    token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
    isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  });

  // Check token and load user data
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          // Thử refresh token trước khi tải thông tin người dùng
          try {
            const refreshResponse = await authService.refreshToken();
            if (refreshResponse.success && refreshResponse.data?.token) {
              const newToken = refreshResponse.data.token;
              authService.setToken(newToken);
              setState(prev => ({
                ...prev,
                token: newToken, // Đảm bảo đây là string, không phải undefined
              }));
              console.log("Token refreshed successfully");
            }
          } catch (refreshError) {
            console.warn("Error refreshing token:", refreshError);
            // Tiếp tục với token hiện tại nếu không thể làm mới
          }

          // Sau đó tải thông tin người dùng
          const response = await authService.getProfile();
          if (response.success && response.data?.user) {
            const userData = response.data.user as User; // Type assertion để đảm bảo không phải undefined
            setState(prev => ({
              ...prev,
              user: userData,
              isAuthenticated: true,
              isLoading: false
            }));
          } else {
            // Token exists but profile could not be retrieved
            console.warn('Profile data invalid or missing. Logging out.');
            authService.removeToken();
            setState({
              ...defaultAuthState,
              isLoading: false,
              error: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
            });
          }
        } catch (error: any) {
          console.error('Error loading user profile:', error);
          // Clear token and reset state on API error
          authService.removeToken();
          setState({
            ...defaultAuthState,
            isLoading: false,
            error: 'Xác thực thất bại. Vui lòng đăng nhập lại.'
          });
        }
      } else {
        // No token found, just update loading state
        setState(prev => ({
          ...prev,
          isAuthenticated: false,
          user: null,
          isLoading: false
        }));
      }
    };

    if (state.token) {
      loadUser();
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.token, state.isLoading]);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data?.token) {
        // Lưu user data từ response
        const userData = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          fullName: response.data.fullName,
          role: response.data.role
        };

        setState({
          user: userData,
          token: response.data.token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        throw new Error('Định dạng phản hồi đăng nhập không hợp lệ');
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.'
      }));
      throw error;
    }
  };

  // Register function
  const register = async (credentials: RegisterCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.register(credentials);
      if (response.success && response.data?.token) {
        // Lưu user data từ response
        const userData = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          fullName: response.data.fullName,
          role: response.data.role
        };

        setState({
          user: userData,
          token: response.data.token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        throw new Error('Định dạng phản hồi đăng ký không hợp lệ');
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Đăng ký thất bại. Vui lòng thử lại.'
      }));
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await authService.logout();
      console.log('Đăng xuất thành công');
    } catch (error: any) {
      console.error('Lỗi khi đăng xuất:', error);
      // Tiếp tục với local logout ngay cả khi server-side logout thất bại
    } finally {
      // Đảm bảo xóa token và thông tin người dùng
      authService.removeToken();
      localStorage.removeItem(STORAGE_KEYS.USER);
      
      // Đặt lại trạng thái
      setState({
        ...defaultAuthState,
        isLoading: false
      });
    }
  };

  // Clear error
  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};