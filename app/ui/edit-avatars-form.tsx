'use client';

import { updateUserAvatar, UserState } from '@/app/lib/actions';
import { useActionState, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { User } from '@/app/lib/definitions'; 

export default function EditUserAvatarForm({ user }: { user: User }) {
    const initialState: UserState = { message: '', errors: {} };
    const SYSTEM_AVATARS = [
        '/avatars/1.jpg',
        '/avatars/2.jpg',
        '/avatars/3.webp',
        '/avatars/4.webp',
        '/avatars/5.webp',
        '/avatars/6.png',
    ];
    const DEFAULT_AVATAR = SYSTEM_AVATARS[0];
    const updateUserAvatarWithId = updateUserAvatar.bind(null, user.id);
    const [state, formAction, isPending] = useActionState(updateUserAvatarWithId, initialState);
    const [previewUrl, setPreviewUrl] = useState<string>(user.imageUrl && user.imageUrl.trim() !== '' ? user.imageUrl : DEFAULT_AVATAR);
    const [selectedSystemAvatar, setSelectedSystemAvatar] = useState<string>('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setSelectedSystemAvatar('');
    } else {
      setPreviewUrl(user.imageUrl);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSystemAvatarClick = (url: string) => {
    setSelectedSystemAvatar(url); 
    setPreviewUrl(url); 
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form action={formAction} className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Choose Your Avatar</h2>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        <div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gray-100 shadow-inner">
            <Image 
              src={previewUrl} 
              alt="Avatar Preview" 
              fill 
              className="object-cover"
            />
          </div>
          <p className="text-sm text-gray-500 font-medium">Current Preview</p>
        </div>

        <div className="w-full md:w-2/3 space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Default Avatars</label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
              {SYSTEM_AVATARS.map((avatar, index) => (
                <button
                  key={index}
                  type="button" 
                  onClick={() => handleSystemAvatarClick(avatar)}
                  className={`relative w-14 h-14 rounded-full overflow-hidden transition-all duration-200 
                    ${selectedSystemAvatar === avatar 
                      ? 'ring-4 ring-blue-500 scale-110' 
                      : 'hover:ring-2 hover:ring-gray-300 hover:scale-105 opacity-80 hover:opacity-100'} 
                  `}
                >
                  <Image src={avatar} alt={`System avatar ${index}`} fill className="object-cover" />
                </button>
              ))}
            </div>
            <input type="hidden" name="systemAvatar" value={selectedSystemAvatar} />
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Or Upload Your Own</label>
            <div className="flex items-center gap-4">
              <label 
                htmlFor="avatar-upload" 
                className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 transition text-sm font-medium flex items-center gap-2"
              >
                📁 Choose File
              </label>
              <input
                id="avatar-upload"
                type="file"
                name="image"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              <span className="text-xs text-gray-400">
                Max 5MB. JPG, PNG, WebP.
              </span>
            </div>
            {state.errors?.image && (
               <p className="text-red-500 text-sm mt-1">{state.errors.image}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold shadow-sm"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      
      {state.message && (
        <p className={`mt-4 text-center text-sm ${state.errors ? 'text-red-500' : 'text-green-600'}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}