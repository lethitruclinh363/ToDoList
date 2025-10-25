import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({  children }) => {
  const isLoggedIn = !!localStorage.getItem("token"); // token lưu khi login
  return isLoggedIn ? children : <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;