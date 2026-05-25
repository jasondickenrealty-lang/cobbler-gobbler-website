'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const isActiveEmployee = userData?.active !== false && userData?.isActive !== false;

  useEffect(() => {
    if (!loading && (!user || !userData || !isActiveEmployee)) {
      router.push('/employee/login');
    }
  }, [user, userData, isActiveEmployee, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user || !userData || !isActiveEmployee) {
    return null;
  }

  return <>{children}</>;
}
