import { signOut } from "@/auth";
export default function SignOutButton() {
  return (
    <form action={async() => {
        'use server';
        await signOut({ redirectTo: '/' });
      }}
    >
      <button 
        className="fixed bottom-10 left-4 z-50 p-2 font-medium text-gray-600 hover:text-black transition-colors"
      >
        Sign Out
      </button>
    </form>
  );
}