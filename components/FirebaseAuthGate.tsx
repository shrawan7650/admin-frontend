// components/FirebaseAuthGate.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setUser, clearUser } from '@/redux/slices/authSlice';
import { AuthService } from '@/lib/auth';
import { useRouter } from 'next/navigation';
export default function FirebaseAuthGate({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange((user) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(clearUser());
        router.push('/login'); // 👈 Redirect if user is not authenticated
      }
      setHydrated(true);
    });
  
    const unsubscribeToken = AuthService.onIdTokenChange((user) => {
      if (!user) {
        dispatch(clearUser());
        router.push('/login'); // 👈 Redirect if token expires or is invalid
      } else {
        dispatch(setUser(user));
      }
    });
  
    return () => {
      unsubscribe();
      unsubscribeToken();
    };
  }, [dispatch, router]);
  

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-t-transparent border-primary" />
          <p className="text-sm text-muted-foreground">Loading session...</p>
        </div>
      </div>
    );
  }
  

  return <>{children}</>;
}
