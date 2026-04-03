import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(isAuthenticated ? '/dashboard' : '/login');
  }, [isAuthenticated, navigate]);

  return null;
}
