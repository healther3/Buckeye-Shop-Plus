'use client'

import { CommentState, createComment } from "../lib/actions";
import { useActionState, useState } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePermissions } from '@/app/lib/hooks/use-permission';

export default function CreateCommentForm({product_id, user_id}
    :{ product_id: string, user_id?: string | undefined}) {
        
    const { session, hasPermission } = usePermissions();
    const canCreateComment = hasPermission('create_comment');    

    const initialState : CommentState= {errors:{}, message: ""};
    const CreateComment = createComment.bind(null,user_id || '',product_id);
    const [state, formAction, isPending] = useActionState(CreateComment, initialState);
    const [rating, setRating] = useState(5);
    // console.log('Session:', session);
    // console.log('User permissions:', session?.user?.permissions);
    // console.log('Can create comment:', canCreateComment);

       // not login
    if (!user_id) {
        return(
               <div className="bg-white text-gray-900 min-h-screen p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h3 className="text-gray-900 font-semibold mb-2">Please login</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs">
                    Login first to make a comment
                </p>
                <Link href="/login">
                    <button className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition duration-200 shadow-sm flex items-center gap-2">
                        Go to login page
                    </button>
                </Link>
            </div>
            </div>
        );
    }

    if(!canCreateComment)
    {
         return(
               <div className="bg-white text-gray-900 min-h-screen p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h3 className="text-gray-900 font-semibold mb-2">You don't have the permission to create comment</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs">
                    ask admin for more information
                </p>
            </div>
            </div>
        );
    }
    
    //is login
    return(
               <div className="bg-white text-gray-900 min-h-screen p-8">
                <div className="max-w-4xl mx-auto space-y-8">
            <h3 className="text-3xl font-extrabold text-gray-800 border-b-2 border-gray-300 pb-2">Write your own Comment</h3>
            
            <form action={formAction}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                    </label>
                    
                    <input type="hidden" name="rating" value={rating} />

                    <div className="flex gap-3">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => setRating(num)}
                                className={`
                                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                    ${rating === num 
                                        ? 'bg-gray-900 text-white shadow-md scale-110' 
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200' 
                                    }
                                `}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                    {state.errors?.rating && (
                        <p className="mt-1 text-sm text-red-500">{state.errors.rating}</p>
                    )}
                </div>

                <div className="mb-6">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                    </label>
                    <textarea
                        id="comment"
                        name="comment"
                        rows={4}
                        placeholder="write a comment for the product"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition duration-200 resize-none bg-gray-50"
                    />
                    {state.errors?.comment && (
                        <p className="mt-1 text-sm text-red-500">{state.errors.comment}</p>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-red-500 font-medium">
                        {state.message}
                    </p>
                    
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isPending && <ClockIcon className="w-4 h-4 animate-spin" />}
                        {isPending ? 'submitting...' : 'submit comment'}
                    </button>
                </div>
            </form>
        </div>
    </div>

    );

}