import Link from "next/link";
import SignOutButton from "@/app/ui/sign-out-button";
import { auth, signOut } from '@/auth';
import Image from 'next/image';
import { fetchUserByAuthUser } from "@/app/lib/data";

export default async function Navbar() {

        const session = await auth();
        const user = session?.user;
        const isLoggedin = !!user;
        let imageUrl = user?.imageUrl;
        if(isLoggedin) {
           const currentUser = await fetchUserByAuthUser();
           imageUrl = currentUser.imageUrl;
        }
    return (
        //stick the nav bar on top, background is white, shadow at bottom
        <nav className = "sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className =  "max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Left side: Logo*/}
        <Link href="/" className="font-extrabold text-xl tracking-tight text-gray-900 hover:text-red-700 transition-colors">
          Buckeye<span className="text-red-700">Shopping</span>
        </Link>

        {/* Right side: Navigation Links*/}

        <div className = "flex items-center space-x-8 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-red-700 transition-colors">
            Home
            </Link>

            <Link href = "/categories" className = "hover:text-red-700 transition-colors">
            Categories
            </Link> 

            {/* Login/Logout Button, outstanding style*/}
            {!isLoggedin?
            <Link href = "/login" className = "px-4 py-2 bg-red-900 text-white rounded-full hover:bg-red-700 tranition-colors">
            Login
            </Link>
            :
            <form action={async() => {
            'use server';
            await signOut({ redirectTo: '/' });
            }}
            >
            <button 
            className="hover:text-red-700 transition-colors"
            >
                Sign Out
            </button>
            </form>
            }
            {isLoggedin&&
            <Link href = "/profile" className = "px-4 py-2 bg-red-900 text-white rounded-full hover:bg-red-700 tranition-colors">
            {user.name}
            </Link>
            }
            </div>

            {isLoggedin&&
            <Link 
                href="/profile" 
                className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-4xl overflow-hidden hover:opacity-80 transition-opacity"
            >
                    {imageUrl ? (
                    <div className="relative h-full w-full">
                <Image
                    src={imageUrl}
                    alt={user.name || 'User'}
                    fill
                    className="object-cover"
        />
      </div>
    ) : (
      <span>👤</span>
    )}
  </Link>
                }        
            </div>
        </nav>
    );
}