import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
// import { STORAGE_KEYS } from '../utils/apiConfig';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '../types/auth.types';
import { setAuthToken } from '../utils/axios.config';

// Default authentication state
const defaultAuthState: AuthState = {
  user: null,
  token: null, // Token stored in state/memory, not localStorage
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
  getToken: () => string | null; // Add method to access token from memory
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initial state doesn't load token from localStorage - let the loadUser function handle it
  const [state, setState] = useState<AuthState>({
    ...defaultAuthState,
    isLoading: true // Start with loading to check session/cookie
  });

  // Synchronize the token with axiosInstance whenever it changes
  useEffect(() => {
    // Update the token in axiosInstance
    setAuthToken(state.token);
  }, [state.token]);

  // Listen for token refresh events from axios interceptor
  useEffect(() => {
    const handleTokenRefresh = (event: CustomEvent) => {
      const { token } = event.detail;
      console.log('Received token refresh event, updating auth state');
      
      // Fetch user data with new token
      (async () => {
        try {
          const response = await authService.getProfile(token);
          if (response.success && response.data?.user) {
            const userData = response.data.user as User;
            setState(prev => ({
              ...prev,
              user: userData,
              token: token,
              isAuthenticated: true,
              isLoading: false,
              error: null
            }));
          }
        } catch (error) {
          console.error("Error fetching user data after token refresh:", error);
        }
      })();
    };

    // Listen for auth logout events from axios interceptor
    const handleAuthLogout = () => {
      console.log('Received auth logout event, resetting state');
      setState({
        ...defaultAuthState,
        isLoading: false
      });
    };

    // Add event listeners
    window.addEventListener('token-refreshed', handleTokenRefresh as EventListener);
    window.addEventListener('auth-logout', handleAuthLogout);

    // Cleanup
    return () => {
      window.removeEventListener('token-refreshed', handleTokenRefresh as EventListener);
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, []);

  // Check token and load user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Try to refresh token using HttpOnly cookie
        const refreshResponse = await authService.refreshToken();
        if (refreshResponse.success && refreshResponse.data?.token) {
          const newToken = refreshResponse.data.token;
          
          // Don't store token in localStorage, just keep it in memory
          console.log("Token refreshed successfully and stored in memory");
          
          // Then load user profile
          const response = await authService.getProfile(newToken);
          if (response.success && response.data?.user) {
            const userData = response.data.user as User;
            setState({
              user: userData,
              token: newToken, // Store token only in state memory
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
          } else {
            // Token exists but profile could not be retrieved
            console.warn('Profile data invalid or missing.');
            setState({
              ...defaultAuthState,
              isLoading: false,
              error: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
            });
          }
        } else {
          // No valid token from refresh attempt
          setState({
            ...defaultAuthState,
            isLoading: false
          });
        }
      } catch (error: any) {
        console.error('Error during authentication check:', error);
        setState({
          ...defaultAuthState,
          isLoading: false
        });
      }
    };

    // Always try to load user when component mounts
    loadUser();
  }, []); // Only run on mount, token is managed in state now

  // Login function
  const login = async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data?.token) {
        // Store user data from response
        const userData = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          fullName: response.data.fullName,
          role: response.data.role
        };

        setState({
          user: userData,
          token: response.data.token, // Store token in memory, not localStorage
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
        // Store user data from response
        const userData = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          fullName: response.data.fullName,
          role: response.data.role
        };

        setState({
          user: userData,
          token: response.data.token, // Store token in memory only
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
      // Access token from memory state
      await authService.logout(state.token);
      console.log('Đăng xuất thành công');
    } catch (error: any) {
      console.error('Lỗi khi đăng xuất:', error);
      // Continue with local logout even if server-side logout fails
    } finally {
      // Reset to initial state
      setState({
        ...defaultAuthState,
        isLoading: false
      });
    }
  };

  // Method to get token from memory
  const getToken = () => {
    return state.token;
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
        clearError,
        getToken // Expose method to get token from memory
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