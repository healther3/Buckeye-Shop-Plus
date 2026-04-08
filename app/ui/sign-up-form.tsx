'use client'
import { createUser, UserState } from '@/app/lib/actions'
import { useActionState } from "react";
import Link from 'next/link';
import { Button } from '@/app/ui/Button';

export default function SignUpForm() {
    const initialState: UserState = { message: "", errors: {} };
    const [state, formAction, isPending] = useActionState(createUser, initialState);


    const inputStyles = "block w-full rounded-md border border-gray-200 py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500";

    const labelStyles = "mb-2 block text-xs font-medium text-gray-900";

    return (
        <form action={formAction} className="space-y-4">
            
            {/* Name Field */}
            <div>
                <label htmlFor="name" className={labelStyles}>Name</label>
                <div className="relative">
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        placeholder="Enter your name"
                        className={inputStyles} 
                    />
                </div>
                <div id="name-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.name &&
                        state.errors.name.map((error: string) => (
                            <p key={error} className="mt-2 text-sm text-red-500">
                                ⚠️ {error}
                            </p>
                        ))}
                </div>
            </div>

            {/* Email Field */}
            <div>
                <label htmlFor="email" className={labelStyles}>Email</label>
                <div className="relative">
                    <input 
                        type="text" 
                        id="email" 
                        name="email" 
                        placeholder="Enter your email"
                        className={inputStyles} 
                    />
                </div>
                <div id="email-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.email &&
                        state.errors.email.map((error: string) => (
                            <p key={error} className="mt-2 text-sm text-red-500">
                                ⚠️ {error}
                            </p>
                        ))}
                </div>
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="password" className={labelStyles}>Password</label>
                <div className="relative">
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="Create a password"
                        className={inputStyles} 
                    />
                </div>
                <div id="password-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.password &&
                        state.errors.password.map((error: string) => (
                            <p key={error} className="mt-2 text-sm text-red-500">
                                ⚠️ {error}
                            </p>
                        ))}
                </div>
            </div>

            {/* General Error Message */}
            {state.message && (
                 <p className="mt-2 text-sm text-red-500 text-center">{state.message}</p>
            )}

            {/* Buttons Area */}
            <div className="mt-6 flex gap-3">
                <Link
                    href="/"
                    className="flex-1 flex justify-center items-center h-10 rounded-lg bg-gray-100 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button 
                    aria-disabled={isPending} 
                    className="flex-1 flex justify-center items-center h-10 rounded-lg bg-red-700 text-white hover:bg-red-600 font-bold shadow-md transition-colors"
                >
                    {isPending ? 'Creating...' : 'Sign Up'}
                </Button>
            </div>
        </form>
    );
}