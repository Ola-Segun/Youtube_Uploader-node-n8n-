import React, { useEffect } from 'react';
import { Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token, login } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      login(tokenParam);
      // Remove token from URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('token');
      navigate({ search: newSearchParams.toString() }, { replace: true });
    }
  }, [searchParams, login, navigate]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;