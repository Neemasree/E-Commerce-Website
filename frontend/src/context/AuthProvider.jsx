import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { login as apiLogin, register as apiRegister } from '../services/api';

function readStoredUser() {
  try {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) return null;
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) throw new Error('Invalid stored token');
    const encodedPayload = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(encodedPayload.padEnd(Math.ceil(encodedPayload.length / 4) * 4, '=')));
    if (!Number.isFinite(payload.exp) || payload.exp * 1000 <= Date.now()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
    return JSON.parse(userData);
  } catch {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch {
      // Browser storage may be disabled; the app can still render as signed out.
    }
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    const handleExpiredSession = () => setUser(null);
    window.addEventListener('auth:expired', handleExpiredSession);
    return () => window.removeEventListener('auth:expired', handleExpiredSession);
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await apiRegister(name, email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};
