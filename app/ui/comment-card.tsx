'use client'

import { Comment } from '@/app/lib/definitions';
import { StarIcon, TrashIcon } from '@heroicons/react/24/solid';
import { users } from '../lib/placeholder-data';
import { deleteComment } from '../lib/actions';
import { useTransition } from 'react';
import { usePermissions } from '../lib/hooks/use-permission';

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex space-x-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
            key={star}
            className={`w-5 h-5${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400' 
              : 'fill-gray-200 text-gray-200'     
          }`}
            />
        ))}
        </div>
    );
}

export default function CommentCard({ comment }: {comment: Comment}){
  const { session, hasPermission } = usePermissions();
  const canDeleteComment = hasPermission('delete_comment') || (session?.user.id == comment.user_id); 
      
    console.log(users);
    const userName = comment.users?.name;
    const userAvatar = comment.users?.imageUrl;
    const dateStr = new Date(comment.create_data).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });    
    const [isPending, startTransition] = useTransition();
   
    async function handleDelete(e : React.MouseEvent)
    {
        
        e.preventDefault();
        e.stopPropagation();
        const confirmed = confirm('Delete the product?');
        if(!confirmed) return;
        await deleteComment(comment.id);  
        
    }

  return (
  <div className="bg-white border-b border-gray-200 p-6 last:border-0">
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-start justify-between mb-4">
        
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
              <img 
                src={userAvatar} 
                alt={userName} 
                className="w-full h-full object-cover"
              />
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 text-sm">
              {userName}
            </span>
            <span className="text-xs text-gray-500 mt-0.5">
              {dateStr}
            </span>
          </div>
        </div>
      <div className="flex items-center gap-3">
        <StarRating rating={comment.rating} />
        
        {canDeleteComment && (<button
          onClick={handleDelete} 
          disabled={isPending}
          className="p-1 text-gray-400 hover:text-red-500 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="Delete comment"
        ><TrashIcon className="w-5 h-5" /></button>)}
        </div>
      </div>

      <div className="pl-1 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
        {comment.comment ? comment.comment : <span className="text-gray-400 italic">(nothing)</span>}
      </div>
    </div>
    </div>
  );}