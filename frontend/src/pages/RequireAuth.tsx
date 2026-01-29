import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);
  return <>{children}</>;
}
