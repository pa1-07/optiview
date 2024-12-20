import jwtDecode from 'jwt-decode';

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token && jwtDecode(token).exp > Date.now() / 1000;
};

export const logout = () => {
  localStorage.clear();
  window.location.href = '/';
};

export const getRole = () => localStorage.getItem('role');
