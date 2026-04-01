import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (token && storedUser) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(JSON.parse(storedUser)); // 🔥 LOAD USER FROM STORAGE
    setLoading(false);
  } else {
    setLoading(false);
  }
}, []);

 const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });

  localStorage.setItem('token', res.data.token);
  localStorage.setItem('user', JSON.stringify(res.data.user)); // 🔥 ADD THIS

  api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
  setUser(res.data.user);

  return res.data;
};
  

 const register = async (name, email, password) => {
  const res = await api.post('/auth/register', { name, email, password });

  localStorage.setItem('token', res.data.token);
  localStorage.setItem('user', JSON.stringify(res.data.user)); // 🔥 ADD THIS

  api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
  setUser(res.data.user);

  return res.data;
};

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateUser = (updatedUser) => setUser(prev => ({ ...prev, ...updatedUser }));

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
