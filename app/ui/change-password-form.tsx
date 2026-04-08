'use client'
import { useActionState } from 'react'
import { updateUserPassword } from '../lib/actions';
import { User } from '@/app/lib/definitions';
import { Button } from '@/app/ui/Button'

export default function ChangePassowordForm({user} :{user : User})
{
    const initialState = { message:'', errors:{}};
    const UpdatePasswordWithId = updateUserPassword.bind(null, user.id)
    const [state, formAction, isPending] = useActionState(UpdatePasswordWithId, initialState);
    return(
    <form action={formAction} className="space-y-0">
            <label htmlFor="password">Password:</label><br/>
            <input type="password"
                    id="password" 
                    name="password" 
                    placeholder='enter new password to reset password' 
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
            /><br/>
            <div id="password-error" aria-live="polite" aria-atomic="true">
                {state.errors?.password && 
                  state.errors.password.map((error: string) => (
                    <p key={error} style={{color: 'red', fontSize: '12px', margin: 0}}>
                      {error}
                    </p>
                ))}
            </div>
    <Button aria-disabled={isPending} className="w-auto px-3">
            {isPending ? 'Creating...' : 'Reset password'}
    </Button>
    </form>
    );
    
}