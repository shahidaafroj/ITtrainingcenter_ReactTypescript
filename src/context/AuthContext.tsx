import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  token: string | null;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  
  // Initialize navigate function
  let navigate = (p0: string) => {};
  
  // We'll set the actual navigate function after the router is available
  const setNavigate = (navigateFn: any) => {
    navigate = navigateFn;
  };

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(config => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

const login = async (username: string, password: string) => {
  try {
    const response = await axios.post('http://localhost:5281/api/Auth/login', { // Correct endpoint
      username: username.toLowerCase(), // Match backend case handling
      password
    });

    const { token } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setToken(token);
    setUsername(username);
    
    // Set authorization header for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    navigate('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};



const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    navigate('/');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, username, login, logout, isAuthenticated }}>
      {children}
      <SetNavigate setNavigate={setNavigate} />
    </AuthContext.Provider>
  );
};

// Helper component to get the navigate function
const SetNavigate = ({ setNavigate }: { setNavigate: (navigate: any) => void }) => {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate, setNavigate]);
  return null;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};