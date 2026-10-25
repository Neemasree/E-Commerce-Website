import { createContext, useState } from 'react';
export const AuthContext = createContext(null);
import { login as apiLogin, register as apiRegister } from '../services/api';

function readStoredUser() {
  try {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    return token && userData ? JSON.parse(userData) : null;
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);

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

