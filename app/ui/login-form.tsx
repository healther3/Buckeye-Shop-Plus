'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/app/ui/Button';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/categories';
  
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  const inputStyles = "peer block w-full rounded-md border border-gray-200 py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500";
  const labelStyles = "mb-2 block text-xs font-medium text-gray-900";

  return (
    <form action={formAction} className="space-y-4">
      <div className="w-full">
        
     
        <h1 className="mb-6 text-xl font-bold text-gray-900 text-center">
          Please log in to continue
        </h1>

        <div className="mb-4">
          <label className={labelStyles} htmlFor="identifier">
            Email / Username
          </label>
          <div className="relative">
            <input
              className={inputStyles}
              id="identifier"
              type="text"
              name="identifier"
              placeholder="Enter your email or username"
              required
            />
          </div>
        </div>

 
        <div className="mb-4">
          <label className={labelStyles} htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              className={inputStyles}
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              required
              minLength={6}
            />
          </div>
        </div>

        
        <input type="hidden" name="redirectTo" value={callbackUrl} />
   
        <div className="mt-6">
            <Button 
              aria-disabled={isPending} 
              className="w-full flex justify-center items-center h-10 rounded-lg bg-red-700 text-white hover:bg-red-600 font-bold shadow-md transition-colors"
            >
                {isPending ? 'Logging in...' : 'Log in'}
            </Button>
        </div>


        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <p className="text-sm text-red-500 font-medium">⚠️ {errorMessage}</p>
          )}
        </div>
      </div>
    </form>
  );
}