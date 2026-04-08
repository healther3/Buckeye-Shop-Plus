'use client'

import { useSession } from 'next-auth/react';
import { can } from '@/app/lib/auth-helpers';

export function usePermissions() {
  const { data: session, status } = useSession();
  
  const hasPermission = (permission: string) => {
    if (status === 'loading') return false;
    return can(session, permission);
  };

  return {
    session,    
    hasPermission,
    isLoading: status === 'loading',
  };
}