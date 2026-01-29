import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

export function useUser(): User | null {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        id: payload.userId || payload.id,
        name: payload.name || '',
        email: payload.email || '',
        role: payload.role || 'EMPLOYEE',
      });
    } catch {
      setUser(null);
    }
  }, []);
  return user;
}
